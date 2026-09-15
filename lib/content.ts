import { z } from "zod";

import membersJson from "@/content/members.json";
import newsJson from "@/content/news.json";
import publicationsJson from "@/content/publications.json";
import researchJson from "@/content/research.json";
import siteJson from "@/content/site.json";

/* ---------------------------------------------------------------------------
 * 이 파일이 콘텐츠 형식의 정본이다 (CLAUDE.md §4-3).
 * 컴포넌트는 content 아래 JSON을 직접 import하지 않고 여기서 내보낸 값만 쓴다.
 * ------------------------------------------------------------------------- */

/**
 * CLAUDE.md §4-2 — 모르는 값은 지어내지 말고 "TODO: ..."로 남긴다.
 * 스키마가 그 관례를 허용하므로 미확정 상태에서도 빌드가 통과하고,
 * 실제 값이 들어오면 TODO 문자열이 자연스럽게 사라진다.
 */
const todo = z.string().regex(/^TODO:/);

const emailField = z.union([z.email(), todo, z.literal("")]).default("");
const urlField = z.union([z.url(), todo, z.literal("")]).default("");
const pathOrUrl = z
  .union([z.string().startsWith("/"), z.url(), z.literal("")])
  .default("");
const yearMonth = z.string().regex(/^\d{4}-\d{2}$/, "YYYY-MM 형식이어야 한다");
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD 형식이어야 한다");

/* ---------- 구성원 ---------- */

export const MEMBER_ROLES = [
  "pi",
  "postdoc",
  "phd",
  "ms",
  "undergrad",
  "staff",
  "alumni",
] as const;

export type MemberRole = (typeof MEMBER_ROLES)[number];

/** 화면에 그릴 때 쓰는 섹션 제목이자 표시 순서 (CLAUDE.md §6). */
export const MEMBER_ROLE_LABEL: Record<MemberRole, string> = {
  pi: "Principal Investigator",
  postdoc: "Postdoctoral Researchers",
  phd: "Ph.D. Students",
  ms: "M.S. Students",
  undergrad: "Undergraduate Researchers",
  staff: "Staff",
  alumni: "Alumni",
};

const memberSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  role: z.enum(MEMBER_ROLES),
  title: z.string().default(""),
  photo: z.string().startsWith("/").nullable().default(null),
  email: emailField,
  interests: z.array(z.string()).default([]),
  links: z
    .object({
      scholar: urlField,
      github: urlField,
      linkedin: urlField,
      homepage: urlField,
    })
    .partial()
    .default({}),
  joined: yearMonth.nullable().default(null),
  left: yearMonth.nullable().default(null),
});

export type Member = z.infer<typeof memberSchema>;

/* ---------- 논문 ---------- */

export const PUBLICATION_TYPES = [
  "journal",
  "conference",
  "preprint",
  "patent",
  "thesis",
] as const;

export type PublicationType = (typeof PUBLICATION_TYPES)[number];

export const PUBLICATION_TYPE_LABEL: Record<PublicationType, string> = {
  journal: "Journal",
  conference: "Conference",
  preprint: "Preprint",
  patent: "Patent",
  thesis: "Thesis",
};

const publicationSchema = z.object({
  id: z.string().min(1),
  type: z.enum(PUBLICATION_TYPES),
  title: z.string().min(1),
  authors: z.array(z.string().min(1)).min(1),
  venue: z.string().default(""),
  year: z.number().int().min(1900).max(2200),
  volume: z.string().default(""),
  pages: z.string().default(""),
  doi: z.string().default(""),
  url: urlField,
  pdf: pathOrUrl,
  code: urlField,
  award: z.string().nullable().default(null),
  highlight: z.boolean().default(false),
});

export type Publication = z.infer<typeof publicationSchema>;

/* ---------- 연구 분야 · 소식 · 사이트 ---------- */

const researchAreaSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().default(""),
  image: z.string().startsWith("/").nullable().default(null),
  tags: z.array(z.string()).default([]),
});

export type ResearchArea = z.infer<typeof researchAreaSchema>;

const newsItemSchema = z.object({
  id: z.string().min(1),
  date: isoDate,
  title: z.string().min(1),
  body: z.string().default(""),
  link: urlField,
});

export type NewsItem = z.infer<typeof newsItemSchema>;

const siteSchema = z.object({
  name: z.string().min(1),
  shortName: z.string().min(1),
  nameKo: z.string().default(""),
  department: z.string().min(1),
  university: z.string().min(1),
  tagline: z.string().default(""),
  email: emailField,
  phone: z.string().default(""),
  address: z.object({
    line1: z.string().default(""),
    line2: z.string().default(""),
    city: z.string().default(""),
    country: z.string().default(""),
  }),
  links: z
    .object({
      github: urlField,
      scholar: urlField,
      university: urlField,
    })
    .partial()
    .default({}),
});

export type Site = z.infer<typeof siteSchema>;

