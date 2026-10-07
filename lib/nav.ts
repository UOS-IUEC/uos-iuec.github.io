import type { Localized } from "@/lib/content";

export type NavItem = {
  href: string;
  label: Localized;
  /** 하위 메뉴. 데스크톱은 드롭다운, 모바일은 화살표로 펼치는 목록으로 그린다. */
  children?: ReadonlyArray<{ href: string; label: Localized }>;
};

/** 헤더·푸터·모바일 메뉴가 공유하는 단일 정의. 페이지를 추가하면 여기에만 넣는다. */
export const NAV_ITEMS: ReadonlyArray<NavItem> = [
  { href: "/research", label: { en: "Research", ko: "연구" } },
  { href: "/publications", label: { en: "Publications", ko: "논문" } },
  {
    href: "/members",
    label: { en: "Members", ko: "구성원" },
    children: [
      { href: "/members#professor", label: { en: "Professor", ko: "교수" } },
      { href: "/members#students", label: { en: "Students", ko: "학생" } },
    ],
  },
  { href: "/contact", label: { en: "Contact", ko: "연락처" } },
];
