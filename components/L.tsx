import type { ReactNode } from "react";

import ContentText from "@/components/ContentText";

/**
 * 한/영 텍스트 한 쌍을 그린다. 두 언어를 모두 HTML에 넣고, 선택되지 않은 쪽은
 * CSS(ko: 변형)로 숨긴다. 서버 컴포넌트에서도 쓸 수 있고, 언어를 바꿔도 다시 그릴 필요가 없다.
 * 숨겨진 쪽은 display:none이라 스크린리더도 읽지 않는다.
 *
 *   <L en="Research" ko="연구" />
 *   <L {...area.title} />          // { en, ko } 객체를 그대로 펼쳐 넘긴다
 */
export default function L({ en, ko }: { en: string; ko: string }) {
  return (
    <>
      <span lang="en" className="ko:hidden">
        <ContentText value={en} />
      </span>
      <span lang="ko" className="hidden ko:inline">
        <ContentText value={ko} />
      </span>
    </>
  );
}

/**
 * 언어마다 구조가 다른 블록(목록 등)을 통째로 바꿔 끼울 때 쓴다.
 *   <LBlock en={<ul>…</ul>} ko={<ul>…</ul>} />
 */
export function LBlock({ en, ko }: { en: ReactNode; ko: ReactNode }) {
  return (
    <>
      <div lang="en" className="ko:hidden">
        {en}
      </div>
      <div lang="ko" className="hidden ko:block">
        {ko}
      </div>
    </>
  );
}
