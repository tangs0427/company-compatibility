import type { Metadata } from "next";
import Link from "next/link";

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
              본 서비스는 별도의 개인정보를 저장하지 않습니다. 사용자가 입력한
              생년월일, 태어난 시간, 기업 선택 정보는 결과를 계산하는 데에만
              사용되며 서버에 영구 저장되지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-800 mb-2">2. 데이터 처리 방식</h2>
            <p>
              본 서비스는 회원가입, 로그인, 데이터베이스 저장 기능을 제공하지
              않습니다. 쿠키나 로컬 스토리지를 통해 민감한 개인정보를 별도로
              보관하지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-800 mb-2">3. 서비스 성격</h2>
            <p>
              본 서비스는 엔터테인먼트 목적의 콘텐츠입니다. 투자 자문이나 금융상품
              추천을 위한 서비스가 아니며, 모든 판단과 책임은 이용자 본인에게
              있습니다.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-800 mb-2">4. 문의</h2>
            <p>
              서비스 관련 문의가 있다면 운영 채널을 통해 연락해주세요.
            </p>
          </section>
        </div>

        <Link
          href="/"
          className="block text-center py-3 rounded-xl bg-violet-100 text-violet-700 font-medium text-sm hover:bg-violet-200 transition-colors"
        >
          메인으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
