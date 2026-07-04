// Client HTTP réel — mêmes fonctions et signatures que store.js (mode démo),
// mais chaque appel interroge l'API Node.js/Express + MongoDB.
// Voir spécification technique, section 2 (contrat d'API).

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";
const TOKEN_KEY = "projetsync_token_v1";

function getToken() { return localStorage.getItem(TOKEN_KEY); }
function setToken(token) { localStorage.setItem(TOKEN_KEY, token); }
function clearToken() { localStorage.removeItem(TOKEN_KEY); }

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method, headers, body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    const err = new Error("Impossible de joindre le serveur ProjetSync. Vérifiez votre connexion ou réessayez plus tard.");
    err.code = "NETWORK_ERROR";
    throw err;
  }

  if (res.status === 204) return null;

  let data = null;
  try { data = await res.json(); } catch { /* réponse vide */ }

  if (!res.ok) {
    const err = new Error(data?.error?.message || "Une erreur est survenue.");
    err.code = data?.error?.code;
    err.field = data?.error?.field;
    err.status = res.status;
    throw err;
  }
  return data;
}

// -------------------- Auth --------------------
export async function login(email, password) {
  const data = await request("/auth/login", { method: "POST", body: { email, password }, auth: false });
  setToken(data.token);
  return data.user;
}

export async function register(name, email, password) {
  const data = await request("/auth/register", { method: "POST", body: { name, email, password }, auth: false });
  setToken(data.token);
  return data.user;
}

export async function getCurrentUser() {
  if (!getToken()) return null;
  try {
    return await request("/auth/me");
  } catch {
    clearToken();
    return null;
  }
}

export function logout() { clearToken(); }

// -------------------- Teams --------------------
// userId accepté (et ignoré) pour compatibilité avec l'interface du mode démo :
// côté serveur, l'utilisateur courant est déduit du jeton JWT.
export async function getMyTeams(_userId) {
  const { teams } = await request("/teams");
  return teams;
}
export async function getTeam(teamId) {
  const { team } = await request(`/teams/${teamId}`);
  return team;
}
export async function createTeam(name) {
  const { team } = await request("/teams", { method: "POST", body: { name } });
  return team;
}
export async function inviteMember(teamId, email) {
  const { team } = await request(`/teams/${teamId}/invite`, { method: "POST", body: { email } });
  return team;
}
export async function removeMember(teamId, userId) {
  const { team } = await request(`/teams/${teamId}/members/${userId}`, { method: "DELETE" });
  return team;
}

// -------------------- Tasks --------------------
export async function getTasks(teamId, { status, assignee } = {}) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (assignee) params.set("assignee", assignee);
  const qs = params.toString() ? `?${params}` : "";
  const { tasks } = await request(`/teams/${teamId}/tasks${qs}`);
  return tasks;
}
export async function createTask(teamId, { title, description, priority, assignees, dueDate }) {
  const { task } = await request(`/teams/${teamId}/tasks`, {
    method: "POST", body: { title, description, priority, assignees, dueDate },
  });
  return task;
}
export async function updateTaskStatus(taskId, status) {
  const { task } = await request(`/tasks/${taskId}/status`, { method: "PATCH", body: { status } });
  return task;
}
export async function updateTask(taskId, patch) {
  const { task } = await request(`/tasks/${taskId}`, { method: "PATCH", body: patch });
  return task;
}
export async function deleteTask(taskId, _requestingUserId, _team) {
  await request(`/tasks/${taskId}`, { method: "DELETE" });
}

// -------------------- Calendar --------------------
export async function getCalendarEvents(teamId, from, to) {
  const params = new URLSearchParams({ from: from.toISOString(), to: to.toISOString() });
  const { events } = await request(`/teams/${teamId}/calendar?${params}`);
  return events.map((e) => ({ ...e, dueDate: e.dueDate }));
}

// -------------------- Notifications --------------------
export async function getNotifications(_userId, unreadOnly = false) {
  const qs = unreadOnly ? "?unreadOnly=true" : "";
  const { notifications } = await request(`/notifications${qs}`);
  return notifications;
}
export async function markNotificationRead(id) {
  await request(`/notifications/${id}/read`, { method: "PATCH" });
}
export async function markAllNotificationsRead(_userId) {
  await request("/notifications/read-all", { method: "PATCH" });
}

// -------------------- Dashboard --------------------
export async function getDashboard(teamId) {
  return request(`/teams/${teamId}/dashboard`);
}

// -------------------- Decisions --------------------
export async function getDecisions(teamId) {
  const { decisions } = await request(`/teams/${teamId}/decisions`);
  return decisions;
}
export async function createDecision(teamId, { title, description, relatedTaskId }) {
  const { decision } = await request(`/teams/${teamId}/decisions`, {
    method: "POST", body: { title, description, relatedTaskId },
  });
  return decision;
}
