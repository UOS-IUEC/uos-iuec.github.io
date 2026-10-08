/**
 * 아직 채워지지 않은 값인지 판정한다 (CLAUDE.md §4-2).
 * 화면에서는 감추지 말고 눈에 띄게 표시한다 — 비어 보이는 편이
 * 완성된 것처럼 보이는 것보다 낫다. components/ContentText.tsx 참고.
 *
 * lib/content.ts와 분리해 둔 이유: 클라이언트 컴포넌트가 이 함수만 쓸 때
 * 콘텐츠 JSON과 zod가 브라우저 번들에 딸려 가지 않게 하려는 것이다.
 */
export function isTodo(value: string | null | undefined): boolean {
  return typeof value === "string" && value.startsWith("TODO:");
}
