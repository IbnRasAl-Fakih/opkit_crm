type AuthFieldProps = {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

export function AuthField({
  label,
  type,
  placeholder,
  value,
  onChange,
}: AuthFieldProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </span>
      <input
        className="h-14 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-slate-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

