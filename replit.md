# Trade Risk Calculator

A mobile-first calculator for traders to size positions, calculate dollar risk, and evaluate risk/reward before entering a trade.

## Run & Operate

- `pnpm --filter @workspace/trade-risk-calc run dev` — start the calculator (served via shared proxy at `/`)
- `pnpm --filter @workspace/trade-risk-calc run typecheck` — typecheck the frontend
- `pnpm run typecheck` — full typecheck across all workspace packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 18 + Vite, Tailwind CSS v4, shadcn/ui
- Forms: react-hook-form + Zod
- Routing: wouter
- No backend — all calculation logic runs in the browser

## Where things live

- `artifacts/trade-risk-calc/src/components/Calculator.tsx` — all calculator logic and UI
- `artifacts/trade-risk-calc/src/App.tsx` — page shell, "Как пользоваться" section, disclaimer
- `artifacts/trade-risk-calc/src/index.css` — dark theme, Space Grotesk font, CSS custom properties

## Architecture decisions

- Pure frontend: no API, no database. All math is client-side JS — no latency, no auth needed.
- Dark mode forced on page load (`document.documentElement.classList.add("dark")`) — no toggle by design.
- Currency selector is UI-only: it just changes the displayed symbol, not the calculation.
- Direction validation (LONG/SHORT) runs on every field change after the first submit and on direction toggle — results are hidden when the setup is invalid.
- shadcn/ui component files are left in full (scaffold default) — they add no bundle cost if unused, and make future additions easy.

## Product

- **LONG / SHORT selector** with Russian direction validation warnings
- **5 inputs**: account balance, risk %, entry price, stop loss, take profit
- **Currency selector**: $ / € / ₽ (symbol only, no conversion)
- **Risk level warning**: Нормальный / Повышенный / Слишком высокий риск
- **4 results**: position size, risk/reward ratio, dollar risk, potential profit
- **R:R visual bar**: proportional red/green gauge
- **"Как пользоваться"** instructions and legal disclaimer below the card
- Live recalculation on every field change after first submit

## User preferences

- Interface language: Russian, except trading terms (Risk %, Stop Loss, Take Profit) stay in English.
- Dark theme only.
- No new features unless explicitly requested: no trade log, share button, breakeven, lot size, fees, or pre-calc mode.
- Mobile-first layout; compact vertical spacing.

## Gotchas

- `useEffect` for live recalculation must use early-return pattern (`if (!hasCalculated) return;`) to satisfy TypeScript's "not all code paths return a value" rule.
- Currency prefix in the balance input uses a `<span>` positioned absolutely — if padding changes, verify the symbol doesn't overlap the number.
- The shared proxy routes `/` to the trade-risk-calc Vite dev server. Do not hard-code ports.
