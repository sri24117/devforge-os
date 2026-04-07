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

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
const MS_BASE = import.meta.env.VITE_MICROSERVICE_URL || "http://localhost:5001";

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
export const executeCode = (code: string, language: string = "python") =>
  apiFetch<{ stdout?: string; stderr?: string }>(`${API_BASE}/api/execute`, {
    method: "POST",
    body: JSON.stringify({ code, language }),
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
