import React, { useState } from 'react';
import {
  Sparkles,
  UserCheck,
  Search,
  MessageSquare,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  CheckCircle,
  Target,
  SlidersHorizontal,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import {
  InterviewQuestion,
  GenerateQuestionsResponse,
  ExperienceLevel,
  AnswerEvaluation,
} from '../types/index.ts';
import { generateInterviewQuestions } from '../services/api.ts';
import { PracticeModal } from './PracticeModal.tsx';

interface InterviewViewProps {
  initialTargetRole?: string;
  initialInterviewerTitle?: string;
  initialExperienceLevel?: ExperienceLevel;
  initialCompanyContext?: string;
}

const COMMON_TITLES = [
  'VP of Engineering',
  'Engineering Manager',
  'Lead Data Scientist',
  'Yetenek Kazanımı & Staj Programı Lideri',
  'Senior Software Architect',
  'Head of Product (CPO)',
  'HR Business Partner',
];

export const InterviewView: React.FC<InterviewViewProps> = ({
  initialTargetRole = 'Yazılım Mühendisi',
  initialInterviewerTitle = 'Engineering Manager',
  initialExperienceLevel = 'Yeni Mezun / Junior',
  initialCompanyContext = 'Büyüyen Teknoloji Şirketi',
}) => {
  const [interviewerTitle, setInterviewerTitle] = useState(initialInterviewerTitle);
  const [targetRole, setTargetRole] = useState(initialTargetRole);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(
    initialExperienceLevel
  );
  const [companyContext, setCompanyContext] = useState(initialCompanyContext);
  const [questionCount, setQuestionCount] = useState<number>(5);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateQuestionsResponse | null>(null);

  // Active question for practice modal
  const [activePracticeQuestion, setActivePracticeQuestion] =
    useState<InterviewQuestion | null>(null);
  const [evaluations, setEvaluations] = useState<Record<string, AnswerEvaluation>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('Hepsi');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewerTitle.trim() || !targetRole.trim()) {
      setError('Lütfen değerlendirici unvanını ve hedef pozisyonu doldurun.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await generateInterviewQuestions({
        interviewerTitle: interviewerTitle.trim(),
        targetRole: targetRole.trim(),
        experienceLevel,
        companyContext: companyContext.trim(),
        questionCount,
      });

      setResult(data);
      setSelectedCategory('Hepsi');
    } catch (err: any) {
      setError(err?.message || 'Mülakat soruları üretilemedi. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEvaluation = (questionId: string, evaluation: AnswerEvaluation) => {
    setEvaluations((prev) => ({
      ...prev,
      [questionId]: evaluation,
    }));
  };

  // Categories
  const categories = result?.questions
    ? ['Hepsi', ...Array.from(new Set(result.questions.map((q) => q.category)))]
    : [];

  const filteredQuestions = result?.questions.filter((q) => {
    if (selectedCategory === 'Hepsi') return true;
    return q.category === selectedCategory;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Hero / Introduction */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 mb-2">
            <span>MÜLAKAT KATILIMCISI ODAKLI HAZIRLIK</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-500 font-normal">Yapay Zeka Destekli Rol Analizi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Mülakat Yapacak Kişinin Unvanına Göre Özel Soru ve Simülasyon
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
            Farklı unvandaki yöneticiler (VP, Mühendislik Müdürü, Staj & Yetenek İşe Alım Uzmanı) aynı pozisyon için tamamen farklı sinyaller arar. Değerlendiricinin unvanını girin; o unvanın zihniyetine özel potansiyel soruları üretelim ve yanıtlarınızı puanlayarak simüle edelim.
          </p>
        </div>

        {/* Input Configuration Form */}
        <form onSubmit={handleSubmit} className="mt-6 pt-6 border-t border-slate-200 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Interviewer Title */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Mülakatı Yapacak Kişinin Unvanı (Title) *
              </label>
              <input
                type="text"
                value={interviewerTitle}
                onChange={(e) => setInterviewerTitle(e.target.value)}
                placeholder="Örn: VP of Engineering, Lead Data Scientist, Staj Lideri"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {/* Quick suggestion tags */}
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-slate-400">Hızlı seç:</span>
                {COMMON_TITLES.map((title) => (
                  <button
                    key={title}
                    type="button"
                    onClick={() => setInterviewerTitle(title)}
                    className="text-xs text-slate-600 hover:text-blue-700 hover:underline px-1.5 py-0.5 rounded transition-colors"
                  >
                    {title}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Role */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Adayın Hedef Pozisyonu *
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="Örn: Senior Frontend Developer, Yazılım Stajyeri, Data Analyst"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <span className="text-xs text-slate-500 block mt-1.5">
                Girmek istediğiniz pozisyonun tam adı.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Experience Level */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Deneyim Seviyesi
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

            {/* Company Context */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Şirket / Sektör Türü
              </label>
              <input
                type="text"
                value={companyContext}
                onChange={(e) => setCompanyContext(e.target.value)}
                placeholder="Örn: Global FinTech, E-ticaret, Erken Aşama Startup"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Question Count */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Soru Sayısı
              </label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={3}>3 Odaklı Soru (Hızlı Pratik)</option>
                <option value={5}>5 Kapsamlı Soru (Standart)</option>
                <option value={7}>7 Derinlikli Soru (Tam Mülakat)</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2 shadow-xs"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Unvan Analiz Ediliyor ve Sorular Üretiliyor...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{interviewerTitle} İçin Potansiyel Soruları Üret</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Results Section */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Interviewer Persona & Focus Analysis Card */}
          <div className="bg-slate-900 text-white rounded-xl p-6 sm:p-7 border border-slate-800 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold mb-1">
                  <span>DEĞERLENDİRİCİ ZİHNİYET ANALİZİ</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-400">{interviewerTitle}</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Bu Unvanın Mülakattaki Temel Motivasyonu ve Bakış Açısı
                </h3>
              </div>
              <div className="text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 shrink-0">
                <span>Hedef Rol: {targetRole}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  En Çok Neye Odaklanır?
                </span>
                <p className="text-slate-200 leading-relaxed">
                  {result.interviewerAnalysis.coreFocus}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Değerlendirme Tarzı & Sinyaller:
                </span>
                <p className="text-slate-200 leading-relaxed">
                  {result.interviewerAnalysis.evaluationStyle}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Bırakılması Gereken İzlenim:
                </span>
                <p className="text-slate-200 leading-relaxed">
                  {result.interviewerAnalysis.whatImpressionToLeave}
                </p>
              </div>
            </div>
          </div>

          {/* Questions Header & Filter Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Potansiyel Mülakat Soruları ({filteredQuestions?.length || 0})
              </h2>
              <p className="text-xs text-slate-500">
                Soruları inceleyebilir, 'Pratik Yap' butonu ile anlık simülasyon ve yapay zeka puanlaması alabilirsiniz.
              </p>
            </div>

            {/* Category Segmented Tabs */}
            {categories.length > 1 && (
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      selectedCategory === cat
                        ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Question Cards Grid */}
          <div className="space-y-4">
            {filteredQuestions?.map((q, index) => {
              const savedEval = evaluations[q.id];

              return (
                <div
                  key={q.id || index}
                  className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                        <span className="font-semibold text-slate-700">Soru {index + 1}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-blue-700 font-medium">{q.category}</span>
                        {savedEval && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-emerald-700 font-semibold tabular-nums">
                              Simülasyon Puanı: {savedEval.score}/100
                            </span>
                          </>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                        {q.question}
                      </h3>

                      {/* Perspective and Tip */}
                      <div className="mt-3.5 space-y-2 text-xs text-slate-700 border-t border-slate-100 pt-3">
                        <div className="flex items-start gap-2">
                          <span className="font-semibold text-slate-900 shrink-0">
                            Unvan Bakışı:
                          </span>
                          <span className="text-slate-600">{q.interviewerPerspective}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-semibold text-blue-900 shrink-0">
                            Altın İpucu:
                          </span>
                          <span className="text-slate-600">{q.keyTip}</span>
                        </div>

                        {q.sampleBestPracticePoints && q.sampleBestPracticePoints.length > 0 && (
                          <div className="flex items-start gap-2 pt-1">
                            <span className="font-semibold text-slate-900 shrink-0">
                              Cevapta Olması Gerekenler:
                            </span>
                            <div className="flex flex-wrap items-center gap-1.5">
                              {q.sampleBestPracticePoints.map((pt, pIdx) => (
                                <span
                                  key={pIdx}
                                  className="text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/60"
                                >
                                  {pt}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="sm:self-center shrink-0">
                      <button
                        onClick={() => setActivePracticeQuestion(q)}
                        className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-xs ${
                          savedEval
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                            : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{savedEval ? 'Yanıtı İncele / Tekrarla' : 'Pratik Yap & Puan Al'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Practice Modal */}
      {activePracticeQuestion && (
        <PracticeModal
          question={activePracticeQuestion}
          interviewerTitle={interviewerTitle}
          targetRole={targetRole}
          experienceLevel={experienceLevel}
          savedEvaluation={evaluations[activePracticeQuestion.id]}
          onSaveEvaluation={handleSaveEvaluation}
          onClose={() => setActivePracticeQuestion(null)}
        />
      )}
    </div>
  );
};
