import { useEffect, useState } from "react";
import { Plus, ListChecks } from "lucide-react";
import { getMyTeams, getTasks, createTask, updateTaskStatus, deleteTask } from "../lib/data";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import { EmptyState, PageLoading } from "../components/ui";

const COLUMNS = [
  { key: "todo", label: "À faire", dot: "bg-slate-400" },
  { key: "in_progress", label: "En cours", dot: "bg-brand-500" },
  { key: "done", label: "Terminé", dot: "bg-teal-500" },
];

export default function TasksPage({ user }) {
  const [team, setTeam] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [dragOverCol, setDragOverCol] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getMyTeams(user._id).then(async (teams) => {
      const t = teams[0] || null;
      if (cancelled) return;
      setTeam(t);
      if (t) setTasks(await getTasks(t._id));
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [user._id]);

  async function refresh() { setTasks(await getTasks(team._id)); }

  async function handleCreate(payload) {
    setBusy(true);
    try {
      await createTask(team._id, { ...payload, createdBy: user._id });
      await refresh();
      setModalOpen(false);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(taskId) {
    try {
      await deleteTask(taskId, user._id, team);
      await refresh();
    } catch (err) {
      alert(err.message);
    }
  }

  function onDragStart(e, taskId) { e.dataTransfer.setData("taskId", taskId); }
  async function onDrop(e, status) {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    setDragOverCol(null);
    // Mise à jour optimiste pour une interaction fluide, confirmée par le serveur ensuite.
    setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, status } : t)));
    try {
      await updateTaskStatus(taskId, status);
    } finally {
      refresh();
    }
  }

  if (loading) return <PageLoading />;

  if (!team) {
    return <EmptyState icon={ListChecks} title="Aucune équipe" description="Créez une équipe pour commencer à ajouter des tâches." />;
  }

  const membership = team.members.find((m) => m.userId === user._id || m.userId?._id === user._id);
  const isScrumMaster = membership?.role === "scrumMaster";

  return (
    <div className="mx-auto max-w-6xl px-5 py-6 md:px-8 md:py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink">Gestion des tâches</h2>
          <p className="mt-1 text-sm text-slate-500">Glissez-déposez une carte pour mettre à jour son statut.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus size={16} /> Nouvelle tâche
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.key);
          return (
            <div
              key={col.key}
              onDragOver={(e) => { e.preventDefault(); setDragOverCol(col.key); }}
              onDragLeave={() => setDragOverCol((c) => (c === col.key ? null : c))}
              onDrop={(e) => onDrop(e, col.key)}
              className={`flex flex-col rounded-xl2 border border-slate-200 bg-slate-100/60 p-3 transition-colors ${dragOverCol === col.key ? "bg-brand-50 ring-2 ring-brand-200" : ""}`}
            >
              <div className="mb-3 flex items-center gap-2 px-1">
                <span className={`h-2 w-2 rounded-full ${col.dot}`} />
                <h3 className="font-display text-sm font-semibold text-ink">{col.label}</h3>
                <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-500">{colTasks.length}</span>
              </div>
              <div className="flex min-h-[120px] flex-col gap-2.5">
                {colTasks.map((task) => (
                  <TaskCard
                    key={task._id} task={task} onDragStart={onDragStart}
                    canDelete={isScrumMaster || task.createdBy === user._id}
                    onDelete={handleDelete}
                  />
                ))}
                {colTasks.length === 0 && (
                  <div className="rounded-xl border border-dashed border-slate-300 p-4 text-center text-xs text-slate-400">
                    Aucune tâche
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {modalOpen && (
        <TaskModal team={team} currentUserId={user._id} busy={busy} onClose={() => setModalOpen(false)} onCreate={handleCreate} />
      )}
    </div>
  );
}
