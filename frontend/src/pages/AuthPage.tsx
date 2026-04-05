import { FormEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { AppFooter } from '../components/AppFooter';
import { AuthField } from '../features/auth/components/AuthField';
import { AuthShowcase } from '../features/auth/components/AuthShowcase';
import { useAuth } from '../hooks/useAuth';
import { AuthMode } from '../types/auth';

export function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { submitAuth, authPending, clearError } = useAuth();

  const mode: AuthMode =
    location.pathname === '/auth/sign-up' ? 'signup' : 'signin';
  const isSignIn = mode === 'signin';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    clearError();
  }, [mode, clearError]);

  const changeMode = (nextMode: AuthMode) => {
    navigate(nextMode === 'signup' ? '/auth/sign-up' : '/auth/sign-in');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await submitAuth({
        mode,
        fullName,
        email,
        password,
        confirmPassword,
      });

      navigate('/tasks');
    } catch {
      return;
    }
  };

  return (
    <div className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-7xl flex-col justify-center gap-6">
        <main className="flex flex-1 items-center">
          <section className="grid min-h-[740px] w-full overflow-hidden rounded-[32px] border border-white/70 bg-white/70 shadow-[0_30px_80px_rgba(15,35,70,0.16)] backdrop-blur xl:grid-cols-[1.04fr_0.96fr]">
            <AuthShowcase isSignIn={isSignIn} />

            <div className="bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,254,0.92))]">
              <div className="flex h-full flex-col px-6 py-10 sm:px-10 sm:py-12 lg:px-12">
                <div>
                  <img
                    src="/images/logo.svg"
                    alt="Opkit CRM"
                    className="h-14 w-auto object-contain"
                  />
                  <h2 className="mt-8 text-4xl font-extrabold tracking-[-0.05em] text-slate-800">
                    {isSignIn ? 'С возвращением' : 'Создать аккаунт'}
                  </h2>
                  <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
                    {isSignIn
                      ? 'Введите данные для входа в вашу учетную запись'
                      : 'Зарегистрируйтесь, чтобы получить доступ к платформе.'}
                  </p>
                </div>

                <form className="mt-8 flex flex-col gap-4" onSubmit={handleSubmit}>
                  <AuthField
                    label="Электронная почта"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={setEmail}
                  />

                  {isSignIn ? (
                    <AuthField
                      label="Пароль"
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={setPassword}
                    />
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <AuthField
                        label="Пароль"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={setPassword}
                      />
                      <AuthField
                        label="Подтверждение"
                        type="password"
                        placeholder="Password confirmation"
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                      />
                    </div>
                  )}

                  {!isSignIn && (
                    <>
                    <label className="mt-1 flex items-start gap-3 text-sm leading-6 text-slate-500">
                      <input className="mt-1 h-4 w-4 rounded border-slate-300" type="checkbox" />
                      <span>
                        Я принимаю{' '}
                        <span className="font-semibold text-blue-700">
                          Условия использования
                        </span>{' '}
                        и{' '}
                        <span className="font-semibold text-blue-700">
                          Политику конфиденциальности
                        </span>
                      </span>
                    </label>
                    </>
                  )}

                  <button
                    className="mt-2 inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(180deg,#123b79,#0c2b58)] px-5 text-sm font-extrabold text-white shadow-[0_16px_34px_rgba(12,43,88,0.24)] transition hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-70"
                    type="submit"
                    disabled={authPending}
                  >
                    {authPending
                      ? 'Подождите...'
                      : isSignIn
                        ? 'Войти в систему'
                        : 'Зарегистрироваться'}
                    <span aria-hidden="true">→</span>
                  </button>
                </form>

                <p className="mt-auto pt-8 text-center text-sm text-slate-500">
                  {isSignIn ? 'Нет учетной записи?' : 'Уже есть аккаунт?'}{' '}
                  <button
                    type="button"
                    className="font-bold text-blue-700"
                    onClick={() => changeMode(isSignIn ? 'signup' : 'signin')}
                  >
                    {isSignIn ? 'Зарегистрироваться' : 'Войти в систему'}
                  </button>
                </p>
              </div>
            </div>
          </section>
        </main>

        <AppFooter />
      </div>
    </div>
  );
}
