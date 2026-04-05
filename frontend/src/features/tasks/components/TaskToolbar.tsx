type TaskToolbarProps = {
  view: 'kanban' | 'list';
  onViewChange: (view: 'kanban' | 'list') => void;
  email: string;
  onOpenCreate: () => void;
  sidebarCollapsed: boolean;
  onOpenSidebar: () => void;
};

export function TaskToolbar({
  view,
  onViewChange,
  email,
  onOpenCreate,
}: TaskToolbarProps) {
  return (
    <div className="border-b border-slate-200/80 bg-white px-6 py-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-5 self-start xl:self-auto">
          <button
            type="button"
            onClick={() => onViewChange('kanban')}
            className={`border-b-2 px-1 pb-2 text-sm font-bold transition ${
              view === 'kanban'
                ? 'border-blue-700 text-[var(--color-ink-800)]'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Канбан
          </button>
          <button
            type="button"
            onClick={() => onViewChange('list')}
            className={`border-b-2 px-1 pb-2 text-sm font-bold transition ${
              view === 'list'
                ? 'border-blue-700 text-[var(--color-ink-800)]'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Список
          </button>
        </div>

        <div className="flex items-center gap-3 self-start xl:self-auto">
          <div className="hidden items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-600 sm:flex">
            <span className="h-8 w-8 rounded-full bg-[var(--color-ink-800)] text-center leading-8 text-white">
              {email.slice(0, 1).toUpperCase()}
            </span>
            <span>{email}</span>
          </div>
          <button
            type="button"
            onClick={onOpenCreate}
            className="rounded-full bg-[linear-gradient(180deg,#123b79,#0c2b58)] px-5 py-3 text-sm font-extrabold text-white shadow-[0_16px_34px_rgba(12,43,88,0.18)]"
          >
            Создать задачу
          </button>
        </div>
      </div>
    </div>
  );
}
