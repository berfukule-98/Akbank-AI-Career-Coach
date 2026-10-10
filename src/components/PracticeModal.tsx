import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Mic,
  MicOff,
  Send,
  Sparkles,
  Award,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Copy,
  Check,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { InterviewQuestion, AnswerEvaluation } from '../types/index.ts';
import { evaluateCandidateAnswer } from '../services/api.ts';

interface PracticeModalProps {
  question: InterviewQuestion | null;
  interviewerTitle: string;
  targetRole: string;
  experienceLevel: string;
  onClose: () => void;
  savedEvaluation?: AnswerEvaluation | null;
  onSaveEvaluation?: (questionId: string, evaluation: AnswerEvaluation) => void;
}

export const PracticeModal: React.FC<PracticeModalProps> = ({
  question,
  interviewerTitle,
  targetRole,
  experienceLevel,
  onClose,
  savedEvaluation,
  onSaveEvaluation,
}) => {
  const [answer, setAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<AnswerEvaluation | null>(
    savedEvaluation || null
  );
  const [error, setError] = useState<string | null>(null);
  const [copiedIdeal, setCopiedIdeal] = useState(false);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (savedEvaluation) {
      setEvaluation(savedEvaluation);
    }
  }, [savedEvaluation]);

  // Speech Recognition setup (Web Speech API)
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'tr-TR';

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setAnswer((prev) => {
          // If newly recognized, append cleanly
          const separator = prev.length > 0 && !prev.endsWith(' ') ? ' ' : '';
          return prev + separator + currentTranscript.trim();
        });
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  if (!question) return null;

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      setError('Tarayıcınız sesli dikte özelliğini desteklemiyor. Lütfen yanıtınızı yazarak iletin.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setError(null);
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Failed to start speech recognition', err);
        setIsRecording(false);
      }
    }
  };

  const handleEvaluate = async () => {
    if (!answer.trim()) {
      setError('Lütfen önce soruya cevabınızı yazın veya sesli olarak kaydedin.');
      return;
    }

    setIsEvaluating(true);
    setError(null);

    try {
      const result = await evaluateCandidateAnswer({
        question: question.question,
        category: question.category,
        interviewerTitle,
        targetRole,
        experienceLevel,
        candidateAnswer: answer.trim(),
      });

      setEvaluation(result);
      if (onSaveEvaluation) {
        onSaveEvaluation(question.id, result);
      }
    } catch (err: any) {
      setError(err?.message || 'Cevap değerlendirilirken bir hata oluştu.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleCopyIdeal = () => {
    if (evaluation?.idealAnswer) {
      navigator.clipboard.writeText(evaluation.idealAnswer);
      setCopiedIdeal(true);
      setTimeout(() => setCopiedIdeal(false), 2000);
    }
  };

  const wordCount = answer.trim() ? answer.trim().split(/\s+/).length : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>{question.category}</span>
              <span aria-hidden="true">·</span>
              <span>Değerlendirici: {interviewerTitle}</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate">
              Mülakat Simülasyonu & Yapay Zeka Değerlendirmesi
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Question Display Card */}
          <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-4 sm:p-5">
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider block mb-1">
              Soru:
            </span>
            <p className="text-base sm:text-lg font-semibold text-slate-900 leading-snug">
              {question.question}
            </p>

            <div className="mt-4 pt-3 border-t border-blue-200/60 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
              <div>
                <span className="font-semibold text-blue-900 block mb-0.5">
                  Bu Unvan Neden Sorar?
                </span>
                <p className="text-slate-600">{question.interviewerPerspective}</p>
              </div>
              <div>
                <span className="font-semibold text-blue-900 block mb-0.5">
                  Hazırlık İpucu:
                </span>
                <p className="text-slate-600">{question.keyTip}</p>
              </div>
            </div>
          </div>

          {/* Answer Input Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-slate-800">
                Sizin Yanıtınız (Mülakattaki gibi ifade edin):
              </label>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="tabular-nums">{wordCount} kelime</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{answer.length} karakter</span>
              </div>
            </div>

            <div className="relative">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Örnek: 'Önceki projemde benzer bir zorlukla karşılaştım. Durumu analiz etmek için... Yaptığım eylemler... Ve nihayetinde elde ettiğimiz somut çıktı...'"
                rows={6}
                className="w-full px-3.5 py-3 text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-400"
              />

              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 shadow-2xs ${
                    isRecording
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                  title={isRecording ? 'Kaydı Durdur' : 'Mikrofon ile Dikte Et'}
                >
                  {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  <span>{isRecording ? 'Dinleniyor...' : 'Sesle Dikte'}</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-2 text-xs text-red-600 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-slate-500">
                STAR tekniği (Situation, Task, Action, Result) ile yanıtlamak puanınızı artırır.
              </p>
              <button
                type="button"
                onClick={handleEvaluate}
                disabled={isEvaluating || !answer.trim()}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-xs shrink-0"
              >
                {isEvaluating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Yapay Zeka Puanlıyor...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Yanıtı Değerlendir & Puanla</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Evaluation Results */}
          {evaluation && (
            <div className="border-t border-slate-200 pt-6 space-y-5 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg tabular-nums ${
                      evaluation.score >= 80
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : evaluation.score >= 65
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}
                  >
                    {evaluation.score}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>Mülakat Uyumluluk Skoru</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-medium text-slate-700">100 Üzerinden</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 mt-0.5">
                      {evaluation.score >= 80
                        ? 'Güçlü ve İkna Edici Yanıt'
                        : evaluation.score >= 65
                        ? 'Geliştirilebilir Başarılı Temel'
                        : 'Daha Fazla Somut Detay Gerekli'}
                    </p>
                  </div>
                </div>

                <div className="text-xs text-slate-600 sm:text-right max-w-md">
                  {evaluation.summaryEvaluation}
                </div>
              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-50/50 border border-emerald-200/70 rounded-lg p-4">
                  <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Güçlü Yanlar</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {evaluation.strengths.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-amber-50/50 border border-amber-200/70 rounded-lg p-4">
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Geliştirilecek Noktalar</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {evaluation.improvements.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* STAR Assessment */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  STAR Metodolojisi Analizi:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-3">
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <span className="font-semibold text-slate-700 block mb-0.5">
                      Durum & Görev (S/T)
                    </span>
                    <p className="text-slate-600">{evaluation.starAssessment.situationTaskScore}</p>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <span className="font-semibold text-slate-700 block mb-0.5">
                      Adayın Eylemleri (A)
                    </span>
                    <p className="text-slate-600">{evaluation.starAssessment.actionScore}</p>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <span className="font-semibold text-slate-700 block mb-0.5">
                      Ölçülebilir Sonuç (R)
                    </span>
                    <p className="text-slate-600">{evaluation.starAssessment.resultScore}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 italic">
                  Koç Notu: {evaluation.starAssessment.starFeedback}
                </p>
              </div>

              {/* Ideal Answer Benchmark */}
              <div className="bg-blue-50/40 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-blue-600" />
                    <span>Örnek 100 Puanlık İdeal Cevap Metni:</span>
                  </h4>
                  <button
                    onClick={handleCopyIdeal}
                    className="text-xs text-blue-700 hover:text-blue-900 font-medium flex items-center gap-1"
                  >
                    {copiedIdeal ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Kopyalandı</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Cevabı Kopyala</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line bg-white/70 p-3 rounded border border-blue-100">
                  {evaluation.idealAnswer}
                </p>
              </div>

              {/* Actionable Tips */}
              {evaluation.actionableTips && evaluation.actionableTips.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Sonraki Deneme İçin Pratik Tavsiyeler:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {evaluation.actionableTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">✓</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={() => {
              setAnswer('');
              setEvaluation(null);
            }}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Yanıtı Temizle</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
