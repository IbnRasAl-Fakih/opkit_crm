import { useNavigate } from 'react-router-dom';

import { AppFooter } from '../components/AppFooter';
import { useAuth } from '../hooks/useAuth';

export function NotFoundPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const homeTarget = isAuthenticated ? '/tasks' : '/auth/sign-in';

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f9fbff_0%,#eef3f9_100%)] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-7xl flex-col gap-6">
        <section className="grid flex-1 w-full gap-8 overflow-hidden rounded-[34px] border border-white/80 bg-white/75 p-6 shadow-[0_30px_80px_rgba(15,35,70,0.12)] backdrop-blur sm:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-14 lg:py-14 lg:pr-20">
          <div className="flex flex-col justify-center">
            <span className="text-xs font-extrabold uppercase tracking-[0.28em] text-amber-500">
              Ошибка доступа
            </span>
            <h1 className="mt-5 max-w-xl text-5xl font-extrabold leading-[0.92] tracking-[-0.07em] text-[var(--color-ink-800)] sm:text-6xl">
              Страница не найдена.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-500">
              Пожалуйста, проверьте правильность ссылки.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate(homeTarget)}
                className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-[linear-gradient(180deg,#123b79,#0c2b58)] px-6 text-sm font-extrabold text-white shadow-[0_16px_34px_rgba(12,43,88,0.24)] transition hover:-translate-y-px"
              >
                Вернуться к задачам
              </button>
              <a
                href="mailto:support@taskmaster.local?subject=TaskMaster%20404"
                className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 px-6 text-sm font-extrabold text-slate-700 transition hover:bg-slate-200"
              >
                Связаться с поддержкой
              </a>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute left-0 top-0 z-20 rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
                Task missing
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-600">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                Link unavailable
              </p>
            </div>

            <div className="relative flex min-h-[460px] w-full max-w-[470px] items-center justify-center overflow-hidden rounded-[34px] border border-slate-100 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
              <span className="absolute inset-0 grid place-items-center text-center font-extrabold leading-none tracking-[-0.08em] text-slate-100 sm:text-[260px]">
                404
              </span>
            </div>
          </div>
        </section>
        <AppFooter />
      </div>
    </div>
  );
}
