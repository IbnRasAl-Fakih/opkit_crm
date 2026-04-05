import { useEffect, useMemo, useRef, useState } from 'react';

import { DropdownOpenIcon } from '../../../icons';

type DropdownOption = {
  value: string;
  label: string;
};

type TaskFilterDropdownProps = {
  label: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  className?: string;
};

export function TaskFilterDropdown({
  label,
  value,
  options,
  onChange,
  className = '',
}: TaskFilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) ?? options[0],
    [options, value],
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`group flex h-11 w-full items-center justify-between gap-3 rounded-full border px-4 text-left transition ${
          open
            ? 'border-blue-300 bg-white shadow-[0_18px_50px_rgba(37,99,235,0.16)] ring-4 ring-blue-100/80'
            : 'border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f8fbff)] shadow-[0_14px_34px_rgba(15,23,42,0.06)] hover:border-slate-300 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]'
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="min-w-0">
          <span className="mb-0.5 block text-[9px] font-black uppercase tracking-[0.22em] text-slate-400">
            {label}
          </span>
          <span className="block truncate text-sm font-bold leading-4 text-[var(--color-ink-800)]">
            {selectedOption?.label}
          </span>
        </span>
        <span
          className={`shrink-0 rounded-full bg-slate-100 p-1.5 text-slate-500 transition ${
            open ? 'rotate-180 bg-blue-50 text-blue-700' : 'group-hover:bg-slate-200'
          }`}
        >
          <DropdownOpenIcon className="h-4 w-4" />
        </span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.16)]">
          <div className="max-h-72 overflow-y-auto p-2">
            {options.map((option) => {
              const isActive = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-4 rounded-[16px] px-4 py-2.5 text-left text-sm transition ${
                    isActive
                      ? 'bg-[linear-gradient(180deg,#eaf2ff,#dbeafe)] font-bold text-blue-900'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  role="option"
                  aria-selected={isActive}
                >
                  <span className="truncate">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
