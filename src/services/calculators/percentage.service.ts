import type { PercentageRequest } from "@/validators/calculator.validator";

export function calculatePercentage(input: PercentageRequest) {
  if (input.mode === "percentageOf") {
    return {
      mode: input.mode,
      result: (input.percentage / 100) * input.value,
    };
  }

  if (input.mode === "whatPercent") {
    return {
      mode: input.mode,
      result: (input.part / input.total) * 100,
    };
  }

  return {
    mode: input.mode,
    result: ((input.to - input.from) / input.from) * 100,
  };
}
