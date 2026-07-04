import { Trash2, Clock3 } from "lucide-react";
import { AvatarStack } from "./Avatar";
import { PriorityPill, formatDateShort } from "./ui";

export default function TaskCard({ task, onDragStart, canDelete, onDelete }) {
  const overdue = task.status !== "done" && new Date(task.dueDate) < new Date(new Date().toDateString());

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task._id)}
      className="group cursor-grab rounded-xl border border-slate-200 bg-white p-3.5 shadow-card transition-shadow hover:shadow-pop active:cursor-grabbing"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className="text-sm font-medium leading-snug text-ink">{task.title}</p>
        {canDelete && (
          <button
            onClick={() => onDelete(task._id)}
            className="focus-ring shrink-0 rounded-md p-1 text-slate-300 opacity-0 transition-opacity hover:bg-coral-400/10 hover:text-coral-500 group-hover:opacity-100"
            aria-label="Supprimer la tâche"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
      {task.description && <p className="mb-3 line-clamp-2 text-xs text-slate-500">{task.description}</p>}
      <div className="flex items-center justify-between gap-2">
        <PriorityPill priority={task.priority} />
        <span className={`flex items-center gap-1 text-[11px] ${overdue ? "font-medium text-coral-500" : "text-slate-400"}`}>
          <Clock3 size={12} /> {formatDateShort(task.dueDate)}
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <AvatarStack users={task.assigneeUsers} max={3} size={22} />
      </div>
    </div>
  );
}
