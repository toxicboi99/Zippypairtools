import { z, ZodError } from "zod";

import { ApiError } from "@/backend/utils/api-error";

export type CalculationCategory = "calculators" | "conversion";

export interface ToolField {
  name: string;
  label: string;
  type: "number" | "text" | "date" | "datetime-local" | "select";
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
  step?: string;
}

export interface ToolConfig {
  category: CalculationCategory;
  slug: string;
  title: string;
  fields: ToolField[];
}

export interface ToolResult {
  title: string;
  value: string;
  unit?: string;
  details?: Record<string, string | number | boolean>;
}

type ToolHandler = {
  config: ToolConfig;
  schema: z.ZodTypeAny;
  calculate: (input: Record<string, unknown>) => ToolResult;
};

const numberSchema = z.coerce.number().finite();
const positiveNumberSchema = numberSchema.positive();
const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format.");
const currencySchema = z.string().trim().length(3).transform((value) => value.toUpperCase());

const unitFactors = {
  length: {
    meter: 1,
    kilometer: 1000,
    centimeter: 0.01,
    millimeter: 0.001,
    mile: 1609.344,
    yard: 0.9144,
    foot: 0.3048,
    inch: 0.0254,
  },
  weight: {
    kilogram: 1,
    gram: 0.001,
    milligram: 0.000001,
    pound: 0.45359237,
    ounce: 0.028349523125,
    ton: 1000,
  },
  speed: {
    "m/s": 1,
    "km/h": 0.2777777778,
    mph: 0.44704,
    knot: 0.514444,
  },
  volume: {
    liter: 1,
    milliliter: 0.001,
    "cubic-meter": 1000,
    gallon: 3.785411784,
    quart: 0.946352946,
    pint: 0.473176473,
    cup: 0.2365882365,
  },
  time: {
    second: 1,
    minute: 60,
    hour: 3600,
    day: 86400,
    week: 604800,
  },
  "file-size": {
    B: 1,
    KB: 1024,
    MB: 1024 ** 2,
    GB: 1024 ** 3,
    TB: 1024 ** 4,
  },
} as const;

