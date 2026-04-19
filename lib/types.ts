export type Industry =
  | "tech"
  | "finance"
  | "energy"
  | "manufacturing"
  | "bio"
  | "telecom"
  | "construction"
  | "retail"
  | "service";

export interface Company {
  id: number;
  name_kr: string;
  slug: string;
  founded_date: string; // YYYY-MM-DD
  industry: Industry;
  stock_code?: string;
  market?: string;
}

export interface InterpretationCard {
  title: string;
  description: string;
}

export interface SajuProfile {
  stem: string; // 천간 (갑을병정무기경신임계)
  branch: string; // 지지 (자축인묘진사오미신유술해)
  element: string; // 오행 (목화토금수)
  elementName: string; // 한글 풀네임 (나무, 불, 흙, 쇠, 물)
  animal: string; // 띠 동물
}

export type ElementRelation = "상생" | "상극" | "비화";

export interface SajuAnalysis {
  user: SajuProfile;
  company: SajuProfile;
  relation: ElementRelation;
  relationDesc: string;
}

export interface CompatibilityResult {
  score: number;
  type: string;
  summary: string;
  cards: InterpretationCard[];
  saju: SajuAnalysis;
}
