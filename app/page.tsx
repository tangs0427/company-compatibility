"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent mb-2">
            기업 궁합 테스트
          </h1>
          <p className="text-gray-500 text-sm">
            나와 기업의 궁합을 확인해보세요
          </p>
        </div>

        {/* Disclaimer Box */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-4">
          <h2 className="font-bold text-base text-gray-800">
            서비스 이용 안내
          </h2>
          <ul className="space-y-3 text-sm text-gray-600 leading-relaxed">
            <li className="flex gap-2">
              <span className="text-violet-500 shrink-0">•</span>
              본 서비스는 엔터테인먼트 목적의 콘텐츠입니다.
            </li>
            <li className="flex gap-2">
              <span className="text-violet-500 shrink-0">•</span>
              투자 자문, 금융 상품 추천, 매매 권유 등의 목적이 아닙니다.
            </li>
            <li className="flex gap-2">
              <span className="text-violet-500 shrink-0">•</span>
              결과를 근거로 한 투자 판단에 대해 어떠한 책임도 지지 않습니다.
            </li>
            <li className="flex gap-2">
              <span className="text-violet-500 shrink-0">•</span>
              모든 판단과 책임은 이용자 본인에게 있습니다.
            </li>
            <li className="flex gap-2">
              <span className="text-violet-500 shrink-0">•</span>
              입력 정보는 저장되지 않습니다.
            </li>
          </ul>
        </div>

        {/* Checkbox */}
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 w-5 h-5 rounded border-gray-300 text-violet-500 focus:ring-violet-400 accent-violet-500 cursor-pointer"
          />
          <span className="text-sm text-gray-700">
            위 내용을 확인했으며, 본 서비스가 투자 자문이 아님에 동의합니다.
          </span>
        </label>

        {/* CTA */}
        <button
          onClick={() => {
            if (agreed) router.push("/test");
          }}
          disabled={!agreed}
          className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all
            ${
              agreed
                ? "bg-gradient-to-r from-violet-500 to-blue-500 text-white hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
        >
          시작하기
        </button>
      </div>
    </div>
  );
}
