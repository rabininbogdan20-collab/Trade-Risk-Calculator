import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Percent, Target, TrendingDown, Crosshair, RefreshCw, Calculator as CalcIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  accountBalance: z.coerce.number().positive("Must be positive"),
  riskPercentage: z.coerce.number().positive("Must be positive"),
  entryPrice: z.coerce.number().positive("Must be positive"),
  stopLoss: z.coerce.number().positive("Must be positive"),
  takeProfit: z.coerce.number().positive("Must be positive"),
}).refine((data) => data.stopLoss !== data.entryPrice, {
  message: "Stop loss cannot equal entry price",
  path: ["stopLoss"],
});

type FormValues = z.infer<typeof formSchema>;

export function Calculator() {
  const [results, setResults] = useState<{
    dollarRisk: number;
    positionSize: number;
    potentialProfit: number;
    riskReward: number;
    direction: "long" | "short";
  } | null>(null);

  const [hasCalculated, setHasCalculated] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountBalance: 10000,
      riskPercentage: 1,
      entryPrice: 0,
      stopLoss: 0,
      takeProfit: 0,
    },
  });

  const riskPct = form.watch("riskPercentage");

  const onSubmit = (data: FormValues) => {
    const dollarRisk = data.accountBalance * (data.riskPercentage / 100);
    const riskPerShare = Math.abs(data.entryPrice - data.stopLoss);
    const positionSize = riskPerShare > 0 ? dollarRisk / riskPerShare : 0;
    const potentialProfit = positionSize * Math.abs(data.takeProfit - data.entryPrice);
    const riskReward = dollarRisk > 0 ? potentialProfit / dollarRisk : 0;
    const direction = data.takeProfit > data.entryPrice ? "long" : "short";

    setResults({ dollarRisk, positionSize, potentialProfit, riskReward, direction });
    setHasCalculated(true);
  };

  const handleReset = () => {
    form.reset();
    setResults(null);
    setHasCalculated(false);
  };

  useEffect(() => {
    if (hasCalculated) {
      const subscription = form.watch(() => {
        form.handleSubmit(onSubmit)();
      });
      return () => subscription.unsubscribe();
    }
  }, [hasCalculated, form.watch, form.handleSubmit]);

  return (
    <Card className="w-full max-w-md bg-card/50 backdrop-blur-sm border-border shadow-2xl rounded-2xl overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-primary/50 via-primary to-primary/50" />

      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground tracking-tight">
          <CalcIcon className="w-5 h-5 text-primary shrink-0" />
          Trade Risk Calculator
        </CardTitle>
      </CardHeader>

      <CardContent className="px-4 pb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">

            {/* Balance + Risk % */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="accountBalance"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Баланс счёта</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                        <Input type="number" step="any" className="pl-8 font-mono text-base h-9" data-testid="input-account-balance" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="riskPercentage"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Risk %</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Percent className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                        <Input type="number" step="any" className="pr-8 font-mono text-base h-9" data-testid="input-risk-percentage" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            </div>

            {/* Risk warning */}
            {riskPct > 0 && (
              <div
                data-testid="risk-warning"
                className={cn(
                  "text-[11px] font-semibold px-3 py-1.5 rounded-lg border",
                  riskPct <= 1
                    ? "text-green-400 bg-green-500/10 border-green-500/20"
                    : riskPct <= 2
                    ? "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
                    : "text-destructive bg-destructive/10 border-destructive/20"
                )}
              >
                {riskPct <= 1
                  ? "Нормальный риск"
                  : riskPct <= 2
                  ? "Повышенный риск"
                  : "Слишком высокий риск — уменьши позицию"}
              </div>
            )}

            {/* Entry Price */}
            <FormField
              control={form.control}
              name="entryPrice"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Цена входа</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Target className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-primary" />
                      <Input type="number" step="any" className="pl-8 font-mono text-base h-9 bg-background/50 border-primary/20 focus-visible:border-primary" data-testid="input-entry-price" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            {/* Stop Loss + Take Profit */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="stopLoss"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-[10px] uppercase tracking-wider text-destructive font-semibold">Stop Loss</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <TrendingDown className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-destructive" />
                        <Input type="number" step="any" className="pl-8 font-mono text-base h-9 border-destructive/20 focus-visible:ring-destructive" data-testid="input-stop-loss" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="takeProfit"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-[10px] uppercase tracking-wider text-green-500 font-semibold" translate="no">Take Profit</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Crosshair className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-green-500" />
                        <Input type="number" step="any" className="pl-8 font-mono text-base h-9 border-green-500/20 focus-visible:ring-green-500" data-testid="input-take-profit" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-1">
              <Button type="submit" size="sm" className="w-full font-bold tracking-wide shadow-primary/20 shadow-lg h-10 text-sm" data-testid="button-calculate">
                РАССЧИТАТЬ
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={handleReset} className="h-10 px-3" data-testid="button-reset">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </Form>

        {/* Results */}
        {results && (
          <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="h-px w-full bg-border" />

            <div className="grid grid-cols-2 gap-x-3 gap-y-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5">Размер позиции</p>
                <p className="text-xl font-mono font-bold text-foreground leading-tight" data-testid="result-position-size">
                  {results.positionSize.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">единиц актива</p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5">Риск / Прибыль</p>
                <p className="text-xl font-mono font-bold text-primary leading-tight" data-testid="result-risk-reward">
                  1 : {results.riskReward.toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-destructive font-semibold mb-0.5">Вы рискуете</p>
                <p className="text-xl font-mono font-bold text-destructive leading-tight" data-testid="result-dollar-risk">
                  ${results.dollarRisk.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-green-500 font-semibold mb-0.5">Потенциальная прибыль</p>
                <p className="text-xl font-mono font-bold text-green-500 leading-tight" data-testid="result-potential-profit">
                  ${results.potentialProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* R:R Visual Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                <span>Risk 1R</span>
                <span>Reward {results.riskReward.toFixed(2)}R</span>
              </div>
              <div className="flex h-2 w-full rounded-full overflow-hidden bg-muted">
                <div
                  className="bg-destructive transition-all duration-500 ease-out"
                  style={{ width: `${(1 / (1 + results.riskReward)) * 100}%` }}
                />
                <div
                  className="bg-green-500 transition-all duration-500 ease-out"
                  style={{ width: `${(results.riskReward / (1 + results.riskReward)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
