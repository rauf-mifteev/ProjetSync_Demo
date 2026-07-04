// ProjetSync — couche de données simulée (client-only demo)
// Reproduit fidèlement les entités et règles de gestion du cahier des charges
// (section 2.3) et de la spécification technique (section 1), afin de pouvoir
// être remplacée plus tard par de vrais appels à l'API REST (section 2) sans
// changer la forme des données consommées par les pages.

const DB_KEY = "projetsync_db_v1";
const SESSION_KEY = "projetsync_session_v1";

const COLORS = ["#3F51D6", "#209E92", "#E15C3F", "#C98A24", "#8A5CF6", "#0EA5A5"];
const colorFor = (seed) => COLORS[Math.abs(hash(seed)) % COLORS.length];
function hash(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i); return h; }
function uid(prefix) { return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`; }
function daysFromNow(n) { const d = new Date(); d.setDate(d.getDate() + n); d.setHours(17, 0, 0, 0); return d.toISOString(); }

function seedDatabase() {
  const users = [
    { _id: "u_kevin", name: "Kevin Mai", email: "kevin.mai@demo.projetsync.app", password: "demo1234", avatarColor: colorFor("Kevin Mai") },
    { _id: "u_rauf", name: "Rauf Mifteev", email: "rauf.mifteev@demo.projetsync.app", password: "demo1234", avatarColor: colorFor("Rauf Mifteev") },
    { _id: "u_daniel", name: "Daniel Alain Dyky", email: "daniel.dyky@demo.projetsync.app", password: "demo1234", avatarColor: colorFor("Daniel Alain Dyky") },
    { _id: "u_kvb", name: "Kevin Vazquez Boza", email: "kevin.vb@demo.projetsync.app", password: "demo1234", avatarColor: colorFor("Kevin Vazquez Boza") },
    { _id: "u_danensky", name: "Danensky Nashby Leveille", email: "danensky.nl@demo.projetsync.app", password: "demo1234", avatarColor: colorFor("Danensky Nashby Leveille") },
  ];

  const team = {
    _id: "t_projetsync",
    name: "Équipe ProjetSync",
    members: [
      { userId: "u_kvb", role: "scrumMaster", joinedAt: daysFromNow(-30) },
      { userId: "u_kevin", role: "member", joinedAt: daysFromNow(-30) },
      { userId: "u_rauf", role: "member", joinedAt: daysFromNow(-30) },
      { userId: "u_daniel", role: "member", joinedAt: daysFromNow(-30) },
      { userId: "u_danensky", role: "member", joinedAt: daysFromNow(-30) },
    ],
    createdBy: "u_kvb",
    createdAt: daysFromNow(-30),
  };

  const taskSeeds = [
    ["Rédiger le cahier des charges", "Compiler les sections 2.1 à 2.8 dans le document final.", "done", "high", ["u_kvb"], -2],
    ["Réaliser les entrevues utilisateurs", "10 entrevues, 2 par membre minimum.", "done", "high", ["u_kevin", "u_rauf", "u_daniel", "u_kvb", "u_danensky"], -3],
    ["Créer les wireframes Figma", "Tableau de bord + vue Kanban.", "done", "medium", ["u_kvb"], -1],
    ["Mettre en place le projet React", "Structure de dossiers, routing, design tokens.", "in_progress", "high", ["u_kevin"], 2],
    ["Modéliser la base de données MongoDB", "Schémas User, Team, Task, Notification, Decision.", "in_progress", "high", ["u_rauf"], 2],
    ["Configurer l'authentification JWT", "Inscription, connexion, middleware de protection des routes.", "in_progress", "high", ["u_rauf", "u_daniel"], 3],
    ["Développer la vue Kanban", "Glisser-déposer entre les colonnes À faire / En cours / Terminé.", "todo", "medium", ["u_kevin"], 6],
    ["Développer le calendrier d'équipe", "Vue mensuelle avec indicateurs d'échéance.", "todo", "medium", ["u_daniel"], 8],
    ["Implémenter les rappels automatiques", "Tâche planifiée 48h / 24h avant échéance.", "todo", "medium", ["u_rauf"], 9],
    ["Configurer le déploiement", "Pipeline de déploiement continu + hébergement.", "todo", "low", ["u_danensky"], 10],
    ["Préparer la démonstration finale", "Jeu de données, script de présentation.", "todo", "low", ["u_kvb", "u_danensky"], 12],
  ];

  const tasks = taskSeeds.map(([title, description, status, priority, assignees, dueOffset]) => ({
    _id: uid("task"),
    teamId: team._id,
    title, description, status, priority, assignees,
    dueDate: daysFromNow(dueOffset),
    createdBy: assignees[0],
    reminderSent48h: false,
    reminderSent24h: false,
    createdAt: daysFromNow(-5),
  }));

  const decisions = [
    { _id: uid("dec"), teamId: team._id, title: "Adoption d'une méthodologie Agile Scrum", description: "Sprints d'une semaine, revue chaque vendredi.", loggedBy: "u_kvb", relatedTaskId: null, createdAt: daysFromNow(-6) },
    { _id: uid("dec"), teamId: team._id, title: "Choix de la pile technique", description: "React + Node.js/Express + MongoDB, retenue pour la rapidité de mise en œuvre.", loggedBy: "u_rauf", relatedTaskId: null, createdAt: daysFromNow(-4) },
  ];

  const notifications = [
    { _id: uid("notif"), userId: "u_kevin", teamId: team._id, type: "task_assigned", message: "Vous avez été assigné à « Mettre en place le projet React ».", relatedTaskId: tasks[3]._id, isRead: false, createdAt: daysFromNow(-1) },
    { _id: uid("notif"), userId: "u_kevin", teamId: team._id, type: "task_due_soon", message: "« Développer la vue Kanban » est due dans 6 jours.", relatedTaskId: tasks[6]._id, isRead: false, createdAt: daysFromNow(0) },
    { _id: uid("notif"), userId: "u_kevin", teamId: team._id, type: "decision_logged", message: "Kevin Vazquez Boza a consigné une décision : « Adoption d'une méthodologie Agile Scrum ».", relatedTaskId: null, isRead: true, createdAt: daysFromNow(-6) },
    { _id: uid("notif"), userId: "u_rauf", teamId: team._id, type: "task_assigned", message: "Vous avez été assigné à « Modéliser la base de données MongoDB ».", relatedTaskId: tasks[4]._id, isRead: false, createdAt: daysFromNow(-1) },
    { _id: uid("notif"), userId: "u_rauf", teamId: team._id, type: "member_joined", message: "Daniel Alain Dyky s'est joint à l'équipe ProjetSync.", relatedTaskId: null, isRead: true, createdAt: daysFromNow(-29) },
  ];

  return { users, teams: [team], tasks, notifications, decisions };
}

function load() {
  const raw = localStorage.getItem(DB_KEY);
  if (raw) {
    try { return JSON.parse(raw); } catch { /* fallthrough to reseed */ }
  }
  const db = seedDatabase();
  save(db);
  return db;
}
function save(db) { localStorage.setItem(DB_KEY, JSON.stringify(db)); }

function apiError(code, message, field) {
  const err = new Error(message);
  err.code = code;
  err.field = field;
  return err;
}

// -------------------- Auth --------------------
export function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}
function setSession(userId) { localStorage.setItem(SESSION_KEY, JSON.stringify({ userId })); }
export function logout() { localStorage.removeItem(SESSION_KEY); }

export async function login(email, password) {
  const db = load();
  const user = db.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user || user.password !== password) {
    throw apiError("INVALID_CREDENTIALS", "Courriel ou mot de passe incorrect.", "password");
  }
  setSession(user._id);
  return sanitizeUser(user);
}

export async function register(name, email, password) {
  const db = load();
  if (db.users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
    throw apiError("EMAIL_TAKEN", "Un compte existe déjà avec ce courriel.", "email");
  }
  const user = { _id: uid("u"), name: name.trim(), email: email.trim(), password, avatarColor: colorFor(name) };
  db.users.push(user);
  save(db);
  setSession(user._id);
  return sanitizeUser(user);
}

export async function getCurrentUser() {
  const session = getSession();
  if (!session) return null;
  const db = load();
  const user = db.users.find((u) => u._id === session.userId);
  return user ? sanitizeUser(user) : null;
}

function sanitizeUser(u) { const { password, ...rest } = u; return rest; }

// -------------------- Teams --------------------
export async function getMyTeams(userId) {
  const db = load();
  return db.teams
    .filter((t) => t.members.some((m) => m.userId === userId))
    .map((t) => hydrateTeam(t, db));
}

export async function getTeam(teamId) {
  const db = load();
  const team = db.teams.find((t) => t._id === teamId);
  if (!team) return null;
  return hydrateTeam(team, db);
}

function hydrateTeam(team, db) {
  return {
    ...team,
    members: team.members.map((m) => ({ ...m, user: sanitizeUser(db.users.find((u) => u._id === m.userId)) })),
  };
}

export async function createTeam(name, userId) {
  const db = load();
  const team = {
    _id: uid("t"), name: name.trim(),
    members: [{ userId, role: "scrumMaster", joinedAt: new Date().toISOString() }],
    createdBy: userId, createdAt: new Date().toISOString(),
  };
  db.teams.push(team);
  save(db);
  return hydrateTeam(team, db);
}

export async function inviteMember(teamId, email) {
  const db = load();
  const team = db.teams.find((t) => t._id === teamId);
  const user = db.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user) throw apiError("USER_NOT_FOUND", "Aucun compte ProjetSync n'utilise ce courriel.", "email");
  if (team.members.length >= 6) throw apiError("TEAM_FULL", "Une équipe ne peut pas dépasser 6 membres (RG-01).", "email");
  if (team.members.some((m) => m.userId === user._id)) throw apiError("ALREADY_MEMBER", "Cette personne fait déjà partie de l'équipe.", "email");
  team.members.push({ userId: user._id, role: "member", joinedAt: new Date().toISOString() });
  db.notifications.push({ _id: uid("notif"), userId: user._id, teamId, type: "member_joined", message: `Vous avez été ajouté à l'équipe « ${team.name} ».`, relatedTaskId: null, isRead: false, createdAt: new Date().toISOString() });
  save(db);
  return hydrateTeam(team, db);
}

