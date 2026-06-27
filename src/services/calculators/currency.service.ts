import { ApiError } from "@/utils/api-error";
import type { CurrencyRequest } from "@/validators/calculator.validator";

const ratesToUsd = {
  USD: 1,
  EUR: 1.08,
  GBP: 1.27,
  INR: 0.012,
  NPR: 0.0075,
  AUD: 0.66,
  CAD: 0.73,
  JPY: 0.0064,
} as const;

export function convertCurrency(input: CurrencyRequest) {
  const fromRate = ratesToUsd[input.from as keyof typeof ratesToUsd];
  const toRate = ratesToUsd[input.to as keyof typeof ratesToUsd];

  if (!fromRate || !toRate) {
    throw new ApiError("Unsupported currency code.", 400, {
      supportedCurrencies: Object.keys(ratesToUsd),
    });
  }

  const usdAmount = input.amount * fromRate;
  const convertedAmount = usdAmount / toRate;

  return {
    amount: input.amount,
    from: input.from,
    to: input.to,
    convertedAmount: Number(convertedAmount.toFixed(2)),
    rate: Number((fromRate / toRate).toFixed(6)),
    source: "static-rates",
  };
}
