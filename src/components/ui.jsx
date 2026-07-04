export const STATUS_META = {
  todo: { label: "À faire", dot: "bg-slate-400", bg: "bg-slate-100", text: "text-slate-600" },
  in_progress: { label: "En cours", dot: "bg-brand-500", bg: "bg-brand-50", text: "text-brand-700" },
  done: { label: "Terminé", dot: "bg-teal-500", bg: "bg-teal-50", text: "text-teal-500" },
};

export const PRIORITY_META = {
  low: { label: "Basse", bg: "bg-slate-100", text: "text-slate-500" },
  medium: { label: "Moyenne", bg: "bg-gold-400/15", text: "text-gold-500" },
  high: { label: "Élevée", bg: "bg-coral-400/15", text: "text-coral-500" },
};

export function StatusPill({ status }) {
  const m = STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${m.bg} ${m.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
}

export function PriorityPill({ priority }) {
  const m = PRIORITY_META[priority];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${m.bg} ${m.text}`}>
      {m.label}
    </span>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      {Icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
          <Icon size={26} strokeWidth={1.75} />
        </div>
      )}
      <h3 className="font-display text-base font-semibold text-ink">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-brand-500" />
    </div>
  );
}

export function relativeTime(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "à l'instant";
  if (mins < 60) return `il y a ${mins} min`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.round(hours / 24);
  if (days < 7) return `il y a ${days} j`;
  return new Date(iso).toLocaleDateString("fr-CA", { day: "numeric", month: "short" });
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString("fr-CA", { day: "numeric", month: "short", year: "numeric" });
}

export function formatDateShort(iso) {
  return new Date(iso).toLocaleDateString("fr-CA", { day: "numeric", month: "short" });
}
