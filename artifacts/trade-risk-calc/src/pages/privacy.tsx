import { Link } from "wouter";

export default function Privacy() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start gap-3 p-3 sm:p-4 selection:bg-primary selection:text-primary-foreground">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-base font-bold tracking-tight text-foreground">
            Политика конфиденциальности
          </h1>
          <Link
            href="/"
            className="shrink-0 text-[11px] text-primary hover:text-primary/80 transition-colors"
          >
            ← На главную
          </Link>
        </div>

        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Приложение: <span className="text-foreground font-medium">RiskMate Trader</span>
        </p>

        <Section title="Сбор данных">
          RiskMate Trader не собирает, не хранит и не передаёт никаких персональных
          данных. Мы не используем аналитику, куки и не запрашиваем регистрацию.
        </Section>

        <Section title="Вычисления на устройстве">
          Все расчёты (размер позиции, сумма риска, соотношение риск/прибыль)
          выполняются локально в вашем браузере. Никакие данные — баланс счёта,
          цены входа, Stop Loss или Take Profit — не отправляются на сервер и не
          сохраняются после закрытия вкладки.
        </Section>

        <Section title="Сторонние сервисы">
          Приложение подключает шрифты через Google Fonts. При загрузке страницы
          браузер обращается к серверам Google для получения шрифта. Google может
          фиксировать IP-адрес запроса согласно своей политике конфиденциальности.
          Никакие другие сторонние службы не используются.
        </Section>

        <Section title="Не является финансовой рекомендацией">
          RiskMate Trader — это инструмент для расчёта риска. Приложение не даёт
          инвестиционных советов и не несёт ответственности за торговые решения,
          принятые на основе его расчётов. Все решения о сделках принимаете
          исключительно вы.
        </Section>

        <p className="text-[10px] text-muted-foreground/40 leading-snug pt-1 border-t border-border">
          Последнее обновление: июнь 2025
        </p>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
        {title}
      </p>
      <p className="text-[11px] text-muted-foreground leading-relaxed">{children}</p>
    </div>
  );
}
