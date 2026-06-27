import type { NepaliDateRequest } from "@/validators/calculator.validator";

const BS_EPOCH_AD = Date.UTC(1944, 0, 1);
const BS_EPOCH_YEAR = 2000;
const BS_EPOCH_MONTH = 9;
const BS_EPOCH_DAY = 17;
const AVERAGE_BS_YEAR_DAYS = 365.25875;

export function convertNepaliDate(input: NepaliDateRequest) {
  if (input.direction === "bs-to-ad") {
    return {
      input: input.date,
      direction: input.direction,
      message:
        "BS to AD conversion requires an official Nepali calendar table. AD to BS approximation is available.",
    };
  }

  const adDate = new Date(`${input.date}T00:00:00.000Z`);
  const diffDays = Math.floor((adDate.getTime() - BS_EPOCH_AD) / 86_400_000);
  const approxYearOffset = Math.floor(diffDays / AVERAGE_BS_YEAR_DAYS);
  const bsYear = BS_EPOCH_YEAR + approxYearOffset;
  const dayOfApproxYear = Math.max(
    0,
    Math.floor(diffDays - approxYearOffset * AVERAGE_BS_YEAR_DAYS),
  );
  const approxMonthOffset = Math.floor(dayOfApproxYear / 30.4375);
  const bsMonth = ((BS_EPOCH_MONTH - 1 + approxMonthOffset) % 12) + 1;
  const bsDay = Math.floor(dayOfApproxYear % 30.4375) + BS_EPOCH_DAY;

  return {
    input: input.date,
    direction: input.direction,
    bsDate: `${bsYear}-${String(bsMonth).padStart(2, "0")}-${String(
      Math.min(bsDay, 32),
    ).padStart(2, "0")}`,
    approximate: true,
  };
}
