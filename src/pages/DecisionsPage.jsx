import { useEffect, useState } from "react";
import { ScrollText, Plus } from "lucide-react";
import { getMyTeams, getDecisions, createDecision } from "../lib/data";
import Avatar from "../components/Avatar";
import { EmptyState, PageLoading, relativeTime } from "../components/ui";

export default function DecisionsPage({ user }) {
  const [team, setTeam] = useState(null);
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getMyTeams(user._id).then(async (teams) => {
      const t = teams[0] || null;
      if (cancelled) return;
      setTeam(t);
      if (t) setDecisions(await getDecisions(t._id));
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [user._id]);

  if (loading) return <PageLoading />;
  if (!team) {
    return <EmptyState icon={ScrollText} title="Aucune équipe" description="Créez une équipe pour consigner vos décisions." />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await createDecision(team._id, { title, description, loggedBy: user._id });
      setDecisions(await getDecisions(team._id));
      setTitle(""); setDescription(""); setOpen(false); setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-6 md:px-8 md:py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink">Registre des décisions</h2>
          <p className="mt-1 text-sm text-slate-500">L'historique des choix importants de {team.name}.</p>
        </div>
        <button onClick={() => setOpen((v) => !v)} className="btn-primary">
          <Plus size={16} /> Consigner
        </button>
      </div>

      {open && (
        <form onSubmit={handleSubmit} className="card mb-5 space-y-3 p-5">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-slate-600">Titre de la décision</span>
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex. Report de la démonstration au 13 juillet" autoFocus />
            {error && <span className="mt-1 block text-xs text-coral-500">{error}</span>}
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-slate-600">Détails (optionnel)</span>
            <textarea className="input min-h-16 resize-none" value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>Annuler</button>
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? "Enregistrement…" : "Enregistrer"}</button>
          </div>
        </form>
      )}

      {decisions.length === 0 ? (
        <EmptyState icon={ScrollText} title="Aucune décision consignée" description="Les décisions importantes prises en réunion apparaîtront ici." />
      ) : (
        <ol className="relative space-y-5 border-l-2 border-slate-200 pl-6">
          {decisions.map((d) => (
            <li key={d._id} className="relative">
              <span className="absolute -left-[1.72rem] top-1 h-3 w-3 rounded-full border-2 border-white bg-brand-500" />
              <div className="card p-4">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-ink">{d.title}</p>
                  <span className="shrink-0 text-xs text-slate-400">{relativeTime(d.createdAt)}</span>
                </div>
                {d.description && <p className="mb-2.5 text-sm text-slate-500">{d.description}</p>}
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Avatar user={d.loggedByUser} size={18} />
                  Consignée par {d.loggedByUser.name}
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
