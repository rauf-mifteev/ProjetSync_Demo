import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ListChecks, CalendarClock, TrendingUp, Users, ArrowUpRight, Clock3 } from "lucide-react";
import { getMyTeams, getDashboard } from "../lib/data";
import Avatar, { AvatarStack } from "../components/Avatar";
import { PriorityPill, EmptyState, PageLoading, formatDateShort } from "../components/ui";

export default function DashboardPage({ user }) {
  const [team, setTeam] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getMyTeams(user._id)
      .then(async (teams) => {
        const t = teams[0] || null;
        if (cancelled) return;
        setTeam(t);
        if (t) setData(await getDashboard(t._id));
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [user._id]);

  if (loading) return <PageLoading />;
  if (error) return <EmptyState icon={Users} title="Impossible de charger le tableau de bord" description={error} />;

  if (!team || !data) {
    return (
      <EmptyState
        icon={Users}
        title="Vous ne faites partie d'aucune équipe"
        description="Créez une équipe depuis la page Équipe pour commencer à organiser vos travaux."
      />
    );
  }

  const firstName = user.name.split(" ")[0];

  const stats = [
    { label: "Tâches à faire", value: data.tasksByStatus.todo, icon: ListChecks, accent: "text-brand-500 bg-brand-50" },
    { label: "Échéances (7 jours)", value: data.upcomingDeadlines.length, icon: CalendarClock, accent: "text-coral-500 bg-coral-400/10" },
    { label: "Avancement global", value: `${data.completionRate}%`, icon: TrendingUp, accent: "text-teal-500 bg-teal-400/10" },
    { label: "Membres de l'équipe", value: team.members.length, icon: Users, accent: "text-gold-500 bg-gold-400/10" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-6 md:px-8 md:py-8">
      <div className="mb-7">
        <h2 className="font-display text-2xl font-semibold text-ink">Bonjour, {firstName} 👋</h2>
        <p className="mt-1 text-sm text-slate-500">Voici l'aperçu de {team.name} aujourd'hui.</p>
      </div>

      <div className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-4">
            <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${s.accent}`}>
              <s.icon size={17} strokeWidth={2.2} />
            </div>
            <p className="font-display text-2xl font-semibold text-ink">{s.value}</p>
            <p className="mt-0.5 text-xs text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <div className="card col-span-1 p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold text-ink">Avancement du projet</h3>
            <span className="font-display text-sm font-semibold text-brand-500">{data.completionRate}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${data.completionRate}%` }} />
          </div>
          <div className="mt-5 space-y-3">
            {[
              ["À faire", data.tasksByStatus.todo, "bg-slate-300"],
              ["En cours", data.tasksByStatus.in_progress, "bg-brand-500"],
              ["Terminé", data.tasksByStatus.done, "bg-teal-500"],
            ].map(([label, count, color]) => (
              <div key={label} className="flex items-center gap-3 text-sm">
                <span className={`h-2 w-2 rounded-full ${color}`} />
                <span className="flex-1 text-slate-500">{label}</span>
                <span className="font-medium text-ink">{count}</span>
              </div>
            ))}
          </div>

          <h3 className="mb-3 mt-6 font-display text-sm font-semibold text-ink">Avancement par membre</h3>
          <div className="space-y-3.5">
            {data.tasksByMember.map((m) => (
              <div key={m.user._id} className="flex items-center gap-3">
                <Avatar user={m.user} size={26} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="truncate font-medium text-ink">{m.user.name}</span>
                    <span className="text-slate-400">{m.done}/{m.total}</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-teal-400"
                      style={{ width: `${m.total === 0 ? 0 : Math.round((m.done / m.total) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card col-span-1 p-5 lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold text-ink">Échéances à venir</h3>
            <Link to="/calendrier" className="focus-ring flex items-center gap-1 text-xs font-medium text-brand-500 hover:text-brand-600">
              Voir le calendrier <ArrowUpRight size={13} />
            </Link>
          </div>

          {data.upcomingDeadlines.length === 0 ? (
            <EmptyState icon={Clock3} title="Rien à l'horizon" description="Aucune échéance dans les 7 prochains jours." />
          ) : (
            <ul className="divide-y divide-slate-100">
              {data.upcomingDeadlines.map((t) => (
                <li key={t._id} className="flex items-center gap-3 py-3">
                  <div className="flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-lg bg-slate-50 text-[10px] font-semibold leading-none text-slate-500">
                    <Clock3 size={14} className="mb-0.5 text-slate-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{t.title}</p>
                    <p className="text-xs text-slate-400">Échéance : {formatDateShort(t.dueDate)}</p>
                  </div>
                  <PriorityPill priority={t.priority} />
                  <AvatarStack users={t.assigneeUsers} max={3} size={22} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
