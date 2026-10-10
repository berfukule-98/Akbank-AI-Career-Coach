import {
  GenerateQuestionsResponse,
  AnswerEvaluation,
  CareerRoadmapAnalysis,
  TrainingItem,
  ExperienceLevel,
} from '../types/index.ts';

export async function generateInterviewQuestions(params: {
  interviewerTitle: string;
  targetRole: string;
  experienceLevel?: ExperienceLevel | string;
  companyContext?: string;
  questionCount?: number;
}): Promise<GenerateQuestionsResponse> {
  const response = await fetch('/api/interview/generate-questions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Mülakat soruları üretilirken bir sorun oluştu.');
  }

  return response.json();
}

export async function evaluateCandidateAnswer(params: {
  question: string;
  category: string;
  interviewerTitle: string;
  targetRole: string;
  experienceLevel?: string;
  candidateAnswer: string;
}): Promise<AnswerEvaluation> {
  const response = await fetch('/api/interview/evaluate-answer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Cevap değerlendirilirken bir sorun oluştu.');
  }

  return response.json();
}

export async function analyzeTrainingsForRoadmap(params: {
  trainings: TrainingItem[];
  currentRoleOrBackground?: string;
  targetRole: string;
  experienceLevel?: ExperienceLevel | string;
}): Promise<CareerRoadmapAnalysis> {
  const response = await fetch('/api/career/analyze-training', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Eğitim analizi ve yol haritası hazırlanırken bir sorun oluştu.');
  }

  return response.json();
}
