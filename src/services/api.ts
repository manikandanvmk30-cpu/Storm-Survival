/**
 * api.ts — Frontend API service for Storm Survival
 * Connects to the Express backend via /api/* endpoints.
 * Vite proxies these requests to http://localhost:5000 in development.
 */

export interface HintResponse {
  hint: string;
  source: 'gemini' | 'static' | 'static_fallback';
}

export interface ChatResponse {
  reply: string;
  source: 'gemini' | 'offline';
}

export interface SaveResponse {
  success: boolean;
  message?: string;
}

export interface LoadResponse {
  found: boolean;
  saveData?: object;
  message?: string;
}

export interface LeaderboardEntry {
  username: string;
  xp: number;
  rank: string;
  completedLevels: number;
  updatedAt: string;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  geminiConfigured: boolean;
  version: string;
}

// ─── Base fetch helper ────────────────────────────────────────────────────────
async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err?.error || `Request failed: ${res.status}`);
  }

  return res.json();
}

// ─── Health Check ─────────────────────────────────────────────────────────────
export async function checkHealth(): Promise<HealthResponse> {
  return apiRequest<HealthResponse>('/api/health');
}

// ─── AI Hint (calls backend → Gemini securely) ────────────────────────────────
export async function getAIHint(params: {
  question: string;
  options?: string[];
  subject?: string;
  difficulty?: string;
}): Promise<HintResponse> {
  return apiRequest<HintResponse>('/api/hint', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// ─── AI Chat / Tutor ──────────────────────────────────────────────────────────
export async function sendChatMessage(
  message: string,
  context?: string
): Promise<ChatResponse> {
  return apiRequest<ChatResponse>('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ message, context }),
  });
}

// ─── Server-side Save ────────────────────────────────────────────────────────
export async function saveGameToServer(
  username: string,
  saveData: object
): Promise<SaveResponse> {
  return apiRequest<SaveResponse>('/api/save', {
    method: 'POST',
    body: JSON.stringify({ username, saveData }),
  });
}

// ─── Server-side Load ────────────────────────────────────────────────────────
export async function loadGameFromServer(username: string): Promise<LoadResponse> {
  return apiRequest<LoadResponse>(`/api/save/${encodeURIComponent(username)}`);
}

// ─── Delete Save ─────────────────────────────────────────────────────────────
export async function deleteSaveFromServer(username: string): Promise<SaveResponse> {
  return apiRequest<SaveResponse>(`/api/save/${encodeURIComponent(username)}`, {
    method: 'DELETE',
  });
}

// ─── Leaderboard ─────────────────────────────────────────────────────────────
export async function getLeaderboard(): Promise<{ leaderboard: LeaderboardEntry[] }> {
  return apiRequest<{ leaderboard: LeaderboardEntry[] }>('/api/leaderboard');
}

export async function postLeaderboardEntry(entry: {
  username: string;
  xp: number;
  rank: string;
  completedLevels: number;
}): Promise<SaveResponse> {
  return apiRequest<SaveResponse>('/api/leaderboard', {
    method: 'POST',
    body: JSON.stringify(entry),
  });
}
