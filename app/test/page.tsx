import InputForm from "@/components/InputForm";

export default function TestPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent mb-2">
          기업 궁합 테스트
        </h1>
        <p className="text-gray-500 text-sm">
          나와 기업의 궁합을 확인해보세요
        </p>
      </div>
      <InputForm />
    </div>
  );
}
