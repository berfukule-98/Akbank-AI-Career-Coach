/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { InterviewView } from './components/InterviewView.tsx';
import { CareerCoachView } from './components/CareerCoachView.tsx';
import { PresetModal } from './components/PresetModal.tsx';
import { PresetScenario, TrainingItem, ExperienceLevel } from './types/index.ts';
import { PRESET_SCENARIOS } from './data/mockData.ts';

export default function App() {
  const [activeTab, setActiveTab] = useState<'interview' | 'career'>('interview');
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);

  // Synced state across views
  const [targetRole, setTargetRole] = useState<string>('Yazılım Mühendisi');
  const [interviewerTitle, setInterviewerTitle] = useState<string>('Engineering Manager');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('Yeni Mezun / Junior');
  const [companyContext, setCompanyContext] = useState<string>('Büyüyen Teknoloji Şirketi');
  const [currentBackground, setCurrentBackground] = useState<string>('Yazılım Geliştirici');
  const [trainings, setTrainings] = useState<TrainingItem[]>([]);

  // Key to force reload components on preset selection
  const [reloadKey, setReloadKey] = useState<number>(0);

  // Initialize with student or junior scenario
  useEffect(() => {
    const saved = localStorage.getItem('kariyer_pusula_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.targetRole) setTargetRole(parsed.targetRole);
        if (parsed.interviewerTitle) setInterviewerTitle(parsed.interviewerTitle);
        if (parsed.experienceLevel) setExperienceLevel(parsed.experienceLevel);
        if (parsed.companyContext) setCompanyContext(parsed.companyContext);
        if (parsed.currentBackground) setCurrentBackground(parsed.currentBackground);
        if (parsed.trainings && Array.isArray(parsed.trainings)) setTrainings(parsed.trainings);
        return;
      } catch {
        // fallback
      }
    }

    // Default to the first preset (internship/student)
    const initial = PRESET_SCENARIOS[0];
    setTargetRole(initial.targetRole);
    setInterviewerTitle(initial.interviewerTitle);
    setExperienceLevel(initial.experienceLevel);
    setCompanyContext(initial.companyContext);
    setCurrentBackground('Bilgisayar Mühendisliği 3. Sınıf Öğrencisi');
    setTrainings(initial.sampleTrainings);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(
      'kariyer_pusula_state',
      JSON.stringify({
        targetRole,
        interviewerTitle,
        experienceLevel,
        companyContext,
        currentBackground,
        trainings,
      })
    );
  }, [targetRole, interviewerTitle, experienceLevel, companyContext, currentBackground, trainings]);

  const handleSelectScenario = (scenario: PresetScenario) => {
    setTargetRole(scenario.targetRole);
    setInterviewerTitle(scenario.interviewerTitle);
    setExperienceLevel(scenario.experienceLevel);
    setCompanyContext(scenario.companyContext);
    setCurrentBackground(scenario.name);
    setTrainings(scenario.sampleTrainings);
    setReloadKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Top Bar */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenPresets={() => setIsPresetModalOpen(true)}
        savedQuestionsCount={0}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 pb-16">
        {activeTab === 'interview' ? (
          <InterviewView
            key={`interview-${reloadKey}`}
            initialTargetRole={targetRole}
            initialInterviewerTitle={interviewerTitle}
            initialExperienceLevel={experienceLevel}
            initialCompanyContext={companyContext}
          />
        ) : (
          <CareerCoachView
            key={`career-${reloadKey}`}
            initialTrainings={trainings}
            initialTargetRole={targetRole}
            initialBackground={currentBackground}
          />
        )}
      </main>

      {/* Clean Editorial Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span className="font-semibold text-slate-700">KariyerPusula</span>
            <span className="mx-2">·</span>
            <span>Mülakat Simülatörü ve Yapay Zeka Kariyer Koçluğu Platformu</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Öğrenci & Stajyer Desteği</span>
            <span aria-hidden="true">·</span>
            <span>STAR Metodolojisi</span>
            <span aria-hidden="true">·</span>
            <span>Yetkinlik Açığı Analizi</span>
          </div>
        </div>
      </footer>

      {/* Preset Modal */}
      <PresetModal
        isOpen={isPresetModalOpen}
        onClose={() => setIsPresetModalOpen(false)}
        onSelectScenario={handleSelectScenario}
      />
    </div>
  );
}
