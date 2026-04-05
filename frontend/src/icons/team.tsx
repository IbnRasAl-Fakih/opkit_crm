type IconProps = {
  className?: string;
};

export function TeamIcon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M16 21V19C16 17.3431 14.6569 16 13 16H11C9.34315 16 8 17.3431 8 19V21M19 21V19.5C19 18.1193 18.0596 16.9589 16.7857 16.6248M5 21V19.5C5 18.1193 5.94038 16.9589 7.21429 16.6248M15 7C15 8.65685 13.6569 10 12 10C10.3431 10 9 8.65685 9 7C9 5.34315 10.3431 4 12 4C13.6569 4 15 5.34315 15 7ZM19 8C19 9.10457 18.1046 10 17 10C15.8954 10 15 9.10457 15 8C15 6.89543 15.8954 6 17 6C18.1046 6 19 6.89543 19 8ZM9 8C9 9.10457 8.10457 10 7 10C5.89543 10 5 9.10457 5 8C5 6.89543 5.89543 6 7 6C8.10457 6 9 6.89543 9 8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
