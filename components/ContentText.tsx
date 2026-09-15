import { isTodo } from "@/lib/content";

/**
 * 콘텐츠 문자열을 그린다.
 *
 * 아직 채워지지 않은 값("TODO: ...")은 감추지 않고 눈에 띄게 표시한다.
 * 비어 보이는 사이트가 완성된 척하는 사이트보다 낫고, 무엇을 채워야 하는지
 * 화면만 봐도 알 수 있어야 하기 때문이다 (CLAUDE.md §4-2).
 */
export default function ContentText({ value }: { value: string }) {
  if (!isTodo(value)) return <>{value}</>;

  return (
    <span className="rounded border border-dashed border-flag-line bg-flag-bg px-1.5 py-0.5 text-[0.9em] text-flag-ink">
      {value}
    </span>
  );
}
