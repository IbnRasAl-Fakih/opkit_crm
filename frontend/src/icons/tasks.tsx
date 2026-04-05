type IconProps = {
  className?: string;
};

export function TasksIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M9 5H19M9 12H19M9 19H19M5 5H5.01M5 12H5.01M5 19H5.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
