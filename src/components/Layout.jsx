import { Outlet, useLocation, NavLink } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { LayoutDashboard, ListChecks, CalendarDays, Users, ScrollText } from "lucide-react";

const TITLES = {
  "/": "Tableau de bord",
  "/taches": "Tâches",
  "/calendrier": "Calendrier",
  "/equipe": "Équipe",
  "/decisions": "Décisions",
};

const MOBILE_NAV = [
  { to: "/", icon: LayoutDashboard, end: true },
  { to: "/taches", icon: ListChecks },
  { to: "/calendrier", icon: CalendarDays },
  { to: "/equipe", icon: Users },
  { to: "/decisions", icon: ScrollText },
];

export default function Layout({ user, onLogout }) {
  const location = useLocation();
  const title = TITLES[location.pathname] || "ProjetSync";

  return (
    <div className="flex h-screen w-full bg-slate-50">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar user={user} title={title} onLogout={onLogout} />
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0 scrollbar-thin">
          <Outlet />
        </main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-10 flex items-center justify-around border-t border-slate-200 bg-white py-2 md:hidden">
        {MOBILE_NAV.map(({ to, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `focus-ring flex h-11 w-11 items-center justify-center rounded-xl ${isActive ? "bg-brand-50 text-brand-600" : "text-slate-400"}`
            }
          >
            <Icon size={20} />
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
