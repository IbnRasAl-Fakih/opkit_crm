import { useMemo, useState } from 'react';

import { AppFooter } from '../../components/AppFooter';
import { LoupeIcon } from '../../icons';
import { Task, TaskStatus } from '../../types/task';
import { UserOption } from '../../types/user';
import { CreateTaskModal } from './components/CreateTaskModal';
import { TaskFilterDropdown } from './components/TaskFilterDropdown';
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

type StatusFilter = 'ALL' | TaskStatus;
type AssigneeFilter = 'ALL' | 'UNASSIGNED' | string;

const statusOrder: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];
const statusFilterOptions = [
  { value: 'ALL', label: 'Все статусы' },
  { value: 'TODO', label: 'К выполнению' },
  { value: 'IN_PROGRESS', label: 'В работе' },
  { value: 'DONE', label: 'Готово' },
];

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
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [assigneeFilter, setAssigneeFilter] = useState<AssigneeFilter>('ALL');

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch =
        !query ||
        `${task.title} ${task.description || ''}`.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === 'ALL' || task.status === statusFilter;
      const matchesAssignee =
        assigneeFilter === 'ALL' ||
        (assigneeFilter === 'UNASSIGNED'
          ? !task.userId
          : task.userId === assigneeFilter);

      return matchesSearch && matchesStatus && matchesAssignee;
    });
  }, [assigneeFilter, search, statusFilter, tasks]);

  const groupedTasks = useMemo(
    () =>
      statusOrder.map((status) => ({
        status,
        tasks: filteredTasks.filter((task) => task.status === status),
      })),
    [filteredTasks],
  );

  const activeFiltersCount = useMemo(() => {
    let count = 0;

    if (search.trim()) {
      count += 1;
    }

    if (statusFilter !== 'ALL') {
      count += 1;
    }

    if (assigneeFilter !== 'ALL') {
      count += 1;
    }

    return count;
  }, [assigneeFilter, search, statusFilter]);

  const assigneeFilterOptions = useMemo(
    () => [
      { value: 'ALL', label: 'Все исполнители' },
      { value: 'UNASSIGNED', label: 'Без исполнителя' },
      ...users.map((user) => ({
        value: user.id,
        label: user.email,
      })),
    ],
    [users],
  );

  const handleCreateTask = async (payload: {
    title: string;
    description: string;
    assigneeId: string;
  }) => {
    await onCreateTask(payload);
    setModalOpen(false);
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('ALL');
    setAssigneeFilter('ALL');
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
                view={view}
                onViewChange={setView}
                email={email}
                onOpenCreate={() => setModalOpen(true)}
                sidebarCollapsed={sidebarCollapsed}
                onOpenSidebar={() => setSidebarCollapsed(false)}
              />

              <main className="flex-1 px-5 py-6 sm:px-6 lg:px-8">
                <div className="mb-6 flex flex-col gap-4">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <h1 className="shrink-0 text-4xl font-extrabold tracking-[-0.06em] text-[var(--color-ink-800)]">
                      Управление задачами
                    </h1>

                    <div className="flex items-center gap-3">
                      <div className="h-11 shrink-0 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold leading-[42px] text-slate-600">
                        {`Всего задач: ${filteredTasks.length}`}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
                    <div className="relative w-full xl:max-w-[320px]">
                      <input
                        className="h-11 w-full rounded-full border border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f8fbff)] pl-11 pr-4 text-sm font-medium text-slate-700 outline-none shadow-[0_14px_34px_rgba(15,23,42,0.06)] transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100/80"
                        placeholder="Поиск задач..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                      />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <LoupeIcon className="h-4 w-4 opacity-60" />
                      </span>
                    </div>

                    <TaskFilterDropdown
                      label="Статус"
                      value={statusFilter}
                      options={statusFilterOptions}
                      onChange={(value) => setStatusFilter(value as StatusFilter)}
                      className="w-full xl:w-[240px]"
                    />
                    <TaskFilterDropdown
                      label="Исполнитель"
                      value={assigneeFilter}
                      options={assigneeFilterOptions}
                      onChange={(value) => setAssigneeFilter(value as AssigneeFilter)}
                      className="w-full xl:w-[260px]"
                    />
                    {activeFiltersCount > 0 && (
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="h-11 shrink-0 rounded-full border border-slate-200 bg-white px-5 text-sm font-bold text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
                      >
                        Сбросить фильтры
                      </button>
                    )}
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