const currencyRatesToUsd = {
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

const unitOptions = {
  length: options(Object.keys(unitFactors.length)),
  weight: options(Object.keys(unitFactors.weight)),
  speed: options(Object.keys(unitFactors.speed)),
  volume: options(Object.keys(unitFactors.volume)),
  time: options(Object.keys(unitFactors.time)),
  "file-size": options(Object.keys(unitFactors["file-size"])),
  currency: options(Object.keys(currencyRatesToUsd)),
  temperature: options(["celsius", "fahrenheit", "kelvin"]),
};

const handlers: Record<CalculationCategory, Record<string, ToolHandler>> = {
  calculators: {
    age: {
      config: config("calculators", "age", "Age Calculator", [
        field("dateOfBirth", "Date of birth", "date"),
        field("asOf", "As of", "date"),
      ]),
      schema: z.object({
        dateOfBirth: isoDateSchema,
        asOf: isoDateSchema.optional().or(z.literal("")),
      }),
      calculate: (input) => calculateAge(input as { dateOfBirth: string; asOf?: string }),
    },
    bmi: {
      config: config("calculators", "bmi", "BMI Calculator", [
        field("weightKg", "Weight", "number", { placeholder: "70", step: "0.1" }),
        field("heightCm", "Height", "number", { placeholder: "175", step: "0.1" }),
      ]),
      schema: z.object({
        weightKg: positiveNumberSchema.max(700),
        heightCm: positiveNumberSchema.max(300),
      }),
      calculate: (input) => calculateBMI(input as { weightKg: number; heightCm: number }),
    },
    percentage: {
      config: config("calculators", "percentage", "Percentage Calculator", [
        selectField("mode", "Mode", [
          ["percentageOf", "Percentage of value"],
          ["whatPercent", "Part as percent of total"],
          ["percentageChange", "Percentage change"],
        ]),
        field("value", "Value", "number", { placeholder: "200", step: "0.01" }),
        field("percentage", "Percentage", "number", { placeholder: "15", step: "0.01" }),
        field("part", "Part", "number", { placeholder: "25", step: "0.01" }),
        field("total", "Total", "number", { placeholder: "100", step: "0.01" }),
        field("from", "From", "number", { placeholder: "80", step: "0.01" }),
        field("to", "To", "number", { placeholder: "100", step: "0.01" }),
      ]),
      schema: z.discriminatedUnion("mode", [
        z.object({ mode: z.literal("percentageOf"), percentage: numberSchema, value: numberSchema }),
        z.object({ mode: z.literal("whatPercent"), part: numberSchema, total: nonZeroNumberSchema("Total") }),
        z.object({ mode: z.literal("percentageChange"), from: nonZeroNumberSchema("Original value"), to: numberSchema }),
      ]),
      calculate: (input) => calculatePercentage(input),
    },
    gst: {
      config: config("calculators", "gst", "GST Calculator", [
        field("amount", "Amount", "number", { placeholder: "1000", step: "0.01" }),
        field("rate", "GST rate %", "number", { placeholder: "18", step: "0.01" }),
        selectField("mode", "Mode", [["add", "Add GST"], ["remove", "Remove GST"]]),
      ]),
      schema: z.object({
        amount: positiveNumberSchema,
        rate: numberSchema.min(0).max(100),
        mode: z.enum(["add", "remove"]).default("add"),
      }),
      calculate: (input) => calculateGST(input as { amount: number; rate: number; mode: "add" | "remove" }),
    },
    emi: {
      config: config("calculators", "emi", "EMI Calculator", [
        field("principal", "Principal", "number", { placeholder: "500000", step: "0.01" }),
        field("annualRate", "Annual interest rate %", "number", { placeholder: "9.5", step: "0.01" }),
        field("months", "Tenure months", "number", { placeholder: "60", step: "1" }),
      ]),
      schema: loanSchema("months"),
      calculate: (input) => calculateEMI(input as { principal: number; annualRate: number; months: number }),
    },
    loan: {
      config: config("calculators", "loan", "Loan Calculator", [
        field("principal", "Loan amount", "number", { placeholder: "500000", step: "0.01" }),
        field("annualRate", "Annual interest rate %", "number", { placeholder: "9.5", step: "0.01" }),
        field("years", "Tenure years", "number", { placeholder: "5", step: "0.1" }),
      ]),
      schema: loanSchema("years"),
      calculate: (input) => {
        const data = input as { principal: number; annualRate: number; years: number };
        return calculateEMI({ ...data, months: Math.round(data.years * 12) });
      },
    },
    "currency-converter": currencyHandler("calculators"),
    "unit-converter": unitHandler("calculators", "length", "Unit Converter"),
    "time-zone-converter": {
      config: config("calculators", "time-zone-converter", "Time Zone Converter", [
        field("datetime", "Date and time", "datetime-local"),
        field("fromZone", "From time zone", "text", { placeholder: "Asia/Kathmandu" }),
        field("toZone", "To time zone", "text", { placeholder: "UTC" }),
      ]),
      schema: z.object({
        datetime: z.string().min(1),
        fromZone: z.string().trim().min(1),
        toZone: z.string().trim().min(1),
      }),
      calculate: (input) => convertTimeZone(input as { datetime: string; fromZone: string; toZone: string }),
    },
    scientific: {
      config: config("calculators", "scientific", "Scientific Calculator", [
        field("expression", "Expression", "text", { placeholder: "sqrt(144) + 2^3" }),
      ]),
      schema: z.object({ expression: z.string().trim().min(1).max(200) }),
      calculate: (input) => calculateScientific(input as { expression: string }),
    },
    "date-difference": {
      config: config("calculators", "date-difference", "Date Difference Calculator", [
        field("startDate", "Start date", "date"),
        field("endDate", "End date", "date"),
      ]),
      schema: z.object({ startDate: isoDateSchema, endDate: isoDateSchema }),
      calculate: (input) => calculateDateDifference(input as { startDate: string; endDate: string }),
    },
    "fuel-cost": {
      config: config("calculators", "fuel-cost", "Fuel Cost Calculator", [
        field("distance", "Distance", "number", { placeholder: "120", step: "0.01" }),
        field("mileage", "Mileage per unit", "number", { placeholder: "15", step: "0.01" }),
        field("fuelPrice", "Fuel price per unit", "number", { placeholder: "165", step: "0.01" }),
      ]),
      schema: z.object({
        distance: positiveNumberSchema,
        mileage: positiveNumberSchema,
        fuelPrice: positiveNumberSchema,
      }),
      calculate: (input) => calculateFuelCost(input as { distance: number; mileage: number; fuelPrice: number }),
    },
  },
  conversion: {
    "nepali-date": {
      config: config("conversion", "nepali-date", "Nepali Date", [
        field("date", "Date", "date"),
        selectField("direction", "Direction", [["ad-to-bs", "AD to BS"], ["bs-to-ad", "BS to AD"]]),
      ]),
      schema: z.object({
        date: isoDateSchema,
        direction: z.enum(["ad-to-bs", "bs-to-ad"]).default("ad-to-bs"),
      }),
      calculate: (input) => convertNepaliDate(input as { date: string; direction: "ad-to-bs" | "bs-to-ad" }),
    },
    "unit-converter": unitHandler("conversion", "length", "Unit Converter"),
    "currency-converter": currencyHandler("conversion"),
    "temperature-converter": temperatureHandler(),
    "length-converter": unitHandler("conversion", "length", "Length Converter"),
    "weight-converter": unitHandler("conversion", "weight", "Weight Converter"),
    "speed-converter": unitHandler("conversion", "speed", "Speed Converter"),
    "volume-converter": unitHandler("conversion", "volume", "Volume Converter"),
    "time-converter": unitHandler("conversion", "time", "Time Converter"),
    "file-size-converter": unitHandler("conversion", "file-size", "File Size Converter"),
  },
};

export function getCalculationToolConfig(category: string, slug: string) {
  return getHandler(category, slug)?.config;
}

export function runCalculationTool(category: string, slug: string, payload: unknown) {
  const handler = getHandler(category, slug);

  if (!handler) {
    throw new ApiError("Tool not found.", 404);
  }

  try {
    const input = handler.schema.parse(payload);
    return handler.calculate(input);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ApiError("Validation failed.", 400, error.issues);
    }

    throw error;
  }
}

