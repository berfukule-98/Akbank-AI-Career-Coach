# KariyerPusula: Yapay Zeka Mülakat Simülatörü ve Kariyer Koçu

Kullanıcının katılacağı mülakattaki değerlendirici unvanına (Örn. VP of Engineering, Lead Data Scientist, HR Business Partner, vb.) özel potansiyel sorular üreten, kullanıcının verdiği cevapları yapay zeka ile puanlayıp derinlemesine geri bildirim sunan interaktif mülakat simülatörü ve kullanıcının tamamladığı eğitim içeriklerini analiz ederek bir sonraki kariyer adımı için yetkinlik açığı analizi ile kişiselleştirilmiş eğitim yol haritası çıkaran kapsamlı kariyer koçluğu platformu.

---

## Kullanıcı Tercihleri ve Kritik Kararlar

> [!IMPORTANT]
> Kullanıcı ile 1. Aşama soru-cevap sürecinde teyit edilen kararlar doğrultusunda sistem mimarisi şekillendirilmiştir:

- **Mülakat Hazırlık Modeli**: Puanlama ve detaylı yapay zeka geri bildirimi içeren simülasyon (soru bazında güçlü yönler, gelişim alanları, STAR metodolojisi uyumu ve 100 üzerinden puanlama).
- **Eğitim ve Gelişim Analizi**: Kullanıcının geçmiş eğitim içeriklerini ayrıştırıp yetkinlik açığı analizi çıkaran, öncelikli eksik yetkinlikleri belirleyen ve adım adım bir sonraki seviye eğitim müfredatı / yol haritası oluşturan koçluk modülü.
- **Dil Politikası**: Tamamen Türkçe arayüz, Türkçe istem mühendisliği ve Türkçe analitik geri bildirim raporlaması.

---

## 1. Genel Bakış ve Temel Konsept

- **Ne Yapar**:
  1. **Unvana Özel Mülakat Soru Üretici & Simülasyon**: Kullanıcı mülakat yapacağı kişinin unvanını (örneğin "Head of Product", "Engineering Manager", "Senior Recruiter"), hedef pozisyonu ve deneyim seviyesini girer. Gemini 3.8 Flash modeli, bu unvana ve bakış açısına uygun teknik, davranışsal, kültürel ve stratejik sorular üretir.
  2. **İnteraktif Pratik ve Yapay Zeka Değerlendirmesi**: Kullanıcı her soruyu simüle ederek yazılı veya sesli dikte ile yanıtlayabilir. Yapay zeka adayın yanıtını; içerik derinliği, STAR formatı uygunluğu (Durum, Görev, Eylem, Sonuç), teknik tutarlılık ve profesyonel ifade açısından değerlendirir; puan verir ve örnek ideal cevap sunar.
  3. **Eğitim İçeriği Analizi ve Yetkinlik Açığı Tespiti**: Kullanıcı katıldığı eğitimleri (kurs isimleri, modül içerikleri, sertifikalar veya ders özetleri) ekler.
  4. **Bir Sonraki Adım Eğitim Yol Haritası**: Sistem, tamamlanan eğitimleri hedef pozisyonla kıyaslayarak eksik alanları (Skill Gap) haritalandırır. Ardından bir sonraki kariyer sıçraması için alınması gereken somut eğitim konuları, modül modül müfredat önerisi, pratik proje fikirleri ve çalışma takvimi üretir.
- **Hedef Kitle**: Yeni iş arayan veya terfi hedefleyen profesyoneller, kariyer değiştirenler ve mülakatlara stratejik hazırlanmak isteyen adaylar.
- **Sağlanan Değer**: Değerlendiricinin unvanına göre psikolojik ve teknik beklentileri önceden öngörebilme, güvenle pratik yapma ve eğitim yatırımlarını rastgele değil net bir kariyer mimarisiyle yönlendirebilme.

---

## 2. Kullanıcı Deneyimi ve Görsel Tasarım

