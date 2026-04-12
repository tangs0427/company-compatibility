"use client";

import { useState } from "react";

export default function ScoreExplanation() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full rounded-2xl border border-violet-200 bg-white/60 backdrop-blur-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
      >
        <span className="text-sm font-semibold text-violet-700">
          📊 점수 해석 & 산출 방식
        </span>
        <span
          className={`text-violet-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-4 text-sm text-gray-600 animate-fade-in-up">
          {/* 산출 방식 */}
          <div>
            <h4 className="font-bold text-gray-800 mb-2">🔢 산출 방식</h4>
            <ul className="list-disc list-inside space-y-1 text-xs leading-relaxed">
              <li>
                생년월일을 <strong>12지지 주기</strong>로 변환하여 기업 창립일과 비교
              </li>
              <li>
                연도·월·일 각각의 <strong>거리 점수</strong>를 계산 (가까울수록 높음)
              </li>
              <li>가중 합산: 연도 30% + 월 30% + 일 30% + 시간 10%</li>
              <li>
                업종별 보정값 적용 (IT, 금융, 에너지 등 업종 특성 반영)
              </li>
              <li>
                <strong>오행 분석</strong>: 생년의 천간에서 오행을 도출하여 상생·상극 판별
              </li>
            </ul>
          </div>

          {/* 유형 해석 표 */}
          <div>
            <h4 className="font-bold text-gray-800 mb-2">📋 유형별 해석</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-violet-50">
                    <th className="px-3 py-2 text-left font-semibold text-violet-700 border-b border-violet-200">
                      유형
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-violet-700 border-b border-violet-200">
                      점수
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-violet-700 border-b border-violet-200">
                      의미
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="px-3 py-2 font-medium">🚀 성장형</td>
                    <td className="px-3 py-2">90~100</td>
                    <td className="px-3 py-2">
                      천생연분급 시너지. 함께할수록 서로의 기운이 극대화
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <td className="px-3 py-2 font-medium">🏔️ 안정형</td>
                    <td className="px-3 py-2">75~89</td>
                    <td className="px-3 py-2">
                      탄탄한 인연. 장기 근속 시 빛을 발하는 안정적 궁합
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-3 py-2 font-medium">⚖️ 균형형</td>
                    <td className="px-3 py-2">60~74</td>
                    <td className="px-3 py-2">
                      노력에 따라 달라지는 중립 궁합. 적응기 후 안정
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <td className="px-3 py-2 font-medium">🌊 변동형</td>
                    <td className="px-3 py-2">40~59</td>
                    <td className="px-3 py-2">
                      긴장과 이완이 교차. 유연한 대응이 핵심
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium">🌀 고변동형</td>
                    <td className="px-3 py-2">0~39</td>
                    <td className="px-3 py-2">
                      파란만장한 인연. 도전 속에서 강렬한 성장 가능
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 오행 관계 */}
          <div>
            <h4 className="font-bold text-gray-800 mb-2">🔥 오행 관계</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-violet-50">
                    <th className="px-3 py-2 text-left font-semibold text-violet-700 border-b border-violet-200">
                      관계
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-violet-700 border-b border-violet-200">
                      설명
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="px-3 py-2 font-medium text-green-600">
                      상생
                    </td>
                    <td className="px-3 py-2">
                      목→화→토→금→수 순환. 한쪽이 다른 쪽을 살려주는 조화로운 관계
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <td className="px-3 py-2 font-medium text-red-500">
                      상극
                    </td>
                    <td className="px-3 py-2">
                      서로 다른 기운이 충돌. 긴장감이 있지만 조화 시 강한 추진력
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium text-blue-500">
                      비화
                    </td>
                    <td className="px-3 py-2">
                      같은 오행 기운. 동질적 안정감이 높지만 변화의 자극은 적음
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-[11px] text-gray-400 pt-1">
            * 본 결과는 생년월일 기반 재미 요소이며, 실제 취업·이직 판단의
            근거가 될 수 없습니다.
          </p>
        </div>
      )}
    </div>
  );
}
