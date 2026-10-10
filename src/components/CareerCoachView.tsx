import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Award,
  Layers,
  Copy,
  Check,
  Calendar,
  Compass,
  FileText
} from 'lucide-react';
import {
  TrainingItem,
  CareerRoadmapAnalysis,
  ExperienceLevel,
} from '../types/index.ts';
import { analyzeTrainingsForRoadmap } from '../services/api.ts';

interface CareerCoachViewProps {
  initialTrainings?: TrainingItem[];
  initialTargetRole?: string;
  initialBackground?: string;
}

export const CareerCoachView: React.FC<CareerCoachViewProps> = ({
  initialTrainings = [],
  initialTargetRole = 'Senior Frontend Developer',
  initialBackground = 'Junior Frontend Developer',
}) => {
  const [trainings, setTrainings] = useState<TrainingItem[]>(
    initialTrainings.length > 0
      ? initialTrainings
      : [
          {
            id: 'sample-1',
            title: 'Modern React & TypeScript Masterclass',
            providerOrPlatform: 'Udemy / Coursera',
            keyModulesOrContent:
              'React 18+ Hooks, Custom Hooks, Strict TypeScript tipleri, Component yaşam döngüsü, Context API ve temel optimizasyon teknikleri.',
            completedYear: '2025',
            notes: 'Öğrenilenlerle 2 adet portfolyo SPA projesi geliştirildi.',
          },
          {
            id: 'sample-2',
            title: 'Web Performansı ve Global State Yönetimi',
            providerOrPlatform: 'Frontend Masters',
            keyModulesOrContent:
              'Client state vs server state, Zustand, TanStack Query ile veri önbellekleme, Core Web Vitals (LCP, CLS, INP) optimizasyonu, Lazy loading.',
            completedYear: '2025',
            notes: 'Büyük liste görünümlerinde virtual scrolling uygulandı.',
          },
        ]
  );

  const [currentBackground, setCurrentBackground] = useState(initialBackground);
  const [targetRole, setTargetRole] = useState(initialTargetRole);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(
    'Yeni Mezun / Junior'
  );

  // New training form states
  const [isAddingTraining, setIsAddingTraining] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newProvider, setNewProvider] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newYear, setNewYear] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [roadmap, setRoadmap] = useState<CareerRoadmapAnalysis | null>(null);
  const [copiedReport, setCopiedReport] = useState(false);

  const handleAddTraining = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      setError('Lütfen eğitim başlığını ve içerik modüllerini doldurun.');
      return;
    }

    const newItem: TrainingItem = {
      id: 'train-' + Date.now(),
      title: newTitle.trim(),
      providerOrPlatform: newProvider.trim() || 'Kişisel / Bağımsız',
      keyModulesOrContent: newContent.trim(),
      completedYear: newYear.trim() || new Date().getFullYear().toString(),
      notes: newNotes.trim(),
    };

    setTrainings((prev) => [newItem, ...prev]);
    setNewTitle('');
    setNewProvider('');
    setNewContent('');
    setNewYear('');
    setNewNotes('');
    setIsAddingTraining(false);
    setError(null);
  };

  const handleDeleteTraining = (id: string) => {
    setTrainings((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAnalyze = async () => {
    if (trainings.length === 0) {
      setError('Lütfen analiz için katıldığınız en az bir eğitimi ekleyin.');
      return;
    }
    if (!targetRole.trim()) {
      setError('Lütfen hedef pozisyonunuzu belirtin.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await analyzeTrainingsForRoadmap({
        trainings,
        currentRoleOrBackground: currentBackground.trim(),
        targetRole: targetRole.trim(),
        experienceLevel,
      });

      setRoadmap(result);
    } catch (err: any) {
      setError(
        err?.message || 'Eğitim yol haritası hazırlanırken bir sorun oluştu.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyReportMarkdown = () => {
    if (!roadmap) return;

    const md = `# KariyerPusula: Eğitim Analizi ve Yol Haritası Raporu
**Mevcut Durum**: ${currentBackground}
**Hedef Pozisyon**: ${targetRole} (${experienceLevel})

## 1. Mevcut Eğitim Birikimi Özeti
${roadmap.profileSynthesis}

### Kazanılan Temel Yetkinlikler:
${roadmap.masteredSkills.map((s) => `- ${s}`).join('\n')}

## 2. Yetkinlik Açığı Analizi (Skill Gap)
${roadmap.skillGaps
  .map(
    (g) =>
      `### [${g.importance}] ${g.skill}\n- **Eksiklik Nedeni**: ${g.reason}\n- **Gereken Seviye**: ${g.currentLevelVsRequired}`
  )
  .join('\n\n')}

## 3. Sıradaki Eğitim Yol Haritası
${roadmap.nextStepRoadmap
  .map(
    (r) =>
      `### Adım ${r.stepNumber}: ${r.courseTitle} (${r.type})\n- **Tahmini Süre**: ${r.estimatedDuration}\n- **Neden Bu Eğitim?**: ${r.whyThisNext}\n- **Öğrenme Hedefleri**: ${r.learningObjectives.join(', ')}\n- **Müfredat**: ${r.suggestedTopics.join(' | ')}`
  )
  .join('\n\n')}

## 4. Taç Portfolyo Proje Önerisi: ${roadmap.capstoneProjectRecommendation.title}
${roadmap.capstoneProjectRecommendation.description}
- **Teknolojiler**: ${roadmap.capstoneProjectRecommendation.keyTechnologies.join(', ')}
- **Mülakatta Sunuş**: ${roadmap.capstoneProjectRecommendation.howItProvesSkills}

## 5. Kariyer Koçunun Stratejik Tavsiyeleri
${roadmap.coachStrategicAdvice.map((a) => `- ${a}`).join('\n')}
`;

    navigator.clipboard.writeText(md);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Intro Hero */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 mb-2">
            <span>YETKİNLİK AÇIĞI VE EĞİTİM MÜFREDATI</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-500 font-normal">Kişiselleştirilmiş Öğrenme Planı</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Katıldığınız Eğitimlerin İçeriklerine Göre Sıradaki Adım Analizi
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
            Bugüne kadar katıldığınız kursları, üniversite derslerini ve sertifika içeriklerini girin. Yapay zeka kariyer koçu; mevcut birikiminizi hedef pozisyonun gereksinimleriyle karşılaştırıp yetkinlik açıklarınızı tespit etsin ve bir sonraki aşamada almanız gereken somut eğitimleri sıralı müfredat olarak çıkarsın.
          </p>
        </div>

        {/* Profile Inputs */}
        <div className="mt-6 pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Mevcut Durum / Arka Plan
            </label>
            <input
              type="text"
              value={currentBackground}
              onChange={(e) => setCurrentBackground(e.target.value)}
              placeholder="Örn: Bilgisayar Müh. 3. Sınıf veya Junior Geliştirici"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Hedef Rol / Ulaşılmak İstenen Seviye *
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="Örn: Full-Stack Developer, AI Engineer, Yazılım Stajı"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Kariyer Seviyesi
            </label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value as ExperienceLevel)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Stajyer / Üniversite Öğrencisi">Stajyer / Üniversite Öğrencisi</option>
              <option value="Yeni Mezun / Junior">Yeni Mezun / Junior</option>
              <option value="Mid-Level (2-4 Yıl)">Mid-Level (2-4 Yıl)</option>
              <option value="Senior / Uzman (5+ Yıl)">Senior / Uzman (5+ Yıl)</option>
              <option value="Yönetici / Team Lead">Yönetici / Team Lead</option>
            </select>
          </div>
        </div>
      </div>

      {/* Completed Trainings Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Katıldığınız Eğitimlerin İçerikleri ({trainings.length})
            </h2>
            <p className="text-xs text-slate-500">
              Yapay zeka bu eğitimlerin modüllerini inceleyerek hangi yetkinliklerde güçlü olduğunuzu ve nelerin eksik kaldığını hesaplar.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddingTraining(!isAddingTraining)}
            className="px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAddingTraining ? 'Formu Kapat' : 'Yeni Eğitim İçeriği Ekle'}</span>
          </button>
        </div>

        {/* Add Training Inline Form */}
        {isAddingTraining && (
          <form
            onSubmit={handleAddTraining}
            className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4 animate-in fade-in duration-200"
          >
            <h3 className="text-sm font-bold text-slate-900">
              Tamamlanan Eğitimin Bilgilerini Girin
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Eğitim / Kurs Başlığı *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Örn: Algoritmalar ve Veri Yapıları veya İleri Node.js Mimarisi"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Platform / Kurum
                </label>
                <input
                  type="text"
                  value={newProvider}
                  onChange={(e) => setNewProvider(e.target.value)}
                  placeholder="Örn: Üniversite, Udemy, Coursera"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                İçerik Modülleri, Konular ve Detaylar *
              </label>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Bu eğitimde hangi konular işlendi? Örn: 'Bağlı listeler, arama ağaçları, karmaşıklık analizi, heap, graf algoritmaları, dynamic programming temelleri...'"
                rows={3}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
                required
              />
              <span className="text-xs text-slate-500">
                Ne kadar detaylı modül içeriği yazarsanız, sonraki adım tavsiyesi o kadar isabetli olur.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tamamlanma Yılı
                </label>
                <input
                  type="text"
                  value={newYear}
                  onChange={(e) => setNewYear(e.target.value)}
                  placeholder="Örn: 2025"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Yaptığınız Proje / Özel Notlar (Opsiyonel)
                </label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Örn: Ders bitirme projesi olarak C++ ile CLI kütüphanesi yapıldı."
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingTraining(false)}
                className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
              >
                Eğitimi Listeye Ekle
              </button>
            </div>
          </form>
        )}

        {/* Trainings List */}
        <div className="space-y-3">
          {trainings.map((item, idx) => (
            <div
              key={item.id}
              className="bg-slate-50/70 border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3 hover:bg-slate-50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <span className="font-semibold text-slate-800">Eğitim #{idx + 1}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-600">{item.providerOrPlatform}</span>
                  {item.completedYear && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{item.completedYear}</span>
                    </>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {item.title}
                </h3>

                <p className="mt-2 text-xs text-slate-700 leading-relaxed bg-white p-2.5 rounded border border-slate-200/60">
                  <span className="font-semibold text-slate-900">İçerik Detayları: </span>
                  {item.keyModulesOrContent}
                </p>

                {item.notes && (
                  <p className="mt-1.5 text-xs text-slate-500">
                    <span className="font-medium text-slate-700">Proje / Not: </span>
                    {item.notes}
                  </p>
                )}
              </div>

              <button
                onClick={() => handleDeleteTraining(item.id)}
                className="text-slate-400 hover:text-red-600 p-1.5 rounded transition-colors self-start shrink-0"
                title="Eğitimi Kaldır"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Action Trigger */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            {trainings.length} tamamlanan eğitim içeriği analiz edilmeye hazır.
          </p>

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isLoading || trainings.length === 0}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-xs shrink-0"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Yetkinlik Açıkları & Yol Haritası Hesaplanıyor...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Yetkinlik Açığını Analiz Et & Sıradaki Eğitimi Söyle</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Results View */}
      {roadmap && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Section 1: Synthesis & Mastered Skills */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 mb-1">
                  <span>MEVCUT EĞİTİM BİRİKİMİ DEĞERLENDİRMESİ</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-500 font-normal">Kazanılan Temel Yetkinlikler</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Mevcut Güçlü Alanlarınız ve Temeliniz
                </h3>
              </div>

              <button
                onClick={handleCopyReportMarkdown}
                className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
              >
                {copiedReport ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Rapor Kopyalandı</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Tüm Raporu Markdown Kopyala</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed">
              {roadmap.profileSynthesis}
            </p>

            <div>
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2">
                Doğrulanmış Güçlü Yetkinlikler:
              </span>
              <div className="flex flex-wrap gap-2">
                {roadmap.masteredSkills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="text-xs font-medium text-emerald-900 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-md flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Skill Gaps (Yetkinlik Açıkları) */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7 space-y-4">
            <div className="border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 mb-1">
                <span>YETKİNLİK AÇIĞI (SKILL GAP) TESPİTİ</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-500 font-normal">Hedef Rol Gereksinimleri</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Hedef Pozisyona Hazır Olmak İçin Eksik Kalan Kritik Alanlar
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Aşağıdaki alanlar mülakatlarda değerlendiricilerin en sık sorduğu ve adayları elediği eksik halkalardır:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roadmap.skillGaps.map((gap, gIdx) => (
                <div
                  key={gIdx}
                  className={`p-4 rounded-xl border ${
                    gap.importance === 'Kritik'
                      ? 'bg-rose-50/40 border-rose-200'
                      : gap.importance === 'Yüksek'
                      ? 'bg-amber-50/40 border-amber-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h4 className="text-sm font-bold text-slate-900">{gap.skill}</h4>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        gap.importance === 'Kritik'
                          ? 'bg-rose-100 text-rose-800'
                          : gap.importance === 'Yüksek'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200 text-slate-800'
                      }`}
                    >
                      {gap.importance} Öncelik
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed mb-3">
                    <span className="font-semibold text-slate-900">Neden Eksiklik? </span>
                    {gap.reason}
                  </p>

                  <div className="text-xs bg-white/80 p-2.5 rounded border border-slate-200/60 text-slate-600">
                    <span className="font-semibold text-slate-800 block mb-0.5">
                      Gereken Düzey:
                    </span>
                    {gap.currentLevelVsRequired}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Next Step Course Roadmap (Bir Sonraki Adım Eğitim Müfredatı) */}
          <div className="bg-slate-900 text-white rounded-xl p-6 sm:p-8 space-y-6 border border-slate-800">
            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-1">
                <span>ADIM ADIM ÖĞRENME YOL HARİTASI</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-400">Sıradaki Alınması Gereken Eğitimler</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Bu İçeriklerden Sonra Almanız Gereken Sıradaki Eğitimler
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Yetkinlik açıklarını kapatmak ve bir üst basamağa geçmek için tam sıralı müfredat tavsiyesi:
              </p>
            </div>

            <div className="space-y-4">
              {roadmap.nextStepRoadmap.map((course) => (
                <div
                  key={course.stepNumber}
                  className="bg-slate-800/90 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {course.stepNumber}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span>{course.type}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-blue-300 tabular-nums">{course.estimatedDuration}</span>
                        </div>
                        <h4 className="text-base sm:text-lg font-bold text-white mt-0.5">
                          {course.courseTitle}
                        </h4>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-700/60 mb-3">
                    <span className="font-semibold text-blue-300 block mb-1">
                      Neden Tam Olarak Bu Eğitimi Almalısınız?
                    </span>
                    {course.whyThisNext}
                  </div>

                  {/* Modules & Syllabus */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-900/40 p-3 rounded border border-slate-800">
                      <span className="font-semibold text-slate-200 block mb-1.5">
                        Öğrenme Hedefleri:
                      </span>
                      <ul className="space-y-1 text-slate-300">
                        {course.learningObjectives.map((obj, oIdx) => (
                          <li key={oIdx} className="flex items-start gap-1.5">
                            <span className="text-blue-400 font-bold">•</span>
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-900/40 p-3 rounded border border-slate-800">
                      <span className="font-semibold text-slate-200 block mb-1.5">
                        Müfredatta Yer Alması Gereken Konular:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {course.suggestedTopics.map((top, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700"
                          >
                            {top}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Capstone Project Recommendation */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7 space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 mb-1">
                <span>MÜLAKAT PORTFOLYO PROJESİ</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-500 font-normal">Kazanılan Becerileri Kanıtlama</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                <span>Önerilen Taç Proje: {roadmap.capstoneProjectRecommendation.title}</span>
              </h3>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed">
              {roadmap.capstoneProjectRecommendation.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-900 block mb-1.5">
                  Kullanılacak Teknolojiler:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {roadmap.capstoneProjectRecommendation.keyTechnologies.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="bg-white text-slate-700 px-2.5 py-1 rounded border border-slate-200 font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50/50 p-3.5 rounded-lg border border-blue-200/70">
                <span className="font-semibold text-blue-950 block mb-1">
                  Mülakatta Bu Projeyi Nasıl Anlatmalısınız?
                </span>
                <p className="text-slate-700 leading-relaxed">
                  {roadmap.capstoneProjectRecommendation.howItProvesSkills}
                </p>
              </div>
            </div>
          </div>

          {/* Section 5: Strategic Coach Advice */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7 space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-600" />
              <span>Kariyer Koçundan Stratejik Tavsiyeler</span>
            </h3>
            <ul className="space-y-2 text-sm text-slate-700">
              {roadmap.coachStrategicAdvice.map((adv, aIdx) => (
                <li key={aIdx} className="flex items-start gap-2.5">
                  <span className="text-blue-600 font-bold mt-0.5">✓</span>
                  <span>{adv}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
