import { useState } from 'react';

import { PasswordHideIcon, PasswordShowIcon } from '../../../icons';

type AuthFieldProps = {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export function AuthField({
  label,
  type,
  placeholder,
  value,
  onChange,
  error,
}: AuthFieldProps) {
  const isPasswordField = type === 'password';
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <label className="flex flex-col gap-2">
      <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </span>

      <div className="relative">
        <input
          className={`h-14 rounded-2xl border text-slate-800 outline-none transition focus:bg-white focus:ring-4 ${
            error
              ? 'border-rose-300 bg-rose-50/40 focus:border-rose-300 focus:ring-rose-100'
              : 'border-slate-200 bg-slate-50 focus:border-blue-300 focus:ring-blue-100'
          } ${isPasswordField ? 'w-full pl-4 pr-14' : 'w-full px-4'}`}
          type={isPasswordField && passwordVisible ? 'text' : type}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />

        {isPasswordField && (
          <button
            type="button"
            onClick={() => setPasswordVisible((current) => !current)}
            className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label={passwordVisible ? 'Скрыть пароль' : 'Показать пароль'}
          >
            {passwordVisible ? (
              <PasswordHideIcon className="h-4 w-4" />
            ) : (
              <PasswordShowIcon className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {error && <span className="text-sm text-rose-600">{error}</span>}
    </label>
  );
}