export function validateCalculationToolPayload(
  category: string,
  slug: string,
  payload: unknown,
) {
  const handler = getHandler(category, slug);

  if (!handler) {
    throw new ApiError("Tool not found.", 404);
  }

  return handler.schema.parse(payload);
}

export function isCalculationCategory(category: string): category is CalculationCategory {
  return category === "calculators" || category === "conversion";
}

function getHandler(category: string, slug: string) {
  if (!isCalculationCategory(category)) return undefined;
  return handlers[category][slug];
}

function config(
  category: CalculationCategory,
  slug: string,
  title: string,
  fields: ToolField[],
): ToolConfig {
  return { category, slug, title, fields };
}

function field(
  name: string,
  label: string,
  type: ToolField["type"],
  extras: Partial<ToolField> = {},
): ToolField {
  return { name, label, type, ...extras };
}

function selectField(
  name: string,
  label: string,
  entries: Array<[string, string]>,
): ToolField {
  return {
    name,
    label,
    type: "select",
    options: entries.map(([value, optionLabel]) => ({ label: optionLabel, value })),
  };
}

function options(values: string[]) {
  return values.map((value) => ({ label: value, value }));
}

function nonZeroNumberSchema(label: string) {
  return numberSchema.refine((value) => value !== 0, {
    message: `${label} cannot be zero.`,
  });
}

