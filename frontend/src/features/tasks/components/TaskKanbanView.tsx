import { useState } from 'react';

import { DropdownOpenIcon } from '../../../icons';
import { Task, TaskStatus } from '../../../types/task';
import { UserOption } from '../../../types/user';
import { TaskCard } from './TaskCard';

type TaskKanbanViewProps = {
  groups: Array<{ status: TaskStatus; tasks: Task[] }>;
  users: UserOption[];
  pendingTaskId: string | null;
  onDeleteTask: (taskId: string) => void;
  onUpdateStatus: (taskId: string, status: TaskStatus) => void;
};

const statusLabels: Record<TaskStatus, string> = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN PROGRESS',
  DONE: 'DONE',
};

const statusStyles: Record<TaskStatus, string> = {
  TODO: 'border-blue-100 bg-blue-50/40',
  IN_PROGRESS: 'border-amber-100 bg-amber-50/40',
  DONE: 'border-emerald-100 bg-emerald-50/40',
};

const accentStyles: Record<TaskStatus, string> = {
  TODO: 'bg-blue-500',
  IN_PROGRESS: 'bg-amber-500',
  DONE: 'bg-emerald-500',
};

export function TaskKanbanView({
  groups,
  users,
  pendingTaskId,
  onDeleteTask,
  onUpdateStatus,
}: TaskKanbanViewProps) {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<TaskStatus | null>(null);
  const userLabelById = new Map(users.map((user) => [user.id, user.email]));

  const handleDrop = (nextStatus: TaskStatus) => {
    if (!draggedTaskId || pendingTaskId === draggedTaskId) {
      setDragOverStatus(null);
      return;
    }

    const draggedTask = groups
      .flatMap((group) => group.tasks)
      .find((task) => task.id === draggedTaskId);

    if (!draggedTask || draggedTask.status === nextStatus) {
      setDraggedTaskId(null);
      setDragOverStatus(null);
      return;
    }

    void onUpdateStatus(draggedTaskId, nextStatus);
    setDraggedTaskId(null);
    setDragOverStatus(null);
  };

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {groups.map((group) => (
        <section
          key={group.status}
          onDragOver={(event) => {
            event.preventDefault();
            if (pendingTaskId === draggedTaskId) {
              return;
            }
            setDragOverStatus(group.status);
          }}
          onDragLeave={() => {
            if (dragOverStatus === group.status) {
              setDragOverStatus(null);
            }
          }}
          onDrop={(event) => {
            event.preventDefault();
            handleDrop(group.status);
          }}
          className={`rounded-[28px] border p-4 transition ${
            statusStyles[group.status]
          } ${
            dragOverStatus === group.status
              ? 'ring-2 ring-[var(--color-ink-700)] ring-offset-2 ring-offset-transparent'
              : ''
          }`}
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`h-2.5 w-2.5 rounded-full ${accentStyles[group.status]}`} />
              <h3 className="text-sm font-extrabold tracking-[0.14em] text-slate-700">
                {statusLabels[group.status]}
              </h3>
              <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-slate-400">
                {group.tasks.length}
              </span>
            </div>
            <button className="text-slate-300" type="button" aria-label="More">
              <DropdownOpenIcon className="h-4 w-4 -rotate-90" />
            </button>
          </div>

          <div className="flex min-h-[560px] flex-col gap-4">
            {group.tasks.length === 0 && (
              <div className="rounded-[22px] border border-dashed border-slate-200 bg-white/80 px-4 py-8 text-sm text-slate-400">
                Пока без задач
              </div>
            )}

            {group.tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                assigneeLabel={(task.userId && userLabelById.get(task.userId)) || 'Не назначен'}
                pending={pendingTaskId === task.id}
                draggable
                dragging={draggedTaskId === task.id}
                onDragStart={(taskId) => setDraggedTaskId(taskId)}
                onDragEnd={() => {
                  setDraggedTaskId(null);
                  setDragOverStatus(null);
                }}
                onDeleteTask={onDeleteTask}
                onUpdateStatus={onUpdateStatus}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
