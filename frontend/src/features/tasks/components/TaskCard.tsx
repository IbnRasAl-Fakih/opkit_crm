import { Task, TaskStatus } from '../../../types/task';

type TaskCardProps = {
  task: Task;
  assigneeLabel: string;
  pending: boolean;
  draggable?: boolean;
  dragging?: boolean;
  onDeleteTask: (taskId: string) => void;
  onUpdateStatus: (taskId: string, status: TaskStatus) => void;
  onDragStart?: (taskId: string) => void;
  onDragEnd?: () => void;
};

const taskToneLabel: Record<TaskStatus, string> = {
  TODO: 'Разработка',
  IN_PROGRESS: 'В работе',
  DONE: 'Готово',
};

export function TaskCard({
  task,
  assigneeLabel,
  pending,
  draggable = false,
  dragging = false,
  onDeleteTask,
  onUpdateStatus,
  onDragStart,
  onDragEnd,
}: TaskCardProps) {
  return (
    <article
      draggable={draggable && !pending}
      onDragStart={(event) => {
        if (!draggable || pending) {
          return;
        }

        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', task.id);
        onDragStart?.(task.id);
      }}
      onDragEnd={() => onDragEnd?.()}
      className={`rounded-[22px] bg-white p-4 shadow-[0_12px_34px_rgba(15,23,42,0.06)] transition ${
        dragging ? 'cursor-grabbing opacity-60' : draggable ? 'cursor-grab' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-500">
          {taskToneLabel[task.status]}
        </span>
        <button
          type="button"
          onClick={() => onDeleteTask(task.id)}
          disabled={pending}
          className="text-xs font-bold text-rose-500 disabled:opacity-60"
        >
          Удалить
        </button>
      </div>

      <h4 className="mt-4 text-lg font-extrabold leading-6 tracking-[-0.03em] text-slate-800">
        {task.title}
      </h4>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
        {task.description || 'Описание пока не добавлено.'}
      </p>

      <div className="mt-4 flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-3">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--color-ink-800)] text-xs font-extrabold text-white">
          {assigneeLabel.slice(0, 1).toUpperCase()}
        </span>
        <div className="min-w-0">
          <div className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
            Исполнитель
          </div>
          <div className="truncate text-sm font-semibold text-slate-700">
            {assigneeLabel}
          </div>
        </div>
      </div>
    </article>
  );
}
