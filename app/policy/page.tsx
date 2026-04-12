import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보 처리방침 - 기업 궁합 테스트",
};

export default function PolicyPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center">개인정보 처리방침</h1>

        <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="font-semibold text-gray-800 mb-2">
              1. 수집하는 개인정보
            </h2>
            <p>
              본 서비스는 별도의 개인정보를 수집하지 않습니다. 사용자가 입력하는
              생년월일, 태어난 시간, 기업 선택 정보는 서버에 저장되지 않으며,
              브라우저에서 즉시 처리된 후 폐기됩니다.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-800 mb-2">2. 데이터 저장</h2>
            <p>
              본 서비스는 데이터베이스를 사용하지 않습니다. 로그인 기능이 없으며,
              쿠키나 로컬 스토리지에 사용자 정보를 저장하지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-800 mb-2">
              3. 서비스 성격
            </h2>
            <p>
              본 서비스는 엔터테인먼트 목적의 콘텐츠입니다. 투자 자문 또는 금융
              상품 추천이 아니며, 모든 판단과 책임은 이용자 본인에게 있습니다.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-800 mb-2">4. 문의</h2>
            <p>
              서비스 관련 문의사항이 있으시면 서비스 운영자에게 연락해주세요.
            </p>
          </section>
        </div>

        <a
          href="/"
          className="block text-center py-3 rounded-xl bg-violet-100 text-violet-700 font-medium text-sm hover:bg-violet-200 transition-colors"
        >
          홈으로 돌아가기
        </a>
      </div>
    </div>
  );
}
