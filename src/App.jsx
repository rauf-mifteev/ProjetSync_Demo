import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCurrentUser } from "./lib/data";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import TasksPage from "./pages/TasksPage";
import CalendarPage from "./pages/CalendarPage";
import TeamPage from "./pages/TeamPage";
import DecisionsPage from "./pages/DecisionsPage";

export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    document.title = "ProjetSync — Gestion de travaux d'équipe";
    getCurrentUser()
      .then(setUser)
      .finally(() => setChecking(false));
  }, []);

  if (checking) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-brand-500" />
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <LoginPage onAuth={setUser} />}
        />
        <Route
          element={user ? <Layout user={user} onLogout={() => setUser(null)} /> : <Navigate to="/login" replace />}
        >
          <Route path="/" element={<DashboardPage user={user} />} />
          <Route path="/taches" element={<TasksPage user={user} />} />
          <Route path="/calendrier" element={<CalendarPage user={user} />} />
          <Route path="/equipe" element={<TeamPage user={user} />} />
          <Route path="/decisions" element={<DecisionsPage user={user} />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
