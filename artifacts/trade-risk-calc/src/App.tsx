import { Switch, Route, Router as WouterRouter, Link } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Privacy from "@/pages/privacy";
import { Calculator } from "@/components/Calculator";
import { useEffect } from "react";

const queryClient = new QueryClient();

function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start sm:justify-center gap-3 p-3 sm:p-4 selection:bg-primary selection:text-primary-foreground">
      <Calculator />
      <div className="w-full max-w-md rounded-xl border border-border bg-card/30 px-4 py-3" data-testid="how-to-use">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Как пользоваться</p>
        <ol className="space-y-1.5 list-none">
          {[
            "Выберите LONG или SHORT.",
            "Укажите баланс счёта и риск в процентах.",
            "Введите цену входа, Stop Loss и Take Profit.",
            "Калькулятор покажет размер позиции, сумму риска и соотношение риск/прибыль.",
            "Риск выше 2% считается повышенным — уменьшите позицию.",
          ].map((text, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="shrink-0 w-4 h-4 mt-px rounded-full bg-primary/15 text-primary text-[9px] font-bold flex items-center justify-center leading-none">
                {i + 1}
              </span>
              <span className="text-[11px] text-muted-foreground leading-snug">{text}</span>
            </li>
          ))}
        </ol>
      </div>
      <p className="w-full max-w-md text-center text-[10px] text-muted-foreground/50 leading-snug px-2 pb-1" data-testid="disclaimer">
        Не является финансовой рекомендацией. Калькулятор помогает рассчитать риск, но решение о сделке принимаете вы.{" "}
        <Link href="/privacy" className="underline underline-offset-2 hover:text-muted-foreground/70 transition-colors">
          Политика конфиденциальности
        </Link>
      </p>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/privacy" component={Privacy} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Force dark mode
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
