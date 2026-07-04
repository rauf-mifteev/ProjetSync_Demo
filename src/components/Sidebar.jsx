import { NavLink } from "react-router-dom";
import { LayoutDashboard, ListChecks, CalendarDays, Users, ScrollText, Sparkles } from "lucide-react";

const NAV = [
  { to: "/", label: "Tableau de bord", icon: LayoutDashboard, end: true },
  { to: "/taches", label: "Tâches", icon: ListChecks },
  { to: "/calendrier", label: "Calendrier", icon: CalendarDays },
  { to: "/equipe", label: "Équipe", icon: Users },
  { to: "/decisions", label: "Décisions", icon: ScrollText },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-5">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
          <Sparkles size={17} strokeWidth={2.2} />
        </div>
        <span className="font-display text-lg font-semibold tracking-tight text-ink">ProjetSync</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `focus-ring flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand-50 text-brand-600"
                  : "text-slate-500 hover:bg-slate-100 hover:text-ink"
              }`
            }
          >
            <Icon size={18} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="rounded-xl2 bg-slate-50 border border-slate-200 p-4">
        <p className="font-display text-sm font-semibold text-ink">Démo TP1</p>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          Données fictives stockées localement dans votre navigateur — aucun serveur requis pour cette démonstration.
        </p>
      </div>
    </aside>
  );
}