function loanSchema(termKey: "months" | "years") {
  return z.object({
    principal: positiveNumberSchema,
    annualRate: numberSchema.min(0).max(100),
    [termKey]: positiveNumberSchema,
  });
}

function currencyHandler(category: CalculationCategory): ToolHandler {
  return {
    config: config(category, "currency-converter", "Currency Converter", [
      field("amount", "Amount", "number", { placeholder: "100", step: "0.01" }),
      { ...selectField("from", "From", unitOptions.currency.map((item) => [item.value, item.label])), placeholder: "USD" },
      { ...selectField("to", "To", unitOptions.currency.map((item) => [item.value, item.label])), placeholder: "NPR" },
    ]),
    schema: z.object({
      amount: numberSchema,
      from: currencySchema,
      to: currencySchema,
    }),
    calculate: (input) => convertCurrency(input as { amount: number; from: string; to: string }),
  };
}

function unitHandler(
  category: CalculationCategory,
  dimension: keyof typeof unitFactors,
  title: string,
): ToolHandler {
  const units = unitOptions[dimension];

  return {
    config: config(category, title.toLowerCase().replace(/\s+/g, "-"), title, [
      field("value", "Value", "number", { placeholder: "100", step: "0.01" }),
      selectField("from", "From", units.map((item) => [item.value, item.label])),
      selectField("to", "To", units.map((item) => [item.value, item.label])),
    ]),
    schema: z.object({
      value: numberSchema,
      from: z.string().trim().min(1),
      to: z.string().trim().min(1),
    }),
    calculate: (input) => convertUnit(dimension, input as { value: number; from: string; to: string }),
  };
}

function temperatureHandler(): ToolHandler {
  return {
    config: config("conversion", "temperature-converter", "Temperature Converter", [
      field("value", "Value", "number", { placeholder: "32", step: "0.01" }),
      selectField("from", "From", unitOptions.temperature.map((item) => [item.value, item.label])),
      selectField("to", "To", unitOptions.temperature.map((item) => [item.value, item.label])),
    ]),
    schema: z.object({
      value: numberSchema,
      from: z.enum(["celsius", "fahrenheit", "kelvin"]),
      to: z.enum(["celsius", "fahrenheit", "kelvin"]),
    }),
    calculate: (input) => convertTemperature(input as { value: number; from: string; to: string }),
  };
}

