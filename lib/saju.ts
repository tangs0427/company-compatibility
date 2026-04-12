import { SajuProfile, ElementRelation, SajuAnalysis } from "./types";

// 천간 (10 Heavenly Stems) - indexed by year % 10
const STEMS = ["경", "신", "임", "계", "갑", "을", "병", "정", "무", "기"] as const;

// 지지 (12 Earthly Branches) - indexed by year % 12
const BRANCHES = ["신", "유", "술", "해", "자", "축", "인", "묘", "진", "사", "오", "미"] as const;

// 띠 동물
const ANIMALS = [
  "원숭이", "닭", "개", "돼지", "쥐", "소",
  "호랑이", "토끼", "용", "뱀", "말", "양",
] as const;

// 천간 → 오행 매핑
const STEM_TO_ELEMENT: Record<string, string> = {
  갑: "목", 을: "목",
  병: "화", 정: "화",
  무: "토", 기: "토",
  경: "금", 신: "금",
  임: "수", 계: "수",
};

const ELEMENT_NAMES: Record<string, string> = {
  목: "나무", 화: "불", 토: "흙", 금: "쇠", 수: "물",
};

// 상생 순환: 목→화→토→금→수→목
const PRODUCING_ORDER = ["목", "화", "토", "금", "수"];

// 상극 순환: 목→토→수→화→금→목
const OVERCOMING_ORDER = ["목", "토", "수", "화", "금"];

export function getSajuProfile(year: number): SajuProfile {
  const stemIdx = year % 10;
  const branchIdx = year % 12;
  const stem = STEMS[stemIdx];
  const branch = BRANCHES[branchIdx];
  const element = STEM_TO_ELEMENT[stem];

  return {
    stem,
    branch,
    element,
    elementName: ELEMENT_NAMES[element],
    animal: ANIMALS[branchIdx],
  };
}

function getElementRelation(a: string, b: string): ElementRelation {
  if (a === b) return "비화";

  const aIdx = PRODUCING_ORDER.indexOf(a);
  const bIdx = PRODUCING_ORDER.indexOf(b);

  // a가 b를 생하거나 b가 a를 생하면 상생
  if ((aIdx + 1) % 5 === bIdx || (bIdx + 1) % 5 === aIdx) {
    return "상생";
  }

  return "상극";
}

const RELATION_DESCS: Record<ElementRelation, (user: SajuProfile, company: SajuProfile) => string> = {
  상생: (user, company) => {
    const aIdx = PRODUCING_ORDER.indexOf(user.element);
    const bIdx = PRODUCING_ORDER.indexOf(company.element);
    if ((aIdx + 1) % 5 === bIdx) {
      return `${user.elementName}(${user.element})이(가) ${company.elementName}(${company.element})을(를) 살리는 상생 관계입니다. 당신의 에너지가 기업에 활력을 불어넣을 수 있는 흐름입니다.`;
    }
    return `${company.elementName}(${company.element})이(가) ${user.elementName}(${user.element})을(를) 살리는 상생 관계입니다. 기업의 기운이 당신의 성장을 자연스럽게 도울 수 있습니다.`;
  },
  상극: (user, company) =>
    `${user.elementName}(${user.element})과(와) ${company.elementName}(${company.element})은(는) 상극 관계입니다. 서로 다른 기운이 부딪히며 긴장감이 생기지만, 적절히 조화를 이루면 오히려 강한 추진력이 됩니다.`,
  비화: (user, company) =>
    `같은 ${user.elementName}(${user.element})의 기운을 가진 비화 관계입니다. 동질적 에너지가 만나 안정감이 높지만, 때로는 변화의 자극이 필요할 수 있습니다.`,
};

export function analyzeSaju(userYear: number, companyYear: number): SajuAnalysis {
  const user = getSajuProfile(userYear);
  const company = getSajuProfile(companyYear);
  const relation = getElementRelation(user.element, company.element);

  return {
    user,
    company,
    relation,
    relationDesc: RELATION_DESCS[relation](user, company),
  };
}
