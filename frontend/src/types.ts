export interface DashboardStats {
  streak: number;
  dsa: { total: number; completed: number };
  project: { total: number; completed: number };
  applications: { count: number };
  patterns: { pattern: string; total: number; completed: number }[];
  github: { username: string } | null;
  readinessScore: number;
  weaknesses: string[];
}

export interface InterviewRound {
  id: number;
  application_id: number;
  round_name: string;
  type: 'DSA' | 'Backend' | 'System Design' | 'Behavioral';
  questions_asked: string;
  user_answer: string;
  improvement_notes: string;
  timestamp: string;
}

export interface LeetCodeProfile {
  username: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  topPatterns: string[];
}

export interface Interview {
  id: number;
  company: string;
  duration: number;
  round: string;
  coding_score: number;
  backend_score: number;
  behavioral_score: number;
  feedback: string;
  timestamp: string;
}

export interface SystemDesignSession {
  id: number;
  topic: string;
  components: string;
  explanation: string;
  ai_feedback: string;
  timestamp: string;
}

export interface DSAProblem {
  id: number;
  title: string;
  pattern: string;
  difficulty: string;
  completed: boolean;
  time_taken?: number;
  confidence?: number;
  reflection?: string;
}

export interface ProjectTask {
  id: number;
  title: string;
  category: string;
  completed: boolean;
}

export interface Application {
  id: number;
  company: string;
  role: string;
  status: string;
  applied_date: string;
}

export interface RoadmapPhase {
  id: number;
  title: string;
  status: string;
}
