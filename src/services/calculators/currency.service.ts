import { ApiError } from "@/utils/api-error";
import type { CurrencyRequest } from "@/validators/calculator.validator";

const fallbackRatesToUsd = {
  USD: 1,
  EUR: 1.07,
  GBP: 1.26,
  INR: 0.012,
  NPR: 0.0075,
  AUD: 0.65,
  CAD: 0.72,
  JPY: 0.0067,
  CNY: 0.14,
  CHF: 1.12,
  SGD: 0.74,
  AED: 0.272294,
  SAR: 0.266667,
  PKR: 0.0036,
  BDT: 0.0082,
} as const;

type FallbackCurrency = keyof typeof fallbackRatesToUsd;

interface FrankfurterResponse {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

export async function convertCurrency(input: CurrencyRequest) {
  if (input.from === input.to) {
    return {
      amount: input.amount,
      from: input.from,
      to: input.to,
      convertedAmount: roundMoney(input.amount),
      rate: 1,
      source: "same-currency",
    };
  }

  const liveResult = await convertWithLiveRates(input);

  if (liveResult) {
    return liveResult;
  }

  return convertWithFallbackRates(input);
}

async function convertWithLiveRates(input: CurrencyRequest) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);

  try {
    const url = new URL("https://api.frankfurter.app/latest");
    url.searchParams.set("amount", String(input.amount));
    url.searchParams.set("from", input.from);
    url.searchParams.set("to", input.to);

    const response = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as FrankfurterResponse;
    const convertedAmount = data.rates[input.to];

    if (typeof convertedAmount !== "number") {
      return null;
    }

    return {
      amount: input.amount,
      from: input.from,
      to: input.to,
      convertedAmount: roundMoney(convertedAmount),
      rate: roundRate(convertedAmount / input.amount),
      date: data.date,
      source: "frankfurter",
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function convertWithFallbackRates(input: CurrencyRequest) {
  const fromRate = fallbackRatesToUsd[input.from as FallbackCurrency];
  const toRate = fallbackRatesToUsd[input.to as FallbackCurrency];

  if (!fromRate || !toRate) {
    throw new ApiError("Unsupported currency code.", 400, {
      supportedCurrencies: Object.keys(fallbackRatesToUsd),
    });
  }

  const usdAmount = input.amount * fromRate;
  const convertedAmount = usdAmount / toRate;

  return {
    amount: input.amount,
    from: input.from,
    to: input.to,
    convertedAmount: roundMoney(convertedAmount),
    rate: roundRate(fromRate / toRate),
    source: "fallback-rates",
  };
}

function roundMoney(value: number) {
  return Number(value.toFixed(2));
}

function roundRate(value: number) {
  return Number(value.toFixed(8));
}
