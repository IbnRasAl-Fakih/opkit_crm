import { NavLink } from 'react-router-dom';

import {
  BurgerMenuIcon,
  BurgerMenuCloseIcon,
  CalendarIcon,
  LogoutIcon,
  ProjectsIcon,
  ReportIcon,
  SettingsIcon,
  TasksIcon,
  TeamIcon,
} from '../../../icons';

type TaskSidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
  onCreateTask: () => void;
  onLogout: () => void;
};

const menuItems = [
  { label: 'Задачи', href: '/tasks', icon: TasksIcon },
  { label: 'Проекты', href: '/projects', icon: ProjectsIcon },
  { label: 'Календарь', href: '/calendar', icon: CalendarIcon },
  { label: 'Команда', href: '/team', icon: TeamIcon },
  { label: 'Отчеты', href: '/reports', icon: ReportIcon },
];

export function TaskSidebar({
  collapsed,
  onToggle,
  onCreateTask,
  onLogout,
}: TaskSidebarProps) {
  return (
    <aside
      className={`flex min-h-full flex-col justify-between border-r border-slate-200/80 bg-white transition-[width] duration-300 ${
        collapsed ? 'w-full lg:w-[92px]' : 'w-full lg:w-[260px]'
      }`}
    >
      <div className="p-5">
        <div className={`flex items-start ${collapsed ? 'flex-col items-center gap-4' : 'justify-between gap-3'}`}>
          <div className={collapsed ? 'flex justify-center' : 'px-3'}>
            {collapsed ? (
              <img
                src="/images/favicon.svg"
                alt="Opkit CRM"
                className="h-11 w-11 rounded-xl object-contain"
              />
            ) : (
              <>
                <img
                  src="/images/logo.svg"
                  alt="Opkit CRM"
                  className="h-12 w-auto object-contain"
                />
              </>
            )}
          </div>

          <button
            type="button"
            onClick={onToggle}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
            aria-label={collapsed ? 'Открыть меню' : 'Свернуть меню'}
          >
            {collapsed ? (
              <BurgerMenuIcon className="h-5 w-5" />
            ) : (
              <BurgerMenuCloseIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        <nav className="mt-8 flex flex-col gap-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center ${collapsed ? 'justify-center' : 'justify-between'} rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                  isActive
                    ? 'bg-slate-50 text-[var(--color-ink-800)]'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`
              }
              title={collapsed ? item.label : undefined}
            >
              {({ isActive }) => (
                <>
                  <span className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
                    <item.icon className="h-5 w-5" />
                    {!collapsed && <span>{item.label}</span>}
                  </span>
                  {!collapsed && isActive && (
                    <span className="h-7 w-1 rounded-full bg-blue-700" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={onCreateTask}
          className={`mt-8 inline-flex items-center justify-center rounded-2xl bg-[linear-gradient(180deg,#123b79,#0c2b58)] text-sm font-extrabold text-white shadow-[0_16px_34px_rgba(12,43,88,0.18)] ${
            collapsed ? 'h-12 w-full px-0' : 'w-full px-4 py-3'
          }`}
          title={collapsed ? 'Создать задачу' : undefined}
        >
          {collapsed ? '+' : 'Создать задачу'}
        </button>
      </div>

      <div className="border-t border-slate-200/80 p-5">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex w-full items-center ${collapsed ? 'justify-center' : ''} rounded-2xl px-4 py-3 text-sm font-semibold transition ${
              isActive
                ? 'bg-slate-50 text-[var(--color-ink-800)]'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`
          }
          title={collapsed ? 'Настройки' : undefined}
        >
          <span className={`flex items-center ${collapsed ? 'justify-center w-full' : 'gap-3'}`}>
            <SettingsIcon className="h-5 w-5" />
            {!collapsed && <span>Настройки</span>}
          </span>
        </NavLink>

        <button
          type="button"
          onClick={onLogout}
          className={`mt-1 flex w-full items-center rounded-2xl px-4 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-700 ${
            collapsed ? 'justify-center' : ''
          }`}
          title={collapsed ? 'Выйти' : undefined}
        >
          <span className={`flex items-center ${collapsed ? 'justify-center w-full' : 'gap-3'}`}>
            <LogoutIcon className="h-5 w-5" />
            {!collapsed && <span>Выйти</span>}
          </span>
        </button>
      </div>
    </aside>
  );
}