export async function removeMember(teamId, userId) {
  const db = load();
  const team = db.teams.find((t) => t._id === teamId);
  if (team.members.length <= 2) throw apiError("TEAM_MIN_SIZE", "Une équipe doit conserver au moins 2 membres (RG-01).");
  team.members = team.members.filter((m) => m.userId !== userId);
  save(db);
  return hydrateTeam(team, db);
}

// -------------------- Tasks --------------------
export async function getTasks(teamId, { status, assignee } = {}) {
  const db = load();
  return db.tasks
    .filter((t) => t.teamId === teamId)
    .filter((t) => !status || t.status === status)
    .filter((t) => !assignee || t.assignees.includes(assignee))
    .map((t) => hydrateTask(t, db))
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
}

function hydrateTask(t, db) {
  return { ...t, assigneeUsers: t.assignees.map((id) => sanitizeUser(db.users.find((u) => u._id === id))).filter(Boolean) };
}

export async function createTask(teamId, { title, description, priority, assignees, dueDate, createdBy }) {
  const db = load();
  if (!title || !title.trim()) throw apiError("VALIDATION_ERROR", "Le titre est requis.", "title");
  if (!assignees || assignees.length === 0) throw apiError("TASK_ASSIGNEE_REQUIRED", "Assignez la tâche à au moins un membre (RG-02).", "assignees");
  if (!dueDate) throw apiError("VALIDATION_ERROR", "L'échéance est requise.", "dueDate");
  if (new Date(dueDate) < new Date(new Date().toDateString())) {
    throw apiError("TASK_DUE_DATE_INVALID", "La date d'échéance ne peut pas être antérieure à aujourd'hui (RG-04).", "dueDate");
  }
  const task = {
    _id: uid("task"), teamId, title: title.trim(), description: description?.trim() || "",
    status: "todo", priority: priority || "medium", assignees, dueDate,
    createdBy, reminderSent48h: false, reminderSent24h: false, createdAt: new Date().toISOString(),
  };
  db.tasks.push(task);
  assignees.forEach((uidAssignee) => {
    if (uidAssignee !== createdBy) {
      db.notifications.push({ _id: uid("notif"), userId: uidAssignee, teamId, type: "task_assigned", message: `Vous avez été assigné à « ${task.title} ».`, relatedTaskId: task._id, isRead: false, createdAt: new Date().toISOString() });
    }
  });
  save(db);
  return hydrateTask(task, db);
}

