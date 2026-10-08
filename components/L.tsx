import type { ReactNode } from "react";

import ContentText from "@/components/ContentText";

/*
 * 한/영 텍스트 한 쌍을 그린다. 두 언어를 모두 HTML에 넣고 CSS(ko: 변형)로 하나만 보인다.
 * 서버 컴포넌트에서도 쓸 수 있고, 언어를 바꿔도 다시 그릴 필요가 없다.
 *
 * 기본은 두 언어를 같은 그리드 칸에 겹쳐 두고 안 쓰는 쪽만 visibility:hidden으로 감춘다.
 * 상자가 늘 둘 중 큰 쪽 크기라, 전환해도 줄 수가 바뀌어 아래 내용이 밀리거나
 * 메뉴가 옆으로 움직이지 않는다. 감춘 쪽은 스크린리더가 읽지 않고 포커스도 받지 않는다.
 *
 * 보이는 쪽은 visible로 강제하지 않고 부모의 visibility를 이어받는다.
 * 그래야 닫힌 드롭다운(visibility:hidden) 안의 글자가 새어 나오지 않는다.
 */

const STACK = "[grid-area:1/1]";
const EN_ITEM = `${STACK} ko:invisible`;
const KO_ITEM = `${STACK} invisible ko:[visibility:inherit]`;

type Fit =
  /** 문단·제목·목록처럼 한 줄을 통째로 쓰는 텍스트. 두 언어 중 큰 쪽 크기를 차지한다. */
  | "stack"
  /** 메뉴·버튼·배지. 큰 쪽 크기를 차지하되 글자는 가운데에 놓는다. */
  | "center"
  /** 같은 줄에 다른 글자가 이어지는 짧은 라벨("학부 · 대학", "링크 →").
   *  큰 쪽 폭을 잡으면 빈칸이 생기므로 언어마다 제 폭만 쓴다. 한 줄이라 높이는 변하지 않는다. */
  | "inline";

/**
 *   <L en="Research" ko="연구" />
 *   <L {...area.title} />                       // { en, ko } 객체를 그대로 펼쳐 넘긴다
 *   <L {...item.label} fit="center" />          // 메뉴·버튼·배지
 *   <L {...site.department} fit="inline" /> · <L {...site.university} fit="inline" />
 */
export default function L({ en, ko, fit = "stack" }: { en: string; ko: string; fit?: Fit }) {
  if (fit === "inline") {
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

  return (
    // inline-grid는 바깥의 밑줄(링크 hover 등)을 물려받지 않으므로 직접 이어 받는다
    <span
      className={`inline-grid [text-decoration:inherit] ${fit === "center" ? "justify-items-center" : ""}`}
    >
      <span lang="en" className={EN_ITEM}>
        <ContentText value={en} />
      </span>
      <span lang="ko" className={KO_ITEM}>
        <ContentText value={ko} />
      </span>
    </span>
  );
}

/**
 * 언어마다 구조가 다른 블록(목록 등)을 통째로 바꿔 끼울 때 쓴다. 높이는 큰 쪽에 맞춘다.
 *   <LBlock en={<ul>…</ul>} ko={<ul>…</ul>} />
 */
export function LBlock({ en, ko }: { en: ReactNode; ko: ReactNode }) {
  return (
    <div className="grid">
      <div lang="en" className={EN_ITEM}>
        {en}
      </div>
      <div lang="ko" className={KO_ITEM}>
        {ko}
      </div>
    </div>
  );
}
