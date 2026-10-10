import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini initialization as mandated by skill guidelines
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

async function generateWithFallback(params: {
  contents: string;
  config: any;
}) {
  try {
    return await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: params.contents,
      config: params.config,
    });
  } catch (error: any) {
    console.warn('Primary model error, attempting gemini-3.1-flash-lite fallback:', error?.message);
    return await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: params.contents,
      config: params.config,
    });
  }
}

/**
 * 1. Mülakat Soruları Üretim Endpoint'i
 * Değerlendirici unvanı, hedef rol ve deneyim seviyesine göre unvana özel sorular üretir.
 */
app.post('/api/interview/generate-questions', async (req, res) => {
  try {
    const {
      interviewerTitle,
      targetRole,
      experienceLevel,
      companyContext,
      questionCount = 5,
    } = req.body;

    if (!interviewerTitle || !targetRole) {
      return res.status(400).json({
        error: 'Lütfen değerlendirici unvanını ve hedef pozisyonu belirtin.',
      });
    }

    const prompt = `Sen 15+ yıllık tecrübeye sahip kıdemli bir kariyer koçu ve mülakat simülatörüsün.
Aşağıdaki adayın gireceği mülakat bilgilerine göre, değerlendirici kişinin unvanının psikolojisini, önceliklerini ve bakış açısını yansıtan ${questionCount} adet soru hazırla.

BİLGİLER:
- Mülakatı Yapacak Kişinin Unvanı (Title): "${interviewerTitle}"
- Adayın Hedef Pozisyonu: "${targetRole}"
- Deneyim Seviyesi: "${experienceLevel || 'Belirtilmedi'}"
- Şirket / Sektör Bağlamı: "${companyContext || 'Genel Teknoloji Şirketi'}"

GÖREVLER:
1. Değerlendirici Unvan Analizi (interviewerAnalysis):
   - coreFocus: Bu unvandaki kişi adayı değerlendirirken EN ÇOK neye odaklanır? (Örn: VP of Eng ölçeklenebilirlik, maliyet ve liderliğe bakar; Tech Recruiter motivasyon, iletişim ve potansiyele bakar; Lead Developer kod standartları, mimari kararlar ve edge case'lere bakar).
   - evaluationStyle: Mülakat tarzı ve adayda aradığı sinyaller.
   - whatImpressionToLeave: Aday bu kişide mülakat sonunda nasıl bir etki bırakmalı?

2. Soru Listesi (${questionCount} adet):
   - Her soru gerçekçi, derinlikli ve tam bu unvanın ağzından çıkacak şekilde olmalıdır.
   - Kategori seçenekleri: 'Teknik Yetkinlik', 'Davranışsal (STAR)', 'Stratejik & Liderlik', 'Problem Çözme & Durumsal'.
   - interviewerPerspective: Bu unvandaki kişi bu soruyu neden soruyor, altında hangi tehlike sinyalini (red flag) veya yetkinliği sınıyor?
   - keyTip: Aday bu soruya hazırlanırken hangi altın kurala dikkat etmeli?
   - sampleBestPracticePoints: Cevapta mutlaka yer alması gereken 2-3 somut anahtar nokta.

Tüm çıktı Türkçe dilinde ve belirtilen JSON şemasına tam uygun olmalıdır.`;

    const response = await generateWithFallback({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            interviewerAnalysis: {
              type: Type.OBJECT,
              properties: {
                coreFocus: { type: Type.STRING },
                evaluationStyle: { type: Type.STRING },
                whatImpressionToLeave: { type: Type.STRING },
              },
              required: ['coreFocus', 'evaluationStyle', 'whatImpressionToLeave'],
            },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  question: { type: Type.STRING },
                  category: {
                    type: Type.STRING,
                    description: 'Teknik Yetkinlik, Davranışsal (STAR), Stratejik & Liderlik, Problem Çözme & Durumsal',
                  },
                  interviewerPerspective: { type: Type.STRING },
                  keyTip: { type: Type.STRING },
                  sampleBestPracticePoints: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: [
                  'id',
                  'question',
                  'category',
                  'interviewerPerspective',
                  'keyTip',
                  'sampleBestPracticePoints',
                ],
              },
            },
          },
          required: ['interviewerAnalysis', 'questions'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('generate-questions error:', error);
    return res.status(500).json({
      error: 'Mülakat soruları üretilirken bir hata oluştu: ' + (error?.message || 'Bilinmeyen hata'),
    });
  }
});

/**
 * 2. Simülasyon Cevap Puanlama & Yapay Zeka Geri Bildirimi
 * Adayın cevabını unvan sahibinin beklentilerine göre puanlar, STAR analizini yapar ve ideal cevap sunar.
 */
