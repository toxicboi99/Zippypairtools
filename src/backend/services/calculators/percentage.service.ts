import type { PercentageRequest } from "@/backend/validators/calculator.validator";

export function calculatePercentage(input: PercentageRequest) {
  if (input.mode === "percentageOf") {
    const result = (input.percentage / 100) * input.value;

    return {
      mode: input.mode,
      result: round(result),
      expression: `${input.percentage}% of ${input.value}`,
    };
  }

  if (input.mode === "whatPercent") {
    const result = (input.part / input.total) * 100;

    return {
      mode: input.mode,
      result: round(result),
      expression: `${input.part} is what percent of ${input.total}`,
    };
  }

  const result = ((input.to - input.from) / input.from) * 100;

  return {
    mode: input.mode,
    result: round(result),
    expression: `percentage change from ${input.from} to ${input.to}`,
    direction: result > 0 ? "increase" : result < 0 ? "decrease" : "no-change",
  };
}

function round(value: number) {
  return Number(value.toFixed(6));
}
