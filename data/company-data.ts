import { Company } from "@/lib/types";
import { companies as fallbackCompanies } from "./companies";
import { generatedCompanies } from "./companies.generated";

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
