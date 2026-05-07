/**
 * DevForge OS - API Service Layer (Final Alignment)
 * All network communication is centralized here.
 *   - FastAPI Backend: /api/* (Auth, CRUD, Execution)
 *   - Flask Microservice: /microservice/api/* (AI Proxy, LeetCode)
 */

import { 
  DashboardStats, 
  DSAProblem, 
  Application, 
  InterviewRound, 
  ProjectTask, 
  SystemDesignSession,
  Interview,
  RoadmapPhase
} from '../types';

const API_BASE = (import.meta as any).env.VITE_API_URL || "http://localhost:8000";
const MS_BASE = (import.meta as any).env.VITE_MICROSERVICE_URL || "http://localhost:5001";

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem("token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers || {}),
  };

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "API error");
  }
  return res.json();
}

// ─── Authentication ───────────────────────────────────────────────
export const login = async (data: Record<string, string>) => {
  const formData = new URLSearchParams();
  formData.append("username", data.username);
  formData.append("password", data.password);

  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString()
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "API error");
  }
  return res.json();
};

export const register = (data: object) =>
  apiFetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getMe = () =>
  apiFetch<{ id: number; name: string; email: string }>(`${API_BASE}/api/auth/me`);

export const getGithubAuthUrl = () =>
  apiFetch<{ url: string }>(`${API_BASE}/api/auth/github/url`);

// ─── Dashboard & Stats ───────────────────────────────────────────
export const getDashboard = () =>
  apiFetch<DashboardStats>(`${API_BASE}/api/dashboard`);

export const getTodayPlan = () =>
  apiFetch<{ day: number; topic: string; description: string; problems: string[]; completed: boolean }>(`${API_BASE}/api/dashboard/today`);

export const importLeetcode = (username: string) =>
  apiFetch(`${API_BASE}/api/leetcode/import`, {
    method: "POST",
    body: JSON.stringify({ username }),
  });

// ─── DSA Problems ────────────────────────────────────────────────
export const getDSAProblems = () =>
  apiFetch<DSAProblem[]>(`${API_BASE}/api/dsa`);

export const createDSAProblem = (data: object) =>
  apiFetch<DSAProblem>(`${API_BASE}/api/dsa`, { method: "POST", body: JSON.stringify(data) });

export const updateDSAProblem = (id: number, data: object) =>
  apiFetch<DSAProblem>(`${API_BASE}/api/dsa/${id}`, { method: "PATCH", body: JSON.stringify(data) });

export const completeDSAProblem = (id: number, data: object) =>
  apiFetch(`${API_BASE}/api/dsa/${id}/complete`, {
    method: "POST",
    body: JSON.stringify(data),
  });

// ─── Code Execution ──────────────────────────────────────────────
export const executeCode = (code: string, language: string = "python", problemTitle?: string) =>
  apiFetch<{ stdout?: string; stderr?: string; test_results?: any }>(`${API_BASE}/api/execute`, {
    method: "POST",
    body: JSON.stringify({ code, language, problem_title: problemTitle }),
  });

// ─── Applications & Interviews ───────────────────────────────────
export const getApplications = () =>
  apiFetch<Application[]>(`${API_BASE}/api/applications`);

export const createApplication = (data: object) =>
  apiFetch<Application>(`${API_BASE}/api/applications`, { method: "POST", body: JSON.stringify(data) });

export const updateApplication = (id: number, data: object) =>
  apiFetch<Application>(`${API_BASE}/api/applications/${id}`, { method: "PATCH", body: JSON.stringify(data) });

export const getApplicationRounds = (appId: number) =>
  apiFetch<InterviewRound[]>(`${API_BASE}/api/applications/${appId}/rounds`);

