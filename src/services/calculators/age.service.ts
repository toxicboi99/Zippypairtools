import type { AgeRequest } from "@/validators/calculator.validator";

export function calculateAge(input: AgeRequest) {
  const birthDate = parseDate(input.dateOfBirth);
  const asOfDate = input.asOf ? parseDate(input.asOf) : new Date();

  if (birthDate > asOfDate) {
    throw new Error("Date of birth cannot be in the future.");
  }

  let years = asOfDate.getFullYear() - birthDate.getFullYear();
  let months = asOfDate.getMonth() - birthDate.getMonth();
  let days = asOfDate.getDate() - birthDate.getDate();

  if (days < 0) {
    months -= 1;
    days += new Date(asOfDate.getFullYear(), asOfDate.getMonth(), 0).getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalDays = Math.floor(
    (startOfDay(asOfDate).getTime() - startOfDay(birthDate).getTime()) /
      86_400_000,
  );

  return {
    years,
    months,
    days,
    totalDays,
    asOf: toDateString(asOfDate),
  };
}

function parseDate(value: string) {
  const date = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid date.");
  }

  return date;
}

function startOfDay(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function toDateString(date: Date) {
  return date.toISOString().slice(0, 10);
}
