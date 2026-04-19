"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { companies } from "@/data/company-data";
import { Company } from "@/lib/types";

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

const HOUR_BUCKETS = [
  { value: "0", label: "자시 (23:00 ~ 01:00)" },
  { value: "1", label: "축시 (01:00 ~ 03:00)" },
  { value: "2", label: "인시 (03:00 ~ 05:00)" },
  { value: "3", label: "묘시 (05:00 ~ 07:00)" },
  { value: "4", label: "진시 (07:00 ~ 09:00)" },
  { value: "5", label: "사시 (09:00 ~ 11:00)" },
  { value: "6", label: "오시 (11:00 ~ 13:00)" },
  { value: "7", label: "미시 (13:00 ~ 15:00)" },
  { value: "8", label: "신시 (15:00 ~ 17:00)" },
  { value: "9", label: "유시 (17:00 ~ 19:00)" },
  { value: "10", label: "술시 (19:00 ~ 21:00)" },
  { value: "11", label: "해시 (21:00 ~ 23:00)" },
];

const MAX_VISIBLE_COMPANIES = 120;

function sortCompanies(a: Company, b: Company): number {
  return a.name_kr.localeCompare(b.name_kr, "ko");
}

function getCompanySearchScore(company: Company, rawQuery: string): number {
  const query = rawQuery.trim().toLowerCase();

  if (!query) {
    return 1;
  }

  const name = company.name_kr.toLowerCase();
  const slug = company.slug.toLowerCase();
  const stockCode = (company.stock_code ?? "").toLowerCase();

  let score = 0;

  if (name === query) score += 100;
  if (stockCode === query) score += 90;
  if (name.startsWith(query)) score += 60;
  if (stockCode.startsWith(query)) score += 50;
  if (name.includes(query)) score += 30;
  if (stockCode.includes(query)) score += 20;
  if (slug.includes(query)) score += 10;

  return score;
}

function formatCompanyMeta(company: Company): string {
  return [company.market, company.stock_code].filter(Boolean).join(" · ");
}

export default function InputForm() {
  const router = useRouter();
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [hour, setHour] = useState("");
  const [companySlug, setCompanySlug] = useState("");
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState("");

  const years = useMemo(() => {
    const arr: number[] = [];
    for (let y = 2010; y >= 1950; y--) arr.push(y);
    return arr;
  }, []);

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const normalizedSearch = search.trim();

  const days = useMemo(() => {
    if (!year || !month) return Array.from({ length: 31 }, (_, i) => i + 1);
    const max = getDaysInMonth(Number(year), Number(month));
    return Array.from({ length: max }, (_, i) => i + 1);
  }, [year, month]);

  const filteredCompanies = useMemo(() => {
    if (!normalizedSearch) {
      return [...companies].sort(sortCompanies).slice(0, MAX_VISIBLE_COMPANIES);
    }

    return companies
      .map((company) => ({
        company,
        score: getCompanySearchScore(company, normalizedSearch),
      }))
      .filter((item) => item.score > 0)
      .sort(
        (a, b) => b.score - a.score || sortCompanies(a.company, b.company)
      )
      .slice(0, MAX_VISIBLE_COMPANIES)
      .map((item) => item.company);
  }, [normalizedSearch]);

  const matchCount = useMemo(() => {
    if (!normalizedSearch) {
      return companies.length;
    }

    return companies.reduce((count, company) => {
      return count + (getCompanySearchScore(company, normalizedSearch) > 0 ? 1 : 0);
    }, 0);
  }, [normalizedSearch]);

  const selectedCompany = useMemo(
    () => companies.find((company) => company.slug === companySlug),
    [companySlug]
  );

  function handleSubmit() {
    setError("");

    if (!year || !month || !day) {
      setError("생년월일을 모두 선택해주세요.");
      return;
    }

    if (!companySlug) {
      setError("기업을 선택해주세요.");
      return;
    }

    const m = String(month).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    const birth = `${year}${m}${d}`;

    let url = `/result?birth=${birth}&company=${companySlug}`;
    if (hour !== "") {
      url += `&time=${hour}`;
    }

    router.push(url);
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          생년월일 <span className="text-red-400">*</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          >
            <option value="">연도</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}년
              </option>
            ))}
          </select>
          <select
            value={month}
            onChange={(e) => {
              setMonth(e.target.value);
              setDay("");
            }}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          >
            <option value="">월</option>
            {months.map((m) => (
              <option key={m} value={m}>
                {m}월
              </option>
            ))}
          </select>
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          >
            <option value="">일</option>
            {days.map((d) => (
              <option key={d} value={d}>
                {d}일
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          태어난 시간 <span className="text-gray-400">(선택)</span>
        </label>
        <select
          value={hour}
          onChange={(e) => setHour(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
        >
          <option value="">모름 / 선택 안 함</option>
          {HOUR_BUCKETS.map((bucket) => (
            <option key={bucket.value} value={bucket.value}>
              {bucket.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          기업 선택 <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="회사명 또는 종목코드로 검색해보세요"
            value={selectedCompany ? selectedCompany.name_kr : search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCompanySlug("");
              setShowDropdown(true);
            }}
            onFocus={() => {
              if (selectedCompany) {
                setSearch("");
                setCompanySlug("");
              }
              setShowDropdown(true);
            }}
            onBlur={() => {
              setTimeout(() => setShowDropdown(false), 200);
            }}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
          {showDropdown ? (
            <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
              {filteredCompanies.length === 0 ? (
                <li className="px-3 py-3 text-sm text-gray-400">
                  검색 결과가 없습니다
                </li>
              ) : (
                filteredCompanies.map((company) => {
                  const meta = formatCompanyMeta(company);

                  return (
                    <li
                      key={company.id}
                      onMouseDown={() => {
                        setCompanySlug(company.slug);
                        setSearch("");
                        setShowDropdown(false);
                      }}
                      className="px-3 py-2 cursor-pointer hover:bg-violet-50 transition-colors"
                    >
                      <div className="text-sm text-gray-800">{company.name_kr}</div>
                      {meta ? (
                        <div className="text-xs text-gray-400 mt-0.5">{meta}</div>
                      ) : null}
                    </li>
                  );
                })
              )}
            </ul>
          ) : null}
        </div>
        <p className="px-1 text-xs text-gray-400">
          {normalizedSearch
            ? `검색 일치 ${matchCount.toLocaleString()}개 중 상위 ${Math.min(
                filteredCompanies.length,
                MAX_VISIBLE_COMPANIES
              ).toLocaleString()}개를 보여주고 있어요.`
            : `상장사 전체 ${companies.length.toLocaleString()}개 기준입니다. 회사명 또는 종목코드로 검색해보세요.`}
        </p>
      </div>

      {error ? <p className="text-sm text-red-500 text-center">{error}</p> : null}

      <button
        onClick={handleSubmit}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-500 to-blue-500 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
      >
        궁합 확인하기
      </button>

      <p className="text-xs text-center text-gray-400">
        입력 정보는 저장되지 않습니다
      </p>
    </div>
  );
}
