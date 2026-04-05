type IconProps = {
  className?: string;
};

export function ReportIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M6 3H14L18 7V20H6V3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M14 3V7H18" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 16V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M15 16V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