### Ana Kullanıcı Akışları
1. **Mod Seçimi & Giriş Paneli**:
   - Üst sekmede iki net odak: **"1. Mülakat Simülatörü"** ve **"2. Eğitim & Kariyer Yol Haritası"**.
   - Hazır hızlı şablonlar (Örn: "Yazılım Mühendisi -> Engineering Manager Mülakatı", "Veri Analisti -> Head of BI", "Pazarlama Uzmanı -> CMO").
2. **Mülakat Hazırlık Akışı**:
   - Değerlendirici unvanı, şirket türü/sektör ve hedef rol girişi.
   - Yapay zeka tarafından üretilen soru setinin incelenmesi (teknik, davranışsal, liderlik kategorilerinde).
   - Simülasyon ekranına geçiş: Soru soru yanıtlama, anlık geri bildirim alma, 100 üzerinden başarı skoru ve "İdeal Cevap Karşılaştırması".
3. **Eğitim Analizi ve Yol Haritası Akışı**:
   - Alınan eğitimlerin eklenmesi (başlık, anahtar içerikler, kazanımlar).
   - "Yetkinlik Açığını Analiz Et ve Yol Haritası Çıkar" butonu ile Gemini çağrısı.
   - 3 sütunlu sonuç ekranı:
     - *Kazanılan Güçlü Yetkinlikler* (Önceki eğitimlerin özeti)
     - *Tespit Edilen Yetkinlik Açıkları* (Eksik kalan kritik alanlar)
     - *Bir Sonraki Adım Eğitim Müfredatı* (Önerilen kurs konuları, öğrenme hedefleri, proje önerileri ve tahmini süre).

### Görsel Kimlik ve Tasarım Sistemi
- **Tasarım Dili**: SaaS Yönetim Konsolu & Modern EdTech (Tailwind CSS tabanlı).
- **Renk Paleti (60-30-10 Disiplini)**:
  - `%60` Nötr Fon: Temiz arduvaz beyazı / açık gri (`#F8FAFC`, `#FFFFFF`), koyu mod desteği (`#0F172A`).
  - `%30` Yapısal Yüzeyler: İnce 1px kenarlıklar (`border-slate-200 dark:border-slate-800`), yapısal kartlar ve tipografik hiyerarşi.
  - `%10` Vurgu Rengi: Güven veren derin lacivert / kobalt mavi (`#2563EB`) ve başarı zümrütü (`#059669`).
- **Tipografi**: Display ve arayüz başlıklarında `Plus Jakarta Sans`, veri ve metriklerde `tabular-nums`.
- **Anti-Slop Kuralları**:
  - Statik hap/hapçık etiketler yerine temiz ayraçlı metinler (`·`, `/`).
  - Sahte süslemeler veya anlamsız puan sayaçları yerine somut rubrik kriterleri (Derinlik, Netlik, STAR Uyumu).
  - Her butonun tam çalışan gerçek işlevselliği.

---

## 3. Temel Ürün Kararları ve Tercihler

- **Karar 1: Yapay Zeka Entegrasyon Mimarisi (Server-Side Proxy)**:
  - *Seçilen Yaklaşım*: Express sunucu tarafında `@google/genai` SDK'sı ve `gemini-3.8-flash` modeli ile yapılandırılmış JSON şemalı çıktılar (`responseMimeType: "application/json"`).
  - *Neden*: API anahtarının istemcide açığa çıkmaması, yüksek hız, yanıt tutarlılığı ve yapılandırılmış veri modelleri (sorular dizisi, geri bildirim nesnesi, eğitim planı nesnesi).
- **Karar 2: Veri Saklama ve Yerel Hafıza**:
  - *Seçilen Yaklaşım*: Simülasyon geçmişi, girilen eğitimler ve oluşturulan yol haritalarının `localStorage` ile kalıcı hale getirilmesi.
  - *Neden*: Kullanıcı sayfayı yenilediğinde veya mülakat öncesi tekrar baktığında girdiği geçmiş eğitimleri ve mülakat notlarını kaybetmez.
