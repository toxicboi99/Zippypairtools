import type { BMIRequest } from "@/validators/calculator.validator";

export function calculateBMI(input: BMIRequest) {
  const heightMeters = input.heightCm / 100;
  const bmi = input.weightKg / heightMeters ** 2;
  const roundedBmi = Number(bmi.toFixed(1));

  return {
    bmi: roundedBmi,
    category: getBMICategory(roundedBmi),
    weightKg: input.weightKg,
    heightCm: input.heightCm,
  };
}

function getBMICategory(bmi: number) {
  if (bmi < 18.5) {
    return "Underweight";
  }

  if (bmi < 25) {
    return "Normal weight";
  }

  if (bmi < 30) {
    return "Overweight";
  }

  return "Obese";
}
