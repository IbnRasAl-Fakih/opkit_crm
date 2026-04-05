import { Task, TaskStatus } from '../../../types/task';
import { UserOption } from '../../../types/user';

type TaskListViewProps = {
  groups: Array<{ status: TaskStatus; tasks: Task[] }>;
  pendingTaskId: string | null;
  users: UserOption[];
  onDeleteTask: (taskId: string) => void;
  onUpdateStatus: (taskId: string, status: TaskStatus) => void;
};

const sectionTitles: Record<TaskStatus, string> = {
  TODO: 'К выполнению',
  IN_PROGRESS: 'В работе',
  DONE: 'Готово',
};

const dotColor: Record<TaskStatus, string> = {
  TODO: 'bg-blue-500',
  IN_PROGRESS: 'bg-amber-500',
  DONE: 'bg-emerald-500',
};

export function TaskListView({
  groups,
  pendingTaskId,
  users,
  onDeleteTask,
  onUpdateStatus,
}: TaskListViewProps) {
  const userLabelById = new Map(users.map((user) => [user.id, user.email]));

  return (
    <div className="space-y-8 pr-4 sm:pr-6 lg:pr-8">
      {groups.map((group) => (
        <section key={group.status}>
          <div className="mb-4 flex items-center gap-3 px-1">
            <span className={`h-2.5 w-2.5 rounded-full ${dotColor[group.status]}`} />
            <h3 className="text-2xl font-extrabold tracking-[-0.04em] text-slate-800">
              {sectionTitles[group.status]}
            </h3>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">
              {group.tasks.length}
            </span>
          </div>

          <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white">
            <div className="grid grid-cols-[minmax(0,1.6fr)_minmax(240px,1fr)_auto] items-center gap-6 border-b border-slate-100 bg-slate-50 px-8 py-5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
              <span>Название задачи</span>
              <span>Исполнитель</span>
              <span className="text-right">Действия</span>
            </div>

            {group.tasks.length === 0 ? (
              <div className="px-8 py-10 text-sm text-slate-400">
                Нет задач в этом разделе.
              </div>
            ) : (
              group.tasks.map((task) => {
                const assigneeLabel =
                  (task.userId && userLabelById.get(task.userId)) || 'Не назначен';

                return (
                  <div
                    key={task.id}
                    className="grid grid-cols-[minmax(0,1.6fr)_minmax(240px,1fr)_auto] items-center gap-6 border-b border-slate-100 px-8 py-6 last:border-b-0"
                  >
                    <div className="min-w-0 pr-4">
                      <div className="text-lg font-bold text-slate-800">{task.title}</div>
                      <div className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">
                        {task.description || 'Без дополнительного описания'}
                      </div>
                    </div>

                    <div className="min-w-0 self-center text-sm font-semibold text-slate-600">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-xs font-extrabold text-[var(--color-ink-800)]">
                          {assigneeLabel.slice(0, 1).toUpperCase()}
                        </span>
                        <span className="truncate">{assigneeLabel}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 self-center pl-4">
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateStatus(
                            task.id,
                            task.status === 'TODO'
                              ? 'IN_PROGRESS'
                              : task.status === 'IN_PROGRESS'
                                ? 'DONE'
                                : 'TODO',
                          )
                        }
                        disabled={pendingTaskId === task.id}
                        className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 disabled:opacity-60"
                      >
                        Сменить
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteTask(task.id)}
                        disabled={pendingTaskId === task.id}
                        className="rounded-full bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 disabled:opacity-60"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
