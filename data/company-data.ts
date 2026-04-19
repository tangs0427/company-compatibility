import { Company } from "@/lib/types";
import { companies as fallbackCompanies } from "./companies";
import { generatedCompanies } from "./companies.generated";

const LEGACY_SLUG_ALIASES: Record<string, string> = {
  "samsung-electronics": "stock-005930",
  "sk-hynix": "stock-000660",
  "hyundai-motor": "stock-005380",
  "lg-energy-solution": "stock-373220",
  kakao: "stock-035720",
  naver: "stock-035420",
  celltrion: "stock-068270",
  "posco-holdings": "stock-005490",
  "kb-financial": "stock-105560",
  "samsung-sdi": "stock-006400",
  "hyundai-mobis": "stock-012330",
  "lg-chem": "stock-051910",
  kia: "stock-000270",
  "shinhan-financial": "stock-055550",
  "samsung-biologics": "stock-207940",
  "hana-financial": "stock-086790",
  "sk-innovation": "stock-096770",
  kepco: "stock-015760",
  kt: "stock-030200",
  "samsung-ct": "stock-028260",
};

function dedupeCompanies(items: Company[]): Company[] {
  const seen = new Set<string>();

  return items.filter((company) => {
    const key = company.stock_code ?? company.slug;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

const sourceCompanies =
  generatedCompanies.length > 0 ? generatedCompanies : fallbackCompanies;

export const companies: Company[] = dedupeCompanies(sourceCompanies);

export function findCompanyBySlug(slug: string): Company | undefined {
  return (
    companies.find((company) => company.slug === slug) ??
    companies.find((company) => company.slug === LEGACY_SLUG_ALIASES[slug])
  );
}
