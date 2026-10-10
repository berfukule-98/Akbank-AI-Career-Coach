export type ExperienceLevel = 
  | 'Stajyer / Üniversite Öğrencisi'
  | 'Yeni Mezun / Junior'
  | 'Mid-Level (2-4 Yıl)'
  | 'Senior / Uzman (5+ Yıl)'
  | 'Yönetici / Team Lead';

export interface InterviewQuestion {
  id: string;
  question: string;
  category: 'Teknik Yetkinlik' | 'Davranışsal (STAR)' | 'Stratejik & Liderlik' | 'Problem Çözme & Durumsal';
  interviewerPerspective: string;
  keyTip: string;
  sampleBestPracticePoints: string[];
}

export interface InterviewerAnalysis {
  coreFocus: string;
  evaluationStyle: string;
  whatImpressionToLeave: string;
}

export interface GenerateQuestionsResponse {
  interviewerAnalysis: InterviewerAnalysis;
  questions: InterviewQuestion[];
}

export interface StarAssessment {
  situationTaskScore: string;
  actionScore: string;
  resultScore: string;
  starFeedback: string;
}

export interface AnswerEvaluation {
  score: number;
  summaryEvaluation: string;
  strengths: string[];
  improvements: string[];
  starAssessment: StarAssessment;
  idealAnswer: string;
  actionableTips: string[];
}

export interface TrainingItem {
  id: string;
  title: string;
  providerOrPlatform: string;
  keyModulesOrContent: string;
  completedYear?: string;
  notes?: string;
}

export interface SkillGapItem {
  skill: string;
  importance: 'Kritik' | 'Yüksek' | 'Orta';
  reason: string;
  currentLevelVsRequired: string;
}

export interface NextStepCourse {
  stepNumber: number;
  courseTitle: string;
  type: 'Online Kurs' | 'Proje Tabanlı Pratik' | 'Derinlemesine Kitap / Makale' | 'Sertifikasyon Hazırlığı';
  learningObjectives: string[];
  suggestedTopics: string[];
  estimatedDuration: string;
  whyThisNext: string;
}

export interface CapstoneProject {
  title: string;
  description: string;
  keyTechnologies: string[];
  howItProvesSkills: string;
}

export interface CareerRoadmapAnalysis {
  profileSynthesis: string;
  masteredSkills: string[];
  skillGaps: SkillGapItem[];
  nextStepRoadmap: NextStepCourse[];
  capstoneProjectRecommendation: CapstoneProject;
  coachStrategicAdvice: string[];
}

export interface PresetScenario {
  id: string;
  name: string;
  badge: string;
  targetRole: string;
  interviewerTitle: string;
  experienceLevel: ExperienceLevel;
  companyContext: string;
  sampleTrainings: TrainingItem[];
}
