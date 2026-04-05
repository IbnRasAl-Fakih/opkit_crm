const defaultLinks = [
  'Политика конфиденциальности',
  'Условия использования',
  'Центр помощи',
  'Статус системы',
];

type AppFooterProps = {
  links?: string[];
  className?: string;
};

export function AppFooter({ links = defaultLinks, className = '' }: AppFooterProps) {
  return (
    <footer
      className={`flex flex-col gap-3 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between ${className}`.trim()}
    >
      <span>© 2026 Opkit CRM. Все права защищены.</span>
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {links.map((item) => (
          <button key={item} type="button" className="transition hover:text-slate-500">
            {item}
          </button>
        ))}
      </div>
    </footer>
  );
}
