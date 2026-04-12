# 기업 궁합 테스트

나와 기업의 궁합을 확인하는 엔터테인먼트 웹앱입니다.

## 기술 스택

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Vercel 배포 지원

## 실행 방법

```bash
npm install
npm run dev
```

http://localhost:3000 에서 확인

## 빌드

```bash
npm run build
npm start
```

## 기업 추가 방법

`data/companies.ts` 파일의 배열에 새 객체를 추가하세요:

```typescript
{
  id: 21,                          // 고유 ID
  name_kr: "새 기업",               // 한국어 이름
  slug: "new-company",             // URL용 슬러그 (영문, 하이픈)
  founded_date: "2000-01-01",      // 설립일 (YYYY-MM-DD)
  industry: "tech",                // 산업군
}
```

사용 가능한 산업군 (`lib/types.ts`):
- `tech` — IT/반도체
- `finance` — 금융
- `energy` — 에너지
- `manufacturing` — 제조
- `bio` — 바이오
- `telecom` — 통신
- `construction` — 건설
- `retail` — 유통

새 산업군 추가 시 `lib/types.ts`의 `Industry` 타입과 `lib/compatibility.ts`의 `industryModifier`에도 추가하세요.

## 주의사항

- 본 서비스는 엔터테인먼트 목적의 콘텐츠입니다
- 투자 자문 또는 금융 상품 추천이 아닙니다
- 개인정보를 수집하거나 저장하지 않습니다
