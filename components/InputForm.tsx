"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { companies } from "@/data/companies";

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

  const days = useMemo(() => {
    if (!year || !month) return Array.from({ length: 31 }, (_, i) => i + 1);
    const max = getDaysInMonth(Number(year), Number(month));
    return Array.from({ length: max }, (_, i) => i + 1);
  }, [year, month]);

  const filteredCompanies = useMemo(() => {
    if (!search) return companies;
    return companies.filter((c) =>
      c.name_kr.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const selectedCompany = companies.find((c) => c.slug === companySlug);

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
      {/* Birth Date */}
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
            <option value="">년도</option>
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

      {/* Birth Time (시진) */}
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
          {HOUR_BUCKETS.map((b) => (
            <option key={b.value} value={b.value}>
              {b.label}
            </option>
          ))}
        </select>
      </div>

      {/* Company Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          기업 선택 <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="기업명을 검색하세요"
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
          {showDropdown && (
            <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
              {filteredCompanies.length === 0 ? (
                <li className="px-3 py-2 text-sm text-gray-400">
                  검색 결과가 없습니다
                </li>
              ) : (
                filteredCompanies.map((c) => (
                  <li
                    key={c.id}
                    onMouseDown={() => {
                      setCompanySlug(c.slug);
                      setSearch("");
                      setShowDropdown(false);
                    }}
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-violet-50 transition-colors"
                  >
                    {c.name_kr}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}

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
