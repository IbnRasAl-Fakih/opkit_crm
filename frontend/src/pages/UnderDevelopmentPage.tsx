import { useNavigate } from 'react-router-dom';

import { AppFooter } from '../components/AppFooter';
import { CloseIcon } from '../icons';

export function UnderDevelopmentPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f9fbff_0%,#eef3f9_100%)] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-6xl flex-col gap-6">
        <section className="flex flex-1 items-center justify-center rounded-[34px] border border-white/80 bg-white/75 px-6 py-14 text-center shadow-[0_30px_80px_rgba(15,35,70,0.12)] backdrop-blur sm:px-10 lg:px-16 lg:py-20">
          <div className="mx-auto flex max-w-3xl flex-col items-center">
            <div className="relative mb-10">
              <div className="flex h-40 w-40 items-center justify-center rounded-full bg-[radial-gradient(circle_at_top,#ffffff,#f3f7fc)] shadow-[0_20px_60px_rgba(18,45,91,0.12)]">
                <div className="relative h-16 w-16">
                  <span className="absolute left-1/2 top-1 block h-3 w-3 -translate-x-1/2 rounded-full border-[4px] border-[#0f6bc8]" />
                  <span className="absolute left-[18px] top-[14px] h-11 w-1 rotate-[18deg] rounded-full bg-[#0f6bc8]" />
                  <span className="absolute right-[18px] top-[14px] h-11 w-1 -rotate-[18deg] rounded-full bg-[#0f6bc8]" />
                  <span className="absolute left-1/2 top-[16px] h-10 w-1 -translate-x-1/2 rounded-full bg-[#0f6bc8]" />
                </div>
              </div>
              <div className="absolute right-0 top-2 grid h-10 w-10 place-items-center rounded-full bg-amber-900 text-lg text-amber-300 shadow-[0_12px_30px_rgba(120,53,15,0.22)]">
                <CloseIcon className="h-4 w-4" />
              </div>
            </div>

            <h1 className="max-w-4xl text-4xl font-extrabold tracking-[-0.06em] text-slate-900 sm:text-5xl">
              Раздел находится в разработке
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-500">
              Мы работаем над новым функционалом, чтобы управление задачами стало
              еще эффективнее. Заходите позже.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate('/tasks')}
                className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-[linear-gradient(180deg,#123b79,#0c2b58)] px-8 text-sm font-extrabold text-white shadow-[0_16px_34px_rgba(12,43,88,0.24)] transition hover:-translate-y-px"
              >
                Назад в CRM
              </button>
              <a
                href="mailto:support@taskmaster.local?subject=TaskMaster%20Under%20Development"
                className="inline-flex min-h-14 items-center justify-center rounded-2xl px-8 text-sm font-extrabold text-slate-600 transition hover:text-slate-900"
              >
                Связаться с поддержкой
              </a>
            </div>

            <div className="mt-10 inline-flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-500 shadow-inner">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              Система: техническое обслуживание
            </div>
          </div>
        </section>
        <AppFooter className="px-1" />
      </div>
    </div>
  );
}
