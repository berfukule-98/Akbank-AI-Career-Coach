import React from 'react';
import { X, Sparkles, ArrowRight, GraduationCap, Briefcase, Database } from 'lucide-react';
import { PRESET_SCENARIOS } from '../data/mockData.ts';
import { PresetScenario } from '../types/index.ts';

interface PresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScenario: (scenario: PresetScenario) => void;
}

export const PresetModal: React.FC<PresetModalProps> = ({
  isOpen,
  onClose,
  onSelectScenario,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-2xl w-full p-6 animate-in fade-in duration-200">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Hazır Kariyer & Mülakat Senaryoları
              </h3>
              <p className="text-xs text-slate-500">
                Tek tıkla gerçekçi verileri yükleyip simülasyonu deneyin.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3.5">
          {PRESET_SCENARIOS.map((preset) => (
            <div
              key={preset.id}
              onClick={() => {
                onSelectScenario(preset);
                onClose();
              }}
              className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
                    {preset.badge}
                  </span>
                  <span className="text-xs text-slate-500">·</span>
                  <span className="text-xs text-slate-600 font-medium">{preset.experienceLevel}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-900">
                  {preset.name}
                </h4>
                <div className="text-xs text-slate-600">
                  <span>Mülakatçı: <strong>{preset.interviewerTitle}</strong></span>
                  <span className="mx-1.5">|</span>
                  <span>Rol: <strong>{preset.targetRole}</strong></span>
                </div>
                <p className="text-xs text-slate-500 pt-0.5">
                  İçerir: {preset.sampleTrainings.length} adet tamamlanmış eğitim ve detaylı modülleri.
                </p>
              </div>

              <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform self-end sm:self-center shrink-0">
                <span>Profili Yükle</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