app.post('/api/interview/evaluate-answer', async (req, res) => {
  try {
    const {
      question,
      category,
      interviewerTitle,
      targetRole,
      experienceLevel,
      candidateAnswer,
    } = req.body;

    if (!question || !candidateAnswer) {
      return res.status(400).json({
        error: 'Lütfen mülakat sorusunu ve adayın cevabını gönderin.',
      });
    }

    const prompt = `Sen profesyonel ve objektif bir mülakat değerlendiricisisin.
Aşağıda verilen soruya adayın verdiği yanıtı, mülakatı yapan kişinin unvanının beklenti ve standartlarına göre detaylı şekilde puanla ve geri bildirim sağla.

MÜLAKAT BİLGİLERİ:
- Değerlendirici Unvanı: "${interviewerTitle || 'Kıdemli Mülakatçı'}"
- Hedef Pozisyon: "${targetRole || 'Genel Rol'}"
- Deneyim Seviyesi: "${experienceLevel || 'Orta Seviye'}"
- Soru Kategorisi: "${category || 'Genel'}"

SORU:
"${question}"

ADAYIN VERDİĞİ CEVAP:
"${candidateAnswer}"

DEĞERLENDİRME KRİTERLERİ:
1. Puan (score): 0 - 100 arasında tam puan.
   (85-100: Olağanüstü/Teklif getiren, 70-84: İyi ancak geliştirilebilir, 50-69: Yetersiz derinlik/örnek eksik, 0-49: Zayıf/soruyu karşılamayan).
2. Genel Değerlendirme Özeti (summaryEvaluation): 2-3 cümlelik yapıcı özet.
3. Güçlü Yönler (strengths): Adayın cevabında öne çıkan 2-4 olumlu yön.
4. Geliştirilmesi Gereken Noktalar (improvements): Eksik bırakılan, yüzeysel geçilen veya riskli görülebilecek 2-4 nokta.
5. STAR Metodolojisi Değerlendirmesi (starAssessment):
   - situationTaskScore: Durum ve Görev aktarımı nasıl?
   - actionScore: Aday bizzat kendisinin ne yaptığını (Ben dili) ne kadar somut anlattı?
   - resultScore: Elde edilen sayısal/niteliksel sonuçlar ve kazanımlar paylaşıldı mı?
   - starFeedback: STAR dengesini kurmaya dair doğrudan koçluk tavsiyesi.
6. İdeal Örnek Cevap (idealAnswer): Bu soruya bu unvandaki bir yöneticinin duymak isteyeceği, mülakatta 100 tam puan alacak profesyonel, akıcı ve ilham verici bir örnek yanıt metni oluştur.
7. Eyleme Dönüştürülebilir İpuçları (actionableTips): Adayın bir sonraki denemesinde uygulayabileceği 2-3 somut pratik öneri.

Tüm metin Türkçe olmalı ve belirtilen JSON şemasına tam uymalıdır.`;

    const response = await generateWithFallback({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            summaryEvaluation: { type: Type.STRING },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            improvements: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            starAssessment: {
              type: Type.OBJECT,
              properties: {
                situationTaskScore: { type: Type.STRING },
                actionScore: { type: Type.STRING },
                resultScore: { type: Type.STRING },
                starFeedback: { type: Type.STRING },
              },
              required: [
                'situationTaskScore',
                'actionScore',
                'resultScore',
                'starFeedback',
              ],
            },
            idealAnswer: { type: Type.STRING },
            actionableTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            'score',
            'summaryEvaluation',
            'strengths',
            'improvements',
            'starAssessment',
            'idealAnswer',
            'actionableTips',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('evaluate-answer error:', error);
    return res.status(500).json({
      error: 'Cevap değerlendirilirken bir hata oluştu: ' + (error?.message || 'Bilinmeyen hata'),
    });
  }
});

/**
 * 3. Eğitim İçerikleri Analizi & Bir Sonraki Adım Eğitim Yol Haritası
 * Adayın tamamladığı eğitim içeriklerini analiz ederek yetkinlik açığı çıkarır ve sonraki adım eğitim planını oluşturur.
 */
app.post('/api/career/analyze-training', async (req, res) => {
  try {
    const {
      trainings,
      currentRoleOrBackground,
      targetRole,
      experienceLevel,
    } = req.body;

    if (!trainings || !Array.isArray(trainings) || trainings.length === 0) {
      return res.status(400).json({
        error: 'Lütfen katıldığınız en az bir eğitimin içeriğini girin.',
      });
    }

    const trainingSummaryText = trainings
      .map(
        (t: any, index: number) =>
          `[Eğitim #${index + 1}]
Başlık: ${t.title}
Platform / Kurum: ${t.providerOrPlatform || 'Belirtilmedi'}
İçerik Modülleri & Detaylar: ${t.keyModulesOrContent}
Tamamlanma Yılı: ${t.completedYear || 'Belirtilmedi'}
Özel Notlar / Projeler: ${t.notes || 'Yok'}`
      )
      .join('\n\n');

    const prompt = `Sen uluslararası düzeyde bir baş mühendislik koçu ve kariyer mentörüsün.
Aşağıda adayın bugüne kadar katıldığı ve tamamladığı eğitimlerin detaylı içerikleri listelenmiştir.

ADAY PROFİLİ VE HEDEF:
- Mevcut Durum / Arka Plan: "${currentRoleOrBackground || 'Öğrenci veya Gelişmekte Olan Profesyonel'}"
- Hedef Rol / Pozisyon: "${targetRole || 'Kıdemli Rol'}"
- Deneyim / Kariyer Seviyesi: "${experienceLevel || 'Genel'}"

KATILDIĞI EĞİTİMLERİN İÇERİKLERİ:
${trainingSummaryText}

ANALİZ VE GÖREVLER:
1. profileSynthesis: Adayın mevcut eğitim birikiminin net, profesyonel bir özeti (Nelerde temeli sağlam, ne tür bir altyapı oluşturmuş?).
2. masteredSkills: Mevcut eğitimlerden net olarak kazanılmış 4-8 somut yetkinlik.
3. skillGaps: Hedeflenen pozisyona tam anlamıyla hazır olmak için kritik öneme sahip eksik yetkinlikler (Skill Gap Analizi). Her biri için:
   - skill: Eksik yetkinliğin adı
   - importance: 'Kritik' | 'Yüksek' | 'Orta'
   - reason: Neden bu yetkinlik hedef rolde aranıyor ve mülakatlarda adayı eler?
   - currentLevelVsRequired: Adayın şu anki seviyesi vs aranan seviye.
4. nextStepRoadmap (Sıralı 3 ila 4 somut eğitim adımı):
   Adayın bundan sonra alması gereken eğitimleri sırasıyla belirle. (Rastgele genel öneriler değil, modül modül konuları olan hedef odaklı bir müfredat planı):
   - stepNumber: Sıra numarası (1, 2, 3...)
   - courseTitle: Önerilen eğitimin tam spesifik başlığı (Örn: "Dağıtık Sistem Mimarisi ve Event-Driven Tasarım")
   - type: 'Online Kurs' | 'Proje Tabanlı Pratik' | 'Derinlemesine Kitap / Makale' | 'Sertifikasyon Hazırlığı'
   - learningObjectives: Bu eğitimden ne kazanılmalı? (2-3 madde)
   - suggestedTopics: Müfredatta mutlaka yer alması gereken 3-4 alt konu/modül
   - estimatedDuration: Tahmini tamamlanma süresi (Örn: "4 Hafta - Haftada 6-8 Saat")
   - whyThisNext: Neden önceki eğitimlerin hemen ardından bu eğitim alınmalı?
5. capstoneProjectRecommendation: Bu yeni eğitimleri tamamlayınca adayın portfolyosuna ekleyip mülakatlarda anlatacağı taç proje önerisi (title, description, keyTechnologies, howItProvesSkills).
6. coachStrategicAdvice: Kariyer koçundan mülakatlara ve kariyer sıçramasına yönelik 2-4 bilgece ve stratejik tavsiye.

Tüm çıktı Türkçe dilinde ve belirtilen JSON şemasına tam uygun olmalıdır.`;

    const response = await generateWithFallback({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            profileSynthesis: { type: Type.STRING },
            masteredSkills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            skillGaps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  skill: { type: Type.STRING },
                  importance: {
                    type: Type.STRING,
                    description: 'Kritik, Yüksek, Orta',
                  },
                  reason: { type: Type.STRING },
                  currentLevelVsRequired: { type: Type.STRING },
                },
                required: [
                  'skill',
                  'importance',
                  'reason',
                  'currentLevelVsRequired',
                ],
              },
            },
            nextStepRoadmap: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  stepNumber: { type: Type.INTEGER },
                  courseTitle: { type: Type.STRING },
                  type: {
                    type: Type.STRING,
                    description: 'Online Kurs, Proje Tabanlı Pratik, Derinlemesine Kitap / Makale, Sertifikasyon Hazırlığı',
                  },
                  learningObjectives: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  suggestedTopics: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  estimatedDuration: { type: Type.STRING },
                  whyThisNext: { type: Type.STRING },
                },
                required: [
                  'stepNumber',
                  'courseTitle',
                  'type',
                  'learningObjectives',
                  'suggestedTopics',
                  'estimatedDuration',
                  'whyThisNext',
                ],
              },
            },
            capstoneProjectRecommendation: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                keyTechnologies: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                howItProvesSkills: { type: Type.STRING },
              },
              required: [
                'title',
                'description',
                'keyTechnologies',
                'howItProvesSkills',
              ],
            },
            coachStrategicAdvice: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            'profileSynthesis',
            'masteredSkills',
            'skillGaps',
            'nextStepRoadmap',
            'capstoneProjectRecommendation',
            'coachStrategicAdvice',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('analyze-training error:', error);
    return res.status(500).json({
      error: 'Eğitim analizi yapılırken bir hata oluştu: ' + (error?.message || 'Bilinmeyen hata'),
    });
  }
});

// Production or Vite development middleware mounting
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, () => {
    console.log(`🚀 KariyerPusula sunucusu ${port} portunda çalışıyor.`);
  });
}

startServer();
