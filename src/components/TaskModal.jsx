import { useState } from "react";
import { X } from "lucide-react";
import Avatar from "./Avatar";

const PRIORITIES = [
  ["low", "Basse"],
  ["medium", "Moyenne"],
  ["high", "Élevée"],
];

export default function TaskModal({ team, currentUserId, busy, onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assignees, setAssignees] = useState([currentUserId]);
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState(null);

  function toggleAssignee(userId) {
    setAssignees((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await onCreate({ title, description, priority, assignees, dueDate: dueDate ? new Date(dueDate).toISOString() : null });
    } catch (err) {
      setError({ field: err.field, message: err.message });
    }
  }

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-ink/40 p-0 backdrop-blur-[2px] md:items-center md:p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-6 shadow-pop md:rounded-xl2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-ink">Nouvelle tâche</h3>
          <button onClick={onClose} className="focus-ring rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-slate-600">Titre</span>
            <input
              className="input" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex. Rédiger le rapport final" autoFocus
            />
            {error?.field === "title" && <span className="mt-1 block text-xs text-coral-500">{error.message}</span>}
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-slate-600">Description (optionnel)</span>
            <textarea
              className="input min-h-20 resize-none" value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Détails, contexte, livrables attendus…"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-slate-600">Priorité</span>
              <select className="input" value={priority} onChange={(e) => setPriority(e.target.value)}>
                {PRIORITIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-slate-600">Échéance</span>
              <input
                type="date" className="input" value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={new Date().toISOString().slice(0, 10)}
              />
              {error?.field === "dueDate" && <span className="mt-1 block text-xs text-coral-500">{error.message}</span>}
            </label>
          </div>

          <div>
            <span className="mb-1.5 block text-xs font-medium text-slate-600">Assigné à</span>
            <div className="flex flex-wrap gap-2">
              {team.members.map((m) => {
                const active = assignees.includes(m.userId);
                return (
                  <button
                    type="button" key={m.userId} onClick={() => toggleAssignee(m.userId)}
                    className={`focus-ring flex items-center gap-2 rounded-full border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                      active ? "border-brand-400 bg-brand-50 text-brand-700" : "border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    <Avatar user={m.user} size={18} />
                    {m.user.name.split(" ")[0]}
                  </button>
                );
              })}
            </div>
            {error?.field === "assignees" && <span className="mt-1.5 block text-xs text-coral-500">{error.message}</span>}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">Annuler</button>
            <button type="submit" className="btn-primary" disabled={busy}>{busy ? "Création…" : "Créer la tâche"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
