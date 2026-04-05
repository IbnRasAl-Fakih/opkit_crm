type AuthShowcaseProps = {
  isSignIn: boolean;
};

const signInStats = [
  { value: '500+', label: 'корпоративных клиентов' },
  { value: '99.9%', label: 'доступность системы' },
];

export function AuthShowcase({ isSignIn }: AuthShowcaseProps) {
  return (
    <div
      className={`relative overflow-hidden px-7 py-10 text-white sm:px-10 sm:py-12 ${
        isSignIn
          ? 'bg-[linear-gradient(140deg,rgba(8,35,73,0.94),rgba(19,56,104,0.88))]'
          : 'bg-[linear-gradient(150deg,rgba(11,41,87,0.92),rgba(32,71,130,0.82))]'
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_18%)]" />
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:132px_132px]" />
      <div className="relative flex h-full flex-col">
        <div className="my-auto max-w-xl">
          <h1 className="max-w-md text-4xl leading-[0.95] font-extrabold tracking-[-0.06em] sm:text-6xl">
            {isSignIn
              ? 'Управляйте процессами с хирургической точностью.'
              : 'Архитектура вашего успеха начинается здесь.'}
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-blue-50/78 sm:text-lg">
            {isSignIn
              ? 'Превратите сложные данные в понятные рабочие процессы. Ваша команда заслуживает профессиональный инструмент.'
              : 'Присоединяйтесь к тысячам профессионалов, которые трансформируют свои данные в решительные действия.'}
          </p>

          {isSignIn ? (
            <div className="mt-14 grid gap-6 border-t border-white/15 pt-7 sm:grid-cols-2">
              {signInStats.map((item) => (
                <div key={item.label}>
                  <div className="text-3xl font-extrabold">{item.value}</div>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-blue-100/70">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-14 flex items-center gap-4">
              <div className="text-[11px] uppercase tracking-[0.16em] text-blue-100/72">
                50k+ активных пользователей
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

