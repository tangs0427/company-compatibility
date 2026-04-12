import { Company, CompatibilityResult, Industry } from "./types";
import { getInterpretation } from "./interpretation";
import { analyzeSaju } from "./saju";

const HOUR_BUCKETS: [number, number, string][] = [
  [23, 1, "자"],
  [1, 3, "축"],
  [3, 5, "인"],
  [5, 7, "묘"],
  [7, 9, "진"],
  [9, 11, "사"],
  [11, 13, "오"],
  [13, 15, "미"],
  [15, 17, "신"],
  [17, 19, "유"],
  [19, 21, "술"],
  [21, 23, "해"],
];

export function getHourBucketIndex(hour: number): number {
  if (hour === 23 || hour === 0) return 0;
  if (hour >= 1 && hour < 3) return 1;
  if (hour >= 3 && hour < 5) return 2;
  if (hour >= 5 && hour < 7) return 3;
  if (hour >= 7 && hour < 9) return 4;
  if (hour >= 9 && hour < 11) return 5;
  if (hour >= 11 && hour < 13) return 6;
  if (hour >= 13 && hour < 15) return 7;
  if (hour >= 15 && hour < 17) return 8;
  if (hour >= 17 && hour < 19) return 9;
  if (hour >= 19 && hour < 21) return 10;
  return 11; // 21~23
}

export function getHourBucketName(hour: number): string {
  const index = getHourBucketIndex(hour);
  return HOUR_BUCKETS[index][2];
}

function distanceScore(a: number, b: number, max: number): number {
  const diff = Math.abs(a - b);
  return 1 - diff / max;
}

const industryModifier: Record<Industry, (score: number) => number> = {
  tech: (score) => (score > 60 ? 5 : -5),
  finance: () => 0,
  energy: (score) => (score < 60 ? 5 : -5),
  manufacturing: () => 2,
  bio: (score) => (score > 50 ? 3 : -3),
  telecom: () => 1,
  construction: (score) => (score > 55 ? 2 : -2),
  retail: () => 0,
};

function getCompatibilityType(score: number): string {
  if (score < 40) return "고변동형";
  if (score < 60) return "변동형";
  if (score < 75) return "균형형";
  if (score < 90) return "안정형";
  return "성장형";
}

export function calculateCompatibility(
  birthYear: number,
  birthMonth: number,
  birthDay: number,
  birthHourBucket: number | null,
  company: Company
): CompatibilityResult {
  const companyDate = new Date(company.founded_date);
  const companyYear = companyDate.getFullYear();
  const companyMonth = companyDate.getMonth() + 1;
  const companyDay = companyDate.getDate();

  // Step 2: Convert to cycles
  const userYearIndex = birthYear % 12;
  const companyYearIndex = companyYear % 12;
  const userDayIndex = birthDay % 12;
  const companyDayIndex = companyDay % 12;

  // Step 3: Distance scoring
  const yearScore = distanceScore(userYearIndex, companyYearIndex, 12);
  const monthScore = distanceScore(birthMonth, companyMonth, 12);
  const dayScore = distanceScore(userDayIndex, companyDayIndex, 12);

  // Step 4: Hour bonus — company hour = user's birth hour (same bucket)
  let hourScore = 0;
  if (birthHourBucket !== null) {
    const companyHourBucket = getHourBucketIndex(companyDay % 24);
    hourScore = distanceScore(birthHourBucket, companyHourBucket, 12);
  }

  // Step 5 & 6: Weighted sum + industry modifier
  const baseScore =
    (yearScore * 0.3 + monthScore * 0.3 + dayScore * 0.3 + hourScore * 0.1) *
    100;

  const modifier = industryModifier[company.industry](baseScore);
  const finalScore = Math.round(
    Math.max(0, Math.min(100, baseScore + modifier))
  );

  const type = getCompatibilityType(finalScore);
  const interpretation = getInterpretation(type, company.name_kr);
  const saju = analyzeSaju(birthYear, companyDate.getFullYear());

  return {
    score: finalScore,
    type,
    summary: interpretation.summary,
    cards: interpretation.cards,
    saju,
  };
}