export const createApplicationRound = (appId: number, data: object) =>
  apiFetch<InterviewRound>(`${API_BASE}/api/applications/${appId}/rounds`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const createInterviewSession = (data: object) =>
  apiFetch<Interview>(`${API_BASE}/api/interviews`, {
    method: "POST",
    body: JSON.stringify(data),
  });

// ─── System Design & Projects ────────────────────────────────────
export const getSystemDesignSessions = () =>
  apiFetch<SystemDesignSession[]>(`${API_BASE}/api/system-design`);

export const saveSystemDesignSession = (data: object) =>
  apiFetch<SystemDesignSession>(`${API_BASE}/api/system-design`, { method: "POST", body: JSON.stringify(data) });

export const getProjectTasks = () =>
  apiFetch<ProjectTask[]>(`${API_BASE}/api/projects`);

export const getRoadmap = () =>
  apiFetch<RoadmapPhase[]>(`${API_BASE}/api/roadmap`);

export const toggleProjectTask = (id: number) =>
  apiFetch<ProjectTask>(`${API_BASE}/api/projects/${id}/toggle`, { method: "POST" });

// ─── AI Proxy (Through FastAPI Backend) ─────────────────────────
export const getAIFeedback = (prompt: string, cacheKey?: string) =>
  apiFetch<{ response: string }>(`${API_BASE}/api/ai/feedback`, {
    method: "POST",
    body: JSON.stringify({ prompt, cache_key: cacheKey }),
  });

export const getLeetCodeStats = (username: string) =>
  apiFetch(`${API_BASE}/api/ai/leetcode/${username}`);

// ─── Specific AI Helpers (Migrated from geminiService) ───────────
export const aiExplainPattern = (pattern: string) =>
  getAIFeedback(`Explain the ${pattern} pattern for backend interviews. Include complexity and examples.`);

export const aiGetHint = (problem: string, code: string) =>
  getAIFeedback(`Provide a subtle hint for the DSA problem: ${problem}. Current code: ${code}`);

export const aiEvaluateExplanation = (problem: string, explanation: string) =>
  getAIFeedback(`Evaluate this explanation for ${problem}: ${explanation}. Return feedback in JSON format with clarity and structure scores.`);

export const aiGetConceptSummary = (concept: string) =>
  getAIFeedback(`Generate a 5-minute technical summary for: ${concept}. Include core definition and example snippet.`);

export const aiEvaluateInterview = (round: string, data: object) =>
  getAIFeedback(`Evaluate this ${round} interview session. Data: ${JSON.stringify(data)}. Return a JSON with "scores" (coding, backend, behavioral) and "feedback" (detailed string).`);

export const aiEvaluateSystemDesign = (topic: string, components: any[], explanation: string) =>
  getAIFeedback(`Review this system design for ${topic}. Components: ${JSON.stringify(components)}. Explanation: ${explanation}. Return a JSON with "score", "feedback", and "improvements" (array).`);

export const aiEvaluateBehavioral = (question: string, answer: string) =>
  getAIFeedback(`Evaluate this behavioral interview answer using the STAR method. Question: ${question}. Answer: ${answer}. Return a JSON with "score", "feedback", "strengths" (array), and "improvements" (array).`);

export const aiWorkflowPrep = (goal: string) =>
  apiFetch<{ architecture: string; model: string }>(`${API_BASE}/api/ai/workflow-prep`, {
    method: "POST",
    body: JSON.stringify({ goal }),
  });

// ─── V4 AI Assistant / Focus / Feature Gates ───────────────────
export const askAssistant = (data: {
  message: string;
  context?: string;
  selected_text?: string;
  mode?: 'quick' | 'balanced' | 'deep';
  model?: string;
}) => apiFetch<{ response: string; model: string; mode: string; fallback: boolean; remaining_today?: number }>(`${API_BASE}/api/assistant/chat`, {
  method: 'POST',
  body: JSON.stringify(data),
});

export const getAssistantModels = () =>
  apiFetch(`${API_BASE}/api/assistant/models`);

export const getAssistantHistory = () =>
  apiFetch<any[]>(`${API_BASE}/api/assistant/history`);

export const logFocusSession = (data: {
  context: string;
  task_title?: string;
  target_minutes: number;
  elapsed_seconds: number;
  completed: boolean;
  difficulty?: string;
}) => apiFetch(`${API_BASE}/api/focus/sessions`, {
  method: 'POST',
  body: JSON.stringify(data),
});

export const getFocusSummary = () =>
  apiFetch(`${API_BASE}/api/focus/summary`);

export const getEntitlements = () =>
  apiFetch(`${API_BASE}/api/entitlements`);

export const executeCodeWithTests = (code: string, tests: any[], functionName = 'solve', problemTitle?: string) =>
  apiFetch<{ stdout?: string; stderr?: string; exit_code?: number; test_results?: any[]; safety_note?: string }>(`${API_BASE}/api/execute`, {
    method: 'POST',
    body: JSON.stringify({ code, language: 'python', tests, function_name: functionName, problem_title: problemTitle }),
  });

// ─── V5 Market-Ready Hooks ─────────────────────────────────────
export const analyzeResumeGap = (data: {
  resume_text: string;
  job_description: string;
  target_role?: string;
}) => apiFetch<{
  match_score: number;
  readiness_label: string;
  matched_keywords: string[];
  missing_keywords: string[];
  top_blockers: string[];
  seven_day_plan: { day: string; task: string; output: string }[];
  improved_headline: string;
  rewrite_bullets: string[];
  paid_hook: string;
}>(`${API_BASE}/api/v5/resume-gap`, {
  method: 'POST',
  body: JSON.stringify(data),
});

export const analyzeGithubProfile = (data: {
  github_username?: string;
  repo_names?: string[];
  project_description?: string;
}) => apiFetch<{
  score: number;
  label: string;
  missing: string[];
  quick_fixes: string[];
  portfolio_bullets: string[];
  readme_sections: string[];
}>(`${API_BASE}/api/v5/github-analyzer`, {
  method: 'POST',
  body: JSON.stringify(data),
});

export const getCompanyPacks = () =>
  apiFetch<{ packs: any[] }>(`${API_BASE}/api/v5/company-packs`);

export const getGymRoomPlan = () =>
  apiFetch<{
    title: string;
    subtitle: string;
    today_blocks: { zone: string; task: string; minutes: number; cta: string }[];
    weekly_targets: { metric: string; target: number }[];
    upgrade_hooks: string[];
  }>(`${API_BASE}/api/v5/gym-room-plan`);

// ─── V6 Production Features ───────────────────────────────────
export const getExecutionBackendStatus = () =>
  apiFetch(`${API_BASE}/api/execute/backend-status`);

export const getV6GithubAuthUrl = () =>
  apiFetch(`${API_BASE}/api/v6/github/auth-url`);

export const importGithubRepoV6 = (repo_url: string) =>
  apiFetch(`${API_BASE}/api/v6/github/import`, {
    method: 'POST',
    body: JSON.stringify({ repo_url }),
  });

export const uploadResumePdf = async (file: File, target_role: string, job_description = '') => {
  const token = localStorage.getItem('token');
  const fd = new FormData();
  fd.append('file', file);
  fd.append('target_role', target_role);
  fd.append('job_description', job_description);
  const res = await fetch(`${API_BASE}/api/v6/resume/upload`, {
    method: 'POST',
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: fd,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Resume upload failed');
  }
  return res.json();
};

export const reviewVoiceMock = (data: { question: string; transcript: string; target_role?: string; duration_seconds?: number }) =>
  apiFetch(`${API_BASE}/api/v6/voice/mock-review`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const getAdminSummary = () =>
  apiFetch(`${API_BASE}/api/v6/admin/summary`);


// ─── V7 Razorpay Payments ──────────────────────────────────────
export type PaymentPlanId = 'starter' | 'pro' | 'premium' | 'lifetime';

export const getPaymentPlans = () =>
  apiFetch<{
    current_plan: string;
    currency: string;
    configured: boolean;
    plans: Array<{
      id: PaymentPlanId;
      name: string;
      price_inr: number;
      billing_cycle: 'monthly' | 'lifetime';
      best_for: string;
      features: string[];
      recommended?: boolean;
    }>;
  }>(`${API_BASE}/api/payments/plans`);

export const createRazorpayOrder = (plan: PaymentPlanId, billing_cycle: 'monthly' | 'lifetime') =>
  apiFetch<{
    key_id: string;
    order_id: string;
    amount: number;
    currency: string;
    plan: string;
    billing_cycle: string;
    company_name: string;
    user: { name: string; email: string };
    description: string;
  }>(`${API_BASE}/api/payments/create-order`, {
    method: 'POST',
    body: JSON.stringify({ plan, billing_cycle }),
  });

export const verifyRazorpayPayment = (data: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) =>
  apiFetch<{
    status: string;
    message: string;
    plan: string;
    billing_cycle: string;
  }>(`${API_BASE}/api/payments/verify`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const getPaymentHistory = () =>
  apiFetch<{ payments: any[] }>(`${API_BASE}/api/payments/history`);

export const getCurrentPlan = () =>
  apiFetch<{ plan: string; status: string; expires_at: string | null }>(`${API_BASE}/api/payments/current-plan`);


// ─── Admin Panel ───────────────────────────────────────────────
export const getAdminUsers = () =>
  apiFetch<any[]>(`${API_BASE}/api/admin/users`);

export const updateUserSubscription = (userId: number, plan: string) =>
  apiFetch(`${API_BASE}/api/admin/users/${userId}/subscription`, {
    method: 'PUT',
    body: JSON.stringify({ plan }),
  });

export const deleteUser = (userId: number) =>
  apiFetch(`${API_BASE}/api/admin/users/${userId}`, {
    method: 'DELETE',
  });