/* ---------------------------------------------------------------------------
 * 로딩 — 형식이 어긋나면 빌드를 실패시킨다.
 * 깨진 데이터가 그대로 배포되는 것보다 빌드가 멈추는 편이 낫다.
 * ------------------------------------------------------------------------- */

function parse<S extends z.ZodType>(schema: S, data: unknown, file: string): z.infer<S> {
  const result = schema.safeParse(data);
  if (result.success) return result.data;

  const detail = result.error.issues
    .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
    .join("\n");
  throw new Error(`content/${file} 형식이 스키마와 맞지 않습니다:\n${detail}`);
}

export const site: Site = parse(siteSchema, siteJson, "site.json");

const allMembers: Member[] = parse(z.array(memberSchema), membersJson, "members.json");
const allPublications: Publication[] = parse(
  z.array(publicationSchema),
  publicationsJson,
  "publications.json",
);
export const researchAreas: ResearchArea[] = parse(
  z.array(researchAreaSchema),
  researchJson,
  "research.json",
);
const allNews: NewsItem[] = parse(z.array(newsItemSchema), newsJson, "news.json");

/* ---------------------------------------------------------------------------
 * 정렬·그룹핑 — JSON 배열 순서에 의존하지 않는다 (CLAUDE.md §6).
 * ------------------------------------------------------------------------- */

/** joined가 비어 있는 항목은 뒤로 보낸다. */
function byJoinedThenName(a: Member, b: Member): number {
  if (a.joined !== b.joined) {
    if (a.joined === null) return 1;
    if (b.joined === null) return -1;
    return a.joined.localeCompare(b.joined);
  }
  return a.name.localeCompare(b.name);
}

/** 재직 중인 구성원을 역할 순서대로 묶는다. 비어 있는 역할은 빠진다. */
export function membersByRole(): Array<{
  role: MemberRole;
  label: string;
  members: Member[];
}> {
  return MEMBER_ROLES.filter((role) => role !== "alumni")
    .map((role) => ({
      role,
      label: MEMBER_ROLE_LABEL[role],
      members: allMembers.filter((m) => m.role === role).sort(byJoinedThenName),
    }))
    .filter((group) => group.members.length > 0);
}

/** 졸업생. 최근에 떠난 순서. */
export function alumni(): Member[] {
  return allMembers
    .filter((m) => m.role === "alumni")
    .sort(
      (a, b) =>
        (b.left ?? "").localeCompare(a.left ?? "") || a.name.localeCompare(b.name),
    );
}

/**
 * 논문 저자가 연구실 구성원인지 판정한다.
 * 강조 표시는 렌더링 단계에서 하고 JSON에는 마크업을 넣지 않는다 (CLAUDE.md §6).
 */
const memberNames = new Set(allMembers.map((m) => m.name));
export function isMemberName(author: string): boolean {
  return memberNames.has(author);
}

function byYearThenType(a: Publication, b: Publication): number {
  if (a.year !== b.year) return b.year - a.year;
  const order = PUBLICATION_TYPES.indexOf(a.type) - PUBLICATION_TYPES.indexOf(b.type);
  return order !== 0 ? order : a.title.localeCompare(b.title);
}

export function publications(): Publication[] {
  return [...allPublications].sort(byYearThenType);
}

/** 연도 내림차순으로 묶는다. */
export function publicationsByYear(): Array<{ year: number; items: Publication[] }> {
  const years = [...new Set(allPublications.map((p) => p.year))].sort((a, b) => b - a);
  return years.map((year) => ({
    year,
    items: allPublications.filter((p) => p.year === year).sort(byYearThenType),
  }));
}

/** 목록에 실제로 등장하는 타입만 돌려준다. 필터 UI가 빈 항목을 보이지 않게 하기 위함. */
export function publicationTypesInUse(): PublicationType[] {
  const used = new Set(allPublications.map((p) => p.type));
  return PUBLICATION_TYPES.filter((t) => used.has(t));
}

/** 홈 화면 노출용. highlight가 하나도 없으면 최신 논문으로 대체한다. */
export function highlightedPublications(limit = 3): Publication[] {
  const flagged = publications().filter((p) => p.highlight);
  return (flagged.length > 0 ? flagged : publications()).slice(0, limit);
}

export function news(): NewsItem[] {
  return [...allNews].sort((a, b) => b.date.localeCompare(a.date));
}

export function recentNews(limit = 3): NewsItem[] {
  return news().slice(0, limit);
}

/**
 * 아직 채워지지 않은 값인지 판정한다 (CLAUDE.md §4-2).
 * 화면에서는 감추지 말고 눈에 띄게 표시한다 — 비어 보이는 편이
 * 완성된 것처럼 보이는 것보다 낫다. components/ContentText.tsx 참고.
 */
export function isTodo(value: string | null | undefined): boolean {
  return typeof value === "string" && value.startsWith("TODO:");
}