const STATUS_ORDER = ["todo", "in_progress", "done"];
export async function updateTaskStatus(taskId, status) {
  const db = load();
  const task = db.tasks.find((t) => t._id === taskId);
  if (!task) throw apiError("NOT_FOUND", "Tâche introuvable.");
  if (!STATUS_ORDER.includes(status)) throw apiError("VALIDATION_ERROR", "Statut invalide.");
  task.status = status;
  task.updatedAt = new Date().toISOString();
  save(db);
  return hydrateTask(task, db);
}

export async function updateTask(taskId, patch) {
  const db = load();
  const task = db.tasks.find((t) => t._id === taskId);
  if (!task) throw apiError("NOT_FOUND", "Tâche introuvable.");
  Object.assign(task, patch, { updatedAt: new Date().toISOString() });
  save(db);
  return hydrateTask(task, db);
}

export async function deleteTask(taskId, requestingUserId, team) {
  const db = load();
  const task = db.tasks.find((t) => t._id === taskId);
  if (!task) return;
  const membership = team.members.find((m) => m.userId === requestingUserId);
  const isAuthor = task.createdBy === requestingUserId;
  const isScrumMaster = membership?.role === "scrumMaster";
  if (!isAuthor && !isScrumMaster) throw apiError("FORBIDDEN", "Seul l'auteur ou le Scrum Master peut supprimer cette tâche (RG-03).");
  db.tasks = db.tasks.filter((t) => t._id !== taskId);
  save(db);
}

