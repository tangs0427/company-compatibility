import { SajuAnalysis } from "@/lib/types";

interface SajuCardProps {
  saju: SajuAnalysis;
  companyName: string;
}

const RELATION_COLORS = {
  상생: "text-green-600 bg-green-50 border-green-200",
  상극: "text-red-500 bg-red-50 border-red-200",
  비화: "text-blue-500 bg-blue-50 border-blue-200",
};

const ELEMENT_EMOJI: Record<string, string> = {
  목: "🌿",
  화: "🔥",
  토: "🪨",
  금: "⚙️",
  수: "💧",
};

export default function SajuCard({ saju, companyName }: SajuCardProps) {
  const relationStyle = RELATION_COLORS[saju.relation];

  return (
    <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl p-5 shadow-md border border-violet-200 animate-fade-in-up delay-300">
      <h3 className="text-lg font-bold mb-3">🔮 오행 궁합 분석</h3>

      {/* 사주 프로필 비교 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* 사용자 */}
        <div className="bg-white/80 rounded-xl p-3 text-center">
          <p className="text-[11px] text-gray-400 mb-1">나</p>
          <p className="text-2xl mb-1">
            {ELEMENT_EMOJI[saju.user.element]}
          </p>
          <p className="text-sm font-semibold">
            {saju.user.stem}{saju.user.branch}년
          </p>
          <p className="text-xs text-gray-500">
            {saju.user.elementName}({saju.user.element}) · {saju.user.animal}띠
          </p>
        </div>

        {/* 기업 */}
        <div className="bg-white/80 rounded-xl p-3 text-center">
          <p className="text-[11px] text-gray-400 mb-1">{companyName}</p>
          <p className="text-2xl mb-1">
            {ELEMENT_EMOJI[saju.company.element]}
          </p>
          <p className="text-sm font-semibold">
            {saju.company.stem}{saju.company.branch}년
          </p>
          <p className="text-xs text-gray-500">
            {saju.company.elementName}({saju.company.element}) · {saju.company.animal}띠
          </p>
        </div>
      </div>

      {/* 관계 배지 */}
      <div className="flex justify-center mb-3">
        <span
          className={`px-4 py-1.5 rounded-full text-sm font-bold border ${relationStyle}`}
        >
          {saju.relation === "상생" && "💚 "}
          {saju.relation === "상극" && "🔴 "}
          {saju.relation === "비화" && "🔵 "}
          오행 {saju.relation} 관계
        </span>
      </div>

      {/* 해석 */}
      <p className="text-sm text-gray-600 leading-relaxed">
        {saju.relationDesc}
      </p>
    </div>
  );
}
