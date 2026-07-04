import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, LayoutGrid, List, CalendarDays } from "lucide-react";
import { getMyTeams, getCalendarEvents } from "../lib/data";
import { AvatarStack } from "../components/Avatar";
import { PriorityPill, StatusPill, EmptyState, PageLoading, formatDate } from "../components/ui";

const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTHS = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];

function startOfMonth(d) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function sameDay(a, b) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }

export default function CalendarPage({ user }) {
  const [team, setTeam] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [view, setView] = useState("grid");

  useEffect(() => {
    let cancelled = false;
    getMyTeams(user._id).then(async (teams) => {
      const t = teams[0] || null;
      if (cancelled) return;
      setTeam(t);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [user._id]);

  useEffect(() => {
    if (!team) return;
    const rangeStart = new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1);
    const rangeEnd = new Date(cursor.getFullYear(), cursor.getMonth() + 2, 0);
    getCalendarEvents(team._id, rangeStart, rangeEnd).then(setEvents);
  }, [team, cursor]);

  if (loading) return <PageLoading />;
  if (!team) {
    return <EmptyState icon={CalendarDays} title="Aucune équipe" description="Créez une équipe pour voir son calendrier." />;
  }

  const monthStart = startOfMonth(cursor);
  const firstWeekday = (monthStart.getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));

  const eventsForDay = (day) => day && events.filter((e) => sameDay(new Date(e.dueDate), day));
  const selectedEvents = eventsForDay(selectedDay) || [];

  const next30 = events
    .filter((e) => {
      const diff = (new Date(e.dueDate) - new Date()) / 86400000;
      return diff >= -1 && diff <= 30;
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  return (
    <div className="mx-auto max-w-6xl px-5 py-6 md:px-8 md:py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink">Calendrier d'équipe</h2>
          <p className="mt-1 text-sm text-slate-500">Échéances des tâches de {team.name}.</p>
        </div>
        <div className="inline-flex rounded-xl bg-slate-100 p-1">
          <button
            onClick={() => setView("grid")}
            className={`focus-ring flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium ${view === "grid" ? "bg-white text-ink shadow-card" : "text-slate-500"}`}
          >
            <LayoutGrid size={14} /> Vue mois
          </button>
          <button
            onClick={() => setView("list")}
            className={`focus-ring flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium ${view === "list" ? "bg-white text-ink shadow-card" : "text-slate-500"}`}
          >
            <List size={14} /> Vue liste (30 j)
          </button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="card col-span-1 p-4 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between px-1">
              <button onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))} className="focus-ring rounded-lg p-1.5 hover:bg-slate-100">
                <ChevronLeft size={18} />
              </button>
              <h3 className="font-display text-sm font-semibold capitalize text-ink">
                {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
              </h3>
              <button onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))} className="focus-ring rounded-lg p-1.5 hover:bg-slate-100">
                <ChevronRight size={18} />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 px-1 pb-2 text-center text-[11px] font-medium text-slate-400">
              {WEEKDAYS.map((w) => <span key={w}>{w}</span>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, i) => {
                const dayEvents = eventsForDay(day) || [];
                const isSelected = day && sameDay(day, selectedDay);
                const isToday = day && sameDay(day, new Date());
                return (
                  <button
                    key={i} disabled={!day} onClick={() => day && setSelectedDay(day)}
                    className={`focus-ring flex aspect-square flex-col items-center justify-start rounded-lg p-1.5 text-xs transition-colors ${
                      !day ? "invisible" : isSelected ? "bg-brand-500 text-white" : isToday ? "bg-brand-50 text-brand-600" : "text-ink hover:bg-slate-100"
                    }`}
                  >
                    <span className="font-medium">{day?.getDate()}</span>
                    {dayEvents.length > 0 && (
                      <span className="mt-1 flex gap-0.5">
                        {dayEvents.slice(0, 3).map((e) => (
                          <span key={e._id} className={`h-1.5 w-1.5 rounded-full ${isSelected ? "bg-white" : "bg-coral-400"}`} />
                        ))}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="card col-span-1 p-5">
            <h3 className="mb-1 font-display text-sm font-semibold text-ink">{formatDate(selectedDay)}</h3>
            <p className="mb-4 text-xs text-slate-400">{selectedEvents.length} tâche(s) due(s) ce jour</p>
            {selectedEvents.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">Aucune échéance ce jour-là.</p>
            ) : (
              <ul className="space-y-3">
                {selectedEvents.map((t) => (
                  <li key={t._id} className="rounded-xl border border-slate-100 p-3">
                    <p className="mb-1.5 text-sm font-medium text-ink">{t.title}</p>
                    <div className="flex items-center justify-between">
                      <StatusPill status={t.status} />
                      <AvatarStack users={t.assigneeUsers} max={3} size={20} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : (
        <div className="card divide-y divide-slate-100">
          {next30.length === 0 ? (
            <EmptyState icon={CalendarDays} title="Aucune échéance à venir" description="Les 30 prochains jours sont libres." />
          ) : (
            next30.map((t) => (
              <div key={t._id} className="flex items-center gap-4 px-5 py-3.5">
                <div className="w-20 shrink-0 text-xs font-medium text-slate-500">{formatDate(t.dueDate)}</div>
                <p className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{t.title}</p>
                <PriorityPill priority={t.priority} />
                <StatusPill status={t.status} />
                <AvatarStack users={t.assigneeUsers} max={3} size={20} />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
