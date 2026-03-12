/**
 * DevForge OS - API Service Layer (Updated)
 * All fetch calls now point to:
 *   - FastAPI backend:     /api/*
 *   - Flask microservice:  /microservice/api/*
 */

const API_BASE = import.meta.env.VITE_API_URL || "";
const MS_BASE = import.meta.env.VITE_MICROSERVICE_URL || "";

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "API error");
  }
  return res.json();
}

// ─── Dashboard ────────────────────────────────────────────────────
export const getDashboard = () =>
  apiFetch(`${API_BASE}/api/dashboard`);

// ─── DSA Problems ────────────────────────────────────────────────
export const getDSAProblems = () =>
  apiFetch(`${API_BASE}/api/dsa`);

export const createDSAProblem = (data: object) =>
  apiFetch(`${API_BASE}/api/dsa`, { method: "POST", body: JSON.stringify(data) });

export const updateDSAProblem = (id: number, data: object) =>
  apiFetch(`${API_BASE}/api/dsa/${id}`, { method: "PATCH", body: JSON.stringify(data) });

export const deleteDSAProblem = (id: number) =>
  apiFetch(`${API_BASE}/api/dsa/${id}`, { method: "DELETE" });

// ─── Applications ────────────────────────────────────────────────
export const getApplications = () =>
  apiFetch(`${API_BASE}/api/applications`);

export const createApplication = (data: object) =>
  apiFetch(`${API_BASE}/api/applications`, { method: "POST", body: JSON.stringify(data) });

export const updateApplication = (id: number, data: object) =>
  apiFetch(`${API_BASE}/api/applications/${id}`, { method: "PATCH", body: JSON.stringify(data) });

// ─── Interviews ──────────────────────────────────────────────────
export const getInterviews = () =>
  apiFetch(`${API_BASE}/api/interviews`);

export const createInterview = (data: object) =>
  apiFetch(`${API_BASE}/api/interviews`, { method: "POST", body: JSON.stringify(data) });

// ─── System Design ────────────────────────────────────────────────
export const getSystemDesignSessions = () =>
  apiFetch(`${API_BASE}/api/system-design`);

export const saveSystemDesignSession = (data: object) =>
  apiFetch(`${API_BASE}/api/system-design`, { method: "POST", body: JSON.stringify(data) });

// ─── Projects ────────────────────────────────────────────────────
export const getProjectTasks = () =>
  apiFetch(`${API_BASE}/api/projects`);

export const createProjectTask = (data: object) =>
  apiFetch(`${API_BASE}/api/projects`, { method: "POST", body: JSON.stringify(data) });

export const toggleProjectTask = (id: number) =>
  apiFetch(`${API_BASE}/api/projects/${id}`, { method: "PATCH" });

// ─── Flask Microservice: AI Feedback ─────────────────────────────
export const getAIFeedback = (prompt: string, cacheKey?: string) =>
  apiFetch(`${MS_BASE}/api/ai-feedback`, {
    method: "POST",
    body: JSON.stringify({ prompt, cache_key: cacheKey }),
  });

// ─── Flask Microservice: LeetCode ────────────────────────────────
export const getLeetCodeStats = (username: string) =>
  apiFetch(`${MS_BASE}/api/leetcode/${username}`);
