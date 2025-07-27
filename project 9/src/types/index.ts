export interface LogEntry {
  id: string;
  timestamp: string;
  source: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'CRITICAL';
  message: string;
  isSuspicious: boolean;
  threatType?: string;
  explanation?: string;
  indicators?: string[];
  remediation?: string[];
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeLimit: number;
  logs: LogEntry[];
  questions: Question[];
  category: string;
  learningGoals: string[];
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'text-input' | 'log-selection';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  points: number;
}

export interface UserAnswer {
  questionId: string;
  answer: string | string[];
  isCorrect: boolean;
  pointsEarned: number;
}

export interface ScenarioResult {
  scenarioId: string;
  totalPoints: number;
  maxPoints: number;
  percentage: number;
  answers: UserAnswer[];
  timeSpent: number;
  feedback: string;
}