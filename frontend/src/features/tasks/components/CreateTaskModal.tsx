import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';

import { CloseIcon, DropdownOpenIcon } from '../../../icons';
import { UserOption } from '../../../types/user';

type CreateTaskModalProps = {
  open: boolean;
  pending: boolean;
  users: UserOption[];
  onClose: () => void;
  onSubmit: (payload: {
    title: string;
    description: string;
    assigneeId: string;
  }) => Promise<void>;
};

export function CreateTaskModal({
  open,
  pending,
  users,
  onClose,
  onSubmit,
}: CreateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [assigneeMenuOpen, setAssigneeMenuOpen] = useState(false);
  const assigneeMenuRef = useRef<HTMLDivElement | null>(null);

  const selectedAssignee = useMemo(() => {
    const fallbackId = assigneeId || users[0]?.id || '';
    return users.find((user) => user.id === fallbackId) || null;
  }, [assigneeId, users]);

  useEffect(() => {
    if (!assigneeMenuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!assigneeMenuRef.current?.contains(event.target as Node)) {
        setAssigneeMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [assigneeMenuOpen]);

  if (!open) {
    return null;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedAssignee) {
      return;
    }

    await onSubmit({
      title,
      description,
      assigneeId: selectedAssignee.id,
    });

    setTitle('');
    setDescription('');
    setAssigneeId(users[0]?.id || '');
    setAssigneeMenuOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(15,23,42,0.28)] px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[28px] bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.25)] sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-[-0.05em] text-[var(--color-ink-800)]">
              Создание новой задачи
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Закрыть"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
              Название задачи
            </span>
            <input
              className="h-14 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-slate-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
              placeholder="Например: Разработка макета"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
              Описание
            </span>
            <textarea
              className="min-h-36 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
              placeholder="Опишите детали задачи..."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </label>

          <div className="flex flex-col gap-2" ref={assigneeMenuRef}>
            <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
              Исполнитель
            </span>

            <button
              type="button"
              onClick={() => users.length > 0 && setAssigneeMenuOpen((current) => !current)}
              className={`flex h-14 items-center justify-between rounded-2xl border px-4 text-left text-slate-800 outline-none transition ${
                assigneeMenuOpen
                  ? 'border-blue-300 bg-white ring-4 ring-blue-100'
                  : 'border-slate-200 bg-slate-50 hover:bg-white'
              } ${users.length === 0 ? 'cursor-not-allowed text-slate-400' : ''}`}
            >
              <span className="truncate">
                {selectedAssignee?.email || 'Нет доступных пользователей'}
              </span>
              <span
                className={`ml-4 text-slate-500 transition ${assigneeMenuOpen ? 'rotate-180' : ''}`}
              >
                <DropdownOpenIcon className="h-4 w-4" />
              </span>
            </button>

            {assigneeMenuOpen && users.length > 0 && (
              <div className="relative z-20 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
                <div className="max-h-56 overflow-y-auto py-2">
                  {users.map((user) => {
                    const isActive = selectedAssignee?.id === user.id;

                    return (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => {
                          setAssigneeId(user.id);
                          setAssigneeMenuOpen(false);
                        }}
                        className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition ${
                          isActive
                            ? 'bg-blue-50 font-semibold text-[var(--color-ink-800)]'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <span className="truncate">{user.email}</span>
                        {isActive && <span className="ml-4 text-blue-700">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl bg-slate-100 px-6 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-200"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={pending || !selectedAssignee}
              className="rounded-2xl bg-[linear-gradient(180deg,#123b79,#0c2b58)] px-6 py-3 text-sm font-extrabold text-white shadow-[0_16px_34px_rgba(12,43,88,0.24)] transition hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-70"
            >
              {pending ? 'Создаем...' : 'Создать задачу'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
