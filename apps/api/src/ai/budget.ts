import type { Store } from '../store.js'

// The daily AI spend cap (AI_DAILY_BUDGET_USD; design.md A6 "Limits"). Spend is estimated from the tokens each
// model call reports, at AI_USD_PER_MILLION_TOKENS, and counted in the shared store per UTC day, so every
// instance sees the same total. On NVIDIA's free tier the price is nominal and the cap rarely binds; it is there
// for paid providers and as a ceiling on runaway use.

export interface Budget {
  /** True once today's estimated spend has reached the cap. */
  exhausted(): Promise<boolean>
  /** Adds a call's tokens to today's spend. */
  record(tokens: number): Promise<void>
}

export interface BudgetOptions {
  store: Store
  dailyUsd: number
  usdPerMillionTokens: number
  now?: () => number
}

const DAY_SECONDS = 24 * 3600

export function dailyBudget({ store, dailyUsd, usdPerMillionTokens, now = Date.now }: BudgetOptions): Budget {
  // Counted in whole tokens: the store's counter is an integer increment, so a day's cap becomes a token cap.
  const cap = usdPerMillionTokens > 0 ? Math.floor((dailyUsd / usdPerMillionTokens) * 1_000_000) : Infinity
  const key = () => `ai:budget:${new Date(now()).toISOString().slice(0, 10)}`

  return {
    async exhausted() {
      if (cap === Infinity) return false
      return ((await store.get<number>(key())) ?? 0) >= cap
    },
    async record(tokens) {
      if (cap === Infinity || tokens <= 0) return
      const current = (await store.get<number>(key())) ?? 0
      // Not atomic across instances; an estimate against a soft cap doesn't need to be.
      await store.set(key(), current + Math.round(tokens), DAY_SECONDS + 3600)
    },
  }
}
