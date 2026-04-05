import { useMemo, useState } from 'react';

import { AppFooter } from '../../components/AppFooter';
import { Task, TaskStatus } from '../../types/task';
import { UserOption } from '../../types/user';
import { CreateTaskModal } from './components/CreateTaskModal';
import { TaskKanbanView } from './components/TaskKanbanView';
import { TaskListView } from './components/TaskListView';
import { TaskSidebar } from './components/TaskSidebar';
import { TaskToolbar } from './components/TaskToolbar';

type TasksPageProps = {
  tasks: Task[];
  email: string;
  users: UserOption[];
  onCreateTask: (payload: {
    title: string;
    description: string;
    assigneeId: string;
  }) => Promise<void>;
  onUpdateStatus: (taskId: string, status: TaskStatus) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  onLogout: () => void;
  pendingTaskId: string | null;
  globalPending: boolean;
};

const statusOrder: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];

export function TasksPage({
  tasks,
  email,
  users,
  onCreateTask,
  onUpdateStatus,
  onDeleteTask,
  onLogout,
  pendingTaskId,
  globalPending,
}: TasksPageProps) {
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return tasks;
    }

    return tasks.filter((task) => {
      const haystack = `${task.title} ${task.description || ''}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [search, tasks]);

  const groupedTasks = useMemo(
    () =>
      statusOrder.map((status) => ({
        status,
        tasks: filteredTasks.filter((task) => task.status === status),
      })),
    [filteredTasks],
  );

  const handleCreateTask = async (payload: {
    title: string;
    description: string;
    assigneeId: string;
  }) => {
    await onCreateTask(payload);
    setModalOpen(false);
  };

  return (
    <>
      <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#edf3fb_100%)]">
        <div className="flex min-h-screen flex-col">
          <div
            className={`grid flex-1 overflow-hidden bg-[linear-gradient(180deg,#ffffff,#f8fbfe)] ${
              sidebarCollapsed ? 'lg:grid-cols-[92px_1fr]' : 'lg:grid-cols-[260px_1fr]'
            }`}
          >
            <TaskSidebar
              collapsed={sidebarCollapsed}
              onToggle={() => setSidebarCollapsed((current) => !current)}
              onCreateTask={() => setModalOpen(true)}
              onLogout={onLogout}
            />

            <div className="flex min-w-0 flex-col">
              <TaskToolbar
                search={search}
                onSearchChange={setSearch}
                view={view}
                onViewChange={setView}
                email={email}
                onOpenCreate={() => setModalOpen(true)}
                sidebarCollapsed={sidebarCollapsed}
                onOpenSidebar={() => setSidebarCollapsed(false)}
              />

              <main className="flex-1 px-5 py-6 sm:px-6 lg:px-8">
                <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h1 className="text-4xl font-extrabold tracking-[-0.06em] text-[var(--color-ink-800)]">
                      Управление задачами
                    </h1>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600"
                    >
                      Фильтр
                    </button>
                  </div>
                </div>

                {view === 'kanban' ? (
                  <TaskKanbanView
                    groups={groupedTasks}
                    users={users}
                    pendingTaskId={pendingTaskId}
                    onDeleteTask={onDeleteTask}
                    onUpdateStatus={onUpdateStatus}
                  />
                ) : (
                  <TaskListView
                    groups={groupedTasks}
                    pendingTaskId={pendingTaskId}
                    users={users}
                    onDeleteTask={onDeleteTask}
                    onUpdateStatus={onUpdateStatus}
                  />
                )}
              </main>
            </div>
          </div>

          <AppFooter className="border-t border-slate-200/80 bg-white px-4 py-4 sm:px-6" />
        </div>
      </div>

      <CreateTaskModal
        open={modalOpen}
        pending={globalPending}
        users={users}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateTask}
      />
    </>
  );
}