- **Karar 3: Sesli Dikte ve Dışa Aktarma**:
  - *Seçilen Yaklaşım*: Web Speech API ile Türkçe sesli yanıt dikte etme opsiyonu ve mülakat/eğitim planını Markdown/PDF metni olarak kopyalama / indirme imkanı.

---

## 4. Teknik Mimari ve Veri Stratejisi

```
┌────────────────────────────────────────────────────────────────────────┐
│                        KULLANICI ARAYÜZÜ (React)                       │
│                                                                        │
│  ┌──────────────────────┐  ┌────────────────────┐  ┌─────────────────┐ │
│  │ Üst Çubuk / Başlık   │  │ Mülakat Simülatörü │  │ Kariyer Yol     │ │
│  │ (Mod Değiştirici)    │  │ (Unvan + Cevaplar) │  │ Haritası        │ │
│  └──────────────────────┘  └────────────────────┘  └─────────────────┘ │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP JSON İstekleri
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        SERVER PROXY (Express API)                      │
│                                                                        │
│  /api/interview/generate-questions  --> Gemini 3.8 Flash (JSON)        │
│  /api/interview/evaluate-answer     --> Gemini 3.8 Flash (Rubrik)      │
│  /api/career/analyze-training       --> Gemini 3.8 Flash (Gap & Path)  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Google GenAI SDK (@google/genai)                     │
│                   Model: 'gemini-3.8-flash'                            │
└────────────────────────────────────────────────────────────────────────┘
```

### Veri Tipleri & Durum Yönetimi
1. **Mülakat Sorusu (`InterviewQuestion`)**:
   - `id`: string
   - `question`: string
   - `category`: "Teknik" | "Davranışsal" | "Stratejik / Vizyon" | "Problem Çözme"
   - `interviewerPerspective`: Unvana göre bu sorunun sorulma amacı (Örn: "VP of Eng bu soruda ölçeklenebilirlik vizyonunuza odaklanır").
   - `keyTip`: Adaya özel hazırlık ipucu.
2. **Cevap Değerlendirmesi (`AnswerEvaluation`)**:
   - `score`: 0-100 puan
   - `strengths`: string[] (güçlü bulunan yanlar)
   - `improvements`: string[] (geliştirilmesi gereken noktalar)
   - `starAnalysis`: STAR metodolojisi açısından değerlendirme
   - `idealAnswerSummary`: Modelin sunduğu benchmark örnek yanıt
3. **Eğitim & Kariyer Analizi (`CareerRoadmap`)**:
   - `existingSkillsSummary`: Mevcut kazanımlar
   - `skillGaps`: Eksik kalan yetkinlikler ve önemi
   - `recommendedCourses`: Alınması önerilen eğitim modülleri (başlık, seviye, içerik detayları, tahmini süre)
   - `capstoneProject`: Öğrenilenleri taçlandıracak somut portfolyo proje önerisi
   - `strategicAdvice`: Kariyer koçundan 2-3 stratejik öneri

---

## 5. Doğrulama ve Test Adımları

1. **Sunucu & İstemci Derleme**: `npm run build` ile TypeScript derlemesini ve bağımlılıkları doğrulama.
2. **Mülakat Soru Üretimi Testi**: Farklı unvanlar (Örn: "Yazılım Direktörü", "Pazarlama Müdürü", "İnsan Kaynakları Uzmanı") ile test ederek unvana özgü soru ve bakış açısı geldiğini teyit etme.
3. **Simülasyon Değerlendirme Testi**: Örnek bir yanıt yazarak yapay zekanın 100 üzerinden puanlama ve STAR analizi ürettiğini doğrulama.
4. **Eğitim Yol Haritası Testi**: Tamamlanmış eğitim içerikleri verilerek yetkinlik açığı ve somut bir sonraki adım eğitim planının oluşturulduğunu doğrulama.
