// Point d'entrée unique utilisé par toutes les pages/composants.
// Bascule entre le mode démonstration (localStorage, voir store.js) et
// l'API réelle (Node.js/Express + MongoDB, voir api.js) selon la présence
// de VITE_API_BASE_URL au moment du build (fichier .env, voir README).
//
// Aucune page n'a besoin d'être modifiée pour passer de l'un à l'autre :
// les deux modules exposent exactement les mêmes fonctions, toutes async.
import * as mock from "./store.js";
import * as api from "./api.js";

export const USE_API = Boolean(import.meta.env.VITE_API_BASE_URL);
const impl = USE_API ? api : mock;

export const login = impl.login;
export const register = impl.register;
export const getCurrentUser = impl.getCurrentUser;
export const logout = impl.logout;

export const getMyTeams = impl.getMyTeams;
export const getTeam = impl.getTeam;
export const createTeam = impl.createTeam;
export const inviteMember = impl.inviteMember;
export const removeMember = impl.removeMember;

export const getTasks = impl.getTasks;
export const createTask = impl.createTask;
export const updateTaskStatus = impl.updateTaskStatus;
export const updateTask = impl.updateTask;
export const deleteTask = impl.deleteTask;

export const getCalendarEvents = impl.getCalendarEvents;

export const getNotifications = impl.getNotifications;
export const markNotificationRead = impl.markNotificationRead;
export const markAllNotificationsRead = impl.markAllNotificationsRead;

export const getDashboard = impl.getDashboard;

export const getDecisions = impl.getDecisions;
export const createDecision = impl.createDecision;