// -------------------- Calendar --------------------
export async function getCalendarEvents(teamId, from, to) {
  const db = load();
  return db.tasks
    .filter((t) => t.teamId === teamId)
    .filter((t) => new Date(t.dueDate) >= from && new Date(t.dueDate) <= to)
    .map((t) => hydrateTask(t, db));
}

// -------------------- Notifications --------------------
export async function getNotifications(userId, unreadOnly = false) {
  const db = load();
  return db.notifications
    .filter((n) => n.userId === userId)
    .filter((n) => !unreadOnly || !n.isRead)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function markNotificationRead(id) {
  const db = load();
  const n = db.notifications.find((x) => x._id === id);
  if (n) n.isRead = true;
  save(db);
}

export async function markAllNotificationsRead(userId) {
  const db = load();
  db.notifications.filter((n) => n.userId === userId).forEach((n) => (n.isRead = true));
  save(db);
}

// -------------------- Dashboard --------------------
export async function getDashboard(teamId) {
  const db = load();
  const tasks = db.tasks.filter((t) => t.teamId === teamId);
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "done").length;
  const tasksByStatus = {
    todo: tasks.filter((t) => t.status === "todo").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    done,
  };
  const now = new Date();
  const in7days = new Date(); in7days.setDate(now.getDate() + 7);
  const upcomingDeadlines = tasks
    .filter((t) => t.status !== "done" && new Date(t.dueDate) <= in7days)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .map((t) => hydrateTask(t, db));
  const team = db.teams.find((t) => t._id === teamId);
  const tasksByMember = team.members.map((m) => {
    const user = db.users.find((u) => u._id === m.userId);
    const assigned = tasks.filter((t) => t.assignees.includes(m.userId));
    const memberDone = assigned.filter((t) => t.status === "done").length;
    return { user: sanitizeUser(user), total: assigned.length, done: memberDone };
  });
  return {
    completionRate: total === 0 ? 0 : Math.round((done / total) * 100),
    tasksByStatus, upcomingDeadlines, tasksByMember, totalTasks: total,
  };
}

// -------------------- Decisions --------------------
export async function getDecisions(teamId) {
  const db = load();
  return db.decisions
    .filter((d) => d.teamId === teamId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map((d) => ({ ...d, loggedByUser: sanitizeUser(db.users.find((u) => u._id === d.loggedBy)) }));
}

export async function createDecision(teamId, { title, description, loggedBy, relatedTaskId }) {
  const db = load();
  if (!title || !title.trim()) throw apiError("VALIDATION_ERROR", "Le titre de la décision est requis.", "title");
  const decision = { _id: uid("dec"), teamId, title: title.trim(), description: description?.trim() || "", loggedBy, relatedTaskId: relatedTaskId || null, createdAt: new Date().toISOString() };
  db.decisions.push(decision);
  save(db);
  return { ...decision, loggedByUser: sanitizeUser(db.users.find((u) => u._id === loggedBy)) };
}

export async function resetDemoData() {
  localStorage.removeItem(DB_KEY);
  load();
}
