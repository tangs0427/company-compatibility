import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { companies } from "@/data/companies";
import { calculateCompatibility } from "@/lib/compatibility";
import ResultCard from "@/components/ResultCard";
import SajuCard from "@/components/SajuCard";
import ScoreExplanation from "@/components/ScoreExplanation";
import Disclaimer from "@/components/Disclaimer";
import AdBanner from "@/components/AdBanner";
import ShareButtons from "@/components/ShareButtons";

function getParticle(name: string): string {
  const lastChar = name.charCodeAt(name.length - 1);
  // Korean syllable range: 0xAC00 ~ 0xD7A3
  if (lastChar >= 0xac00 && lastChar <= 0xd7a3) {
    return (lastChar - 0xac00) % 28 > 0 ? "과" : "와";
  }
  return "과";
}

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function parseParams(searchParams: {
  [key: string]: string | string[] | undefined;
}) {
  const birth = typeof searchParams.birth === "string" ? searchParams.birth : null;
  const time = typeof searchParams.time === "string" ? searchParams.time : null;
  const companySlug =
    typeof searchParams.company === "string" ? searchParams.company : null;

  if (!birth || !companySlug || birth.length !== 8) return null;

  const year = parseInt(birth.substring(0, 4), 10);
  const month = parseInt(birth.substring(4, 6), 10);
  const day = parseInt(birth.substring(6, 8), 10);

  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  const company = companies.find((c) => c.slug === companySlug);
  if (!company) return null;

  const bucket = time !== null ? parseInt(time, 10) : null;
  const hourBucket =
    bucket !== null && !isNaN(bucket) && bucket >= 0 && bucket <= 11 ? bucket : null;

  return { year, month, day, hourBucket, company };
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const params = await searchParams;
  const parsed = parseParams(params);

  if (!parsed) {
    return { title: "기업 궁합 테스트" };
  }

  const result = calculateCompatibility(
    parsed.year,
    parsed.month,
    parsed.day,
    parsed.hourBucket,
    parsed.company
  );

  const particle = getParticle(parsed.company.name_kr);

  return {
    title: `${parsed.company.name_kr}${particle} 궁합 ${result.score}점`,
    description: "생각보다 잘 맞는데?",
    openGraph: {
      title: `${parsed.company.name_kr}${particle} 궁합 ${result.score}점`,
      description: "생각보다 잘 맞는데?",
      images: ["/og-default.svg"],
    },
  };
}

export default async function ResultPage({ searchParams }: Props) {
  const params = await searchParams;
  const parsed = parseParams(params);

  if (!parsed) {
    redirect("/");
  }

  const result = calculateCompatibility(
    parsed.year,
    parsed.month,
    parsed.day,
    parsed.hourBucket,
    parsed.company
  );

  const scoreColor =
    result.score >= 75
      ? "text-violet-600"
      : result.score >= 50
        ? "text-blue-500"
        : "text-gray-500";

  return (
    <div className="min-h-[80vh] flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Score Section */}
        <div className="text-center animate-fade-in-up">
          <p className="text-sm text-gray-500 mb-1">
            {parsed.company.name_kr}{getParticle(parsed.company.name_kr)}의 궁합
          </p>
          <div className={`text-7xl font-bold ${scoreColor} animate-score-pop`}>
            {result.score}
            <span className="text-3xl">점</span>
          </div>
          <div className="mt-2 inline-block px-4 py-1 rounded-full bg-violet-100 text-violet-700 text-sm font-medium">
            {result.type}
          </div>
        </div>

        {/* Summary */}
        <p className="text-center text-gray-600 text-sm animate-fade-in-up delay-100">
          {result.summary}
        </p>

        {/* Cards */}
        <div className="space-y-3">
          {result.cards.map((card, i) => (
            <ResultCard key={i} card={card} index={i} />
          ))}
        </div>

        {/* Saju Analysis */}
        <SajuCard saju={result.saju} companyName={parsed.company.name_kr} />

        {/* Score Explanation Accordion */}
        <ScoreExplanation />

        {/* AdSense */}
        <AdBanner slot="4103016284" />

        {/* Share */}
        <ShareButtons />

        {/* Disclaimer */}
        <Disclaimer />
      </div>
    </div>
  );
}
