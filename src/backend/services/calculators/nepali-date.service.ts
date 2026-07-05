import type { NepaliDateRequest } from "@/backend/validators/calculator.validator";
import { ApiError } from "@/backend/utils/api-error";

const BS_EPOCH_AD = Date.UTC(1944, 0, 1);
const BS_EPOCH_YEAR = 2000;
const BS_EPOCH_MONTH = 9;
const BS_EPOCH_DAY = 17;
const AVERAGE_BS_YEAR_DAYS = 365.25875;
const AVERAGE_BS_MONTH_DAYS = AVERAGE_BS_YEAR_DAYS / 12;
const MS_PER_DAY = 86_400_000;

export function convertNepaliDate(input: NepaliDateRequest) {
  if (input.direction === "bs-to-ad") {
    const bsDate = parseBSDate(input.date);
    const adDate = bsToAD(bsDate);

    return {
      input: input.date,
      direction: input.direction,
      adDate: formatDate(adDate),
      approximate: true,
      method: "average-bs-month",
    };
  }

  const adDate = parseADDate(input.date);
  const bsDate = adToBS(adDate);

  return {
    input: input.date,
    direction: input.direction,
    bsDate: formatBSDate(bsDate),
    approximate: true,
    method: "average-bs-month",
  };
}

interface BSDateParts {
  year: number;
  month: number;
  day: number;
}

function adToBS(adDate: Date): BSDateParts {
  const diffDays = Math.round((adDate.getTime() - BS_EPOCH_AD) / MS_PER_DAY);
  const epochMonthIndex = BS_EPOCH_YEAR * 12 + (BS_EPOCH_MONTH - 1);
  const monthPosition =
    epochMonthIndex + (BS_EPOCH_DAY - 1 + diffDays) / AVERAGE_BS_MONTH_DAYS;
  const monthIndex = Math.floor(monthPosition);
  const day = Math.floor((monthPosition - monthIndex) * AVERAGE_BS_MONTH_DAYS) + 1;

  return normalizeBSDate({
    year: Math.floor(monthIndex / 12),
    month: (monthIndex % 12) + 1,
    day,
  });
}

function bsToAD(bsDate: BSDateParts) {
  const epochMonthIndex = BS_EPOCH_YEAR * 12 + (BS_EPOCH_MONTH - 1);
  const inputMonthIndex = bsDate.year * 12 + (bsDate.month - 1);
  const diffDays =
    (inputMonthIndex - epochMonthIndex) * AVERAGE_BS_MONTH_DAYS +
    (bsDate.day - BS_EPOCH_DAY);

  return new Date(BS_EPOCH_AD + Math.round(diffDays) * MS_PER_DAY);
}

function parseADDate(value: string) {
  const [year, month, day] = parseDateParts(value, "AD date");
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new ApiError("Invalid AD date.", 400);
  }

  return date;
}

function parseBSDate(value: string): BSDateParts {
  const [year, month, day] = parseDateParts(value, "BS date");

  if (month < 1 || month > 12) {
    throw new ApiError("BS month must be between 1 and 12.", 400);
  }

  if (day < 1 || day > 32) {
    throw new ApiError("BS day must be between 1 and 32.", 400);
  }

  return { year, month, day };
}

function parseDateParts(value: string, label: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    throw new ApiError(`${label} must use YYYY-MM-DD format.`, 400);
  }

  return match.slice(1).map(Number) as [number, number, number];
}

function normalizeBSDate(date: BSDateParts): BSDateParts {
  let { year, month, day } = date;

  while (day > 32) {
    day -= 32;
    month += 1;
  }

  while (day < 1) {
    day += 32;
    month -= 1;
  }

  while (month > 12) {
    month -= 12;
    year += 1;
  }

  while (month < 1) {
    month += 12;
    year -= 1;
  }

  return { year, month, day };
}

function formatBSDate(date: BSDateParts) {
  return `${date.year}-${pad(date.month)}-${pad(date.day)}`;
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}