function calculateAge(input: { dateOfBirth: string; asOf?: string }) {
  const birthDate = parseDate(input.dateOfBirth);
  const asOfDate = input.asOf ? parseDate(input.asOf) : new Date();

  if (birthDate > asOfDate) {
    throw new ApiError("Date of birth cannot be after the as-of date.", 400);
  }

  let years = asOfDate.getUTCFullYear() - birthDate.getUTCFullYear();
  let months = asOfDate.getUTCMonth() - birthDate.getUTCMonth();
  let days = asOfDate.getUTCDate() - birthDate.getUTCDate();

  if (days < 0) {
    months -= 1;
    days += new Date(Date.UTC(asOfDate.getUTCFullYear(), asOfDate.getUTCMonth(), 0)).getUTCDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalDays = Math.floor((startOfDay(asOfDate).getTime() - startOfDay(birthDate).getTime()) / 86_400_000);

  return result("Age", `${years} years, ${months} months, ${days} days`, undefined, {
    years,
    months,
    days,
    totalDays,
    asOf: formatDate(asOfDate),
  });
}

function calculateBMI(input: { weightKg: number; heightCm: number }) {
  const bmi = input.weightKg / (input.heightCm / 100) ** 2;
  const rounded = round(bmi, 1);

  return result("BMI", String(rounded), undefined, {
    category: rounded < 18.5 ? "Underweight" : rounded < 25 ? "Normal weight" : rounded < 30 ? "Overweight" : "Obese",
    weightKg: input.weightKg,
    heightCm: input.heightCm,
  });
}

function calculatePercentage(input: Record<string, unknown>) {
  if (input.mode === "percentageOf") {
    const value = round((Number(input.percentage) / 100) * Number(input.value));
    return result("Result", String(value), undefined, { expression: `${input.percentage}% of ${input.value}` });
  }

  if (input.mode === "whatPercent") {
    const value = round((Number(input.part) / Number(input.total)) * 100);
    return result("Result", String(value), "%", { expression: `${input.part} of ${input.total}` });
  }

  const value = round(((Number(input.to) - Number(input.from)) / Number(input.from)) * 100);
  return result("Result", String(value), "%", {
    expression: `Change from ${input.from} to ${input.to}`,
    direction: value > 0 ? "increase" : value < 0 ? "decrease" : "no change",
  });
}

function calculateGST(input: { amount: number; rate: number; mode: "add" | "remove" }) {
  if (input.mode === "remove") {
    const baseAmount = input.amount / (1 + input.rate / 100);
    const gstAmount = input.amount - baseAmount;
    return result("Base amount", money(baseAmount), undefined, {
      gstAmount: money(gstAmount),
      grossAmount: money(input.amount),
      rate: input.rate,
    });
  }

  const gstAmount = input.amount * (input.rate / 100);
  const grossAmount = input.amount + gstAmount;
  return result("Total amount", money(grossAmount), undefined, {
    baseAmount: money(input.amount),
    gstAmount: money(gstAmount),
    rate: input.rate,
  });
}

function calculateEMI(input: { principal: number; annualRate: number; months: number }) {
  const monthlyRate = input.annualRate / 12 / 100;
  const emi = monthlyRate === 0
    ? input.principal / input.months
    : (input.principal * monthlyRate * (1 + monthlyRate) ** input.months) /
      ((1 + monthlyRate) ** input.months - 1);
  const totalPayment = emi * input.months;

  return result("Monthly EMI", money(emi), undefined, {
    principal: money(input.principal),
    totalPayment: money(totalPayment),
    totalInterest: money(totalPayment - input.principal),
    months: input.months,
  });
}

function convertCurrency(input: { amount: number; from: string; to: string }) {
  const fromRate = currencyRatesToUsd[input.from as keyof typeof currencyRatesToUsd];
  const toRate = currencyRatesToUsd[input.to as keyof typeof currencyRatesToUsd];

  if (!fromRate || !toRate) {
    throw new ApiError("Unsupported currency code.", 400, {
      supportedCurrencies: Object.keys(currencyRatesToUsd),
    });
  }

  const convertedAmount = (input.amount * fromRate) / toRate;

  return result("Converted amount", money(convertedAmount), input.to, {
    amount: input.amount,
    from: input.from,
    to: input.to,
    rate: round(fromRate / toRate, 8),
    source: "fallback-rates",
  });
}

function convertUnit(
  dimension: keyof typeof unitFactors,
  input: { value: number; from: string; to: string },
) {
  const factors = unitFactors[dimension] as Record<string, number>;
  const fromFactor = factors[input.from];
  const toFactor = factors[input.to];

  if (!fromFactor || !toFactor) {
    throw new ApiError("Unsupported unit.", 400, { supportedUnits: Object.keys(factors) });
  }

  const converted = (input.value * fromFactor) / toFactor;
  return result("Converted value", String(round(converted, 6)), input.to, {
    value: input.value,
    from: input.from,
    to: input.to,
    dimension,
  });
}

function convertTemperature(input: { value: number; from: string; to: string }) {
  const celsius =
    input.from === "fahrenheit"
      ? (input.value - 32) * (5 / 9)
      : input.from === "kelvin"
        ? input.value - 273.15
        : input.value;
  const converted =
    input.to === "fahrenheit"
      ? celsius * (9 / 5) + 32
      : input.to === "kelvin"
        ? celsius + 273.15
        : celsius;

  return result("Converted temperature", String(round(converted, 4)), input.to, {
    value: input.value,
    from: input.from,
    to: input.to,
  });
}

function convertTimeZone(input: { datetime: string; fromZone: string; toZone: string }) {
  const normalized = input.datetime.length === 16 ? `${input.datetime}:00` : input.datetime;
  const utcDate = zonedTimeToDate(normalized, input.fromZone);
  const converted = new Intl.DateTimeFormat("en-CA", {
    timeZone: input.toZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(utcDate);

  return result("Converted time", converted, input.toZone, {
    fromZone: input.fromZone,
    toZone: input.toZone,
    iso: utcDate.toISOString(),
  });
}

function calculateScientific(input: { expression: string }) {
  const parser = new ExpressionParser(input.expression);
  const value = parser.parse();

  return result("Result", String(round(value, 10)), undefined, {
    expression: input.expression,
  });
}

function calculateDateDifference(input: { startDate: string; endDate: string }) {
  const start = startOfDay(parseDate(input.startDate));
  const end = startOfDay(parseDate(input.endDate));
  const totalDays = Math.abs(Math.round((end.getTime() - start.getTime()) / 86_400_000));

  return result("Difference", `${totalDays} days`, undefined, {
    totalDays,
    weeks: round(totalDays / 7, 2),
    monthsApprox: round(totalDays / 30.436875, 2),
    yearsApprox: round(totalDays / 365.2425, 2),
  });
}

function calculateFuelCost(input: { distance: number; mileage: number; fuelPrice: number }) {
  const fuelNeeded = input.distance / input.mileage;
  const totalCost = fuelNeeded * input.fuelPrice;

  return result("Fuel cost", money(totalCost), undefined, {
    fuelNeeded: round(fuelNeeded, 3),
    distance: input.distance,
    mileage: input.mileage,
    fuelPrice: input.fuelPrice,
  });
}

function convertNepaliDate(input: { date: string; direction: "ad-to-bs" | "bs-to-ad" }) {
  const epochAd = Date.UTC(1944, 0, 1);
  const epochYear = 2000;
  const epochMonth = 9;
  const epochDay = 17;
  const averageYearDays = 365.25875;
  const averageMonthDays = averageYearDays / 12;

  if (input.direction === "bs-to-ad") {
    const [year, month, day] = parseDateParts(input.date);
    const epochMonthIndex = epochYear * 12 + (epochMonth - 1);
    const inputMonthIndex = year * 12 + (month - 1);
    const diffDays = (inputMonthIndex - epochMonthIndex) * averageMonthDays + (day - epochDay);
    const adDate = new Date(epochAd + Math.round(diffDays) * 86_400_000);

    return result("AD date", formatDate(adDate), undefined, {
      input: input.date,
      approximate: true,
    });
  }

  const adDate = parseDate(input.date);
  const diffDays = Math.round((adDate.getTime() - epochAd) / 86_400_000);
  const epochMonthIndex = epochYear * 12 + (epochMonth - 1);
  const monthPosition = epochMonthIndex + (epochDay - 1 + diffDays) / averageMonthDays;
  const monthIndex = Math.floor(monthPosition);
  const day = Math.floor((monthPosition - monthIndex) * averageMonthDays) + 1;

  return result("BS date", `${Math.floor(monthIndex / 12)}-${pad((monthIndex % 12) + 1)}-${pad(day)}`, undefined, {
    input: input.date,
    approximate: true,
  });
}

function zonedTimeToDate(value: string, timeZone: string) {
  const localGuess = new Date(value);

  if (Number.isNaN(localGuess.getTime())) {
    throw new ApiError("Invalid date and time.", 400);
  }

  const offset = getTimeZoneOffset(localGuess, timeZone);
  return new Date(localGuess.getTime() - offset);
}

function getTimeZoneOffset(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const data = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const asUtc = Date.UTC(
    Number(data.year),
    Number(data.month) - 1,
    Number(data.day),
    Number(data.hour),
    Number(data.minute),
    Number(data.second),
  );

  return asUtc - date.getTime();
}

function parseDate(value: string) {
  const date = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) {
    throw new ApiError("Invalid date.", 400);
  }

  return date;
}

function parseDateParts(value: string) {
  const parts = value.split("-").map(Number);

  if (parts.length !== 3 || parts.some((part) => !Number.isFinite(part))) {
    throw new ApiError("Date must use YYYY-MM-DD format.", 400);
  }

  return parts as [number, number, number];
}

function startOfDay(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function result(
  title: string,
  value: string,
  unit?: string,
  details?: Record<string, string | number | boolean>,
): ToolResult {
  return { title, value, unit, details };
}

function round(value: number, decimals = 6) {
  return Number(value.toFixed(decimals));
}

function money(value: number) {
  return String(round(value, 2));
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

class ExpressionParser {
  private index = 0;

  constructor(private readonly expression: string) {}

  parse() {
    const value = this.parseExpression();
    this.skipWhitespace();

    if (this.index < this.expression.length) {
      throw new ApiError("Unsupported expression syntax.", 400);
    }

    return value;
  }

  private parseExpression() {
    let value = this.parseTerm();

    while (true) {
      this.skipWhitespace();

      if (this.match("+")) value += this.parseTerm();
      else if (this.match("-")) value -= this.parseTerm();
      else return value;
    }
  }

  private parseTerm() {
    let value = this.parsePower();

    while (true) {
      this.skipWhitespace();

      if (this.match("*")) value *= this.parsePower();
      else if (this.match("/")) value /= this.parsePower();
      else return value;
    }
  }

  private parsePower() {
    let value = this.parseFactor();
    this.skipWhitespace();

    if (this.match("^")) {
      value **= this.parsePower();
    }

    return value;
  }

  private parseFactor(): number {
    this.skipWhitespace();

    if (this.match("+")) return this.parseFactor();
    if (this.match("-")) return -this.parseFactor();
    if (this.match("(")) {
      const value = this.parseExpression();
      this.expect(")");
      return value;
    }

    const functionName = this.readIdentifier();

    if (functionName) {
      this.expect("(");
      const value = this.parseExpression();
      this.expect(")");
      return applyMathFunction(functionName, value);
    }

    return this.readNumber();
  }

  private readIdentifier() {
    const match = /^[a-z]+/i.exec(this.expression.slice(this.index));

    if (!match) return "";

    this.index += match[0].length;
    return match[0].toLowerCase();
  }

  private readNumber() {
    const match = /^\d+(\.\d+)?/.exec(this.expression.slice(this.index));

    if (!match) {
      throw new ApiError("Expected a number.", 400);
    }

    this.index += match[0].length;
    return Number(match[0]);
  }

  private match(token: string) {
    if (this.expression[this.index] !== token) return false;
    this.index += 1;
    return true;
  }

  private expect(token: string) {
    this.skipWhitespace();

    if (!this.match(token)) {
      throw new ApiError(`Expected ${token}.`, 400);
    }
  }

  private skipWhitespace() {
    while (/\s/.test(this.expression[this.index] ?? "")) {
      this.index += 1;
    }
  }
}

function applyMathFunction(name: string, value: number) {
  if (name === "sqrt") return Math.sqrt(value);
  if (name === "sin") return Math.sin(value);
  if (name === "cos") return Math.cos(value);
  if (name === "tan") return Math.tan(value);
  if (name === "log") return Math.log10(value);
  if (name === "ln") return Math.log(value);
  if (name === "abs") return Math.abs(value);

  throw new ApiError(`Unsupported function: ${name}.`, 400);
}
