import { z } from "zod";

import { isTodo } from "@/lib/todo";

import announcementJson from "@/content/announcement.json";
import membersJson from "@/content/members.json";
import newsJson from "@/content/news.json";
import pastProjectsJson from "@/content/past-projects.json";
import professorJson from "@/content/professor.json";
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

/** 화면에 그릴 때 쓰는 섹션 제목이자 표시 순서 (CLAUDE.md §6). Members는 한/영 전환이 있다. */
export const MEMBER_ROLE_LABEL: Record<MemberRole, { en: string; ko: string }> = {
  pi: { en: "Principal Investigator", ko: "책임교수" },
  postdoc: { en: "Postdoctoral Researchers", ko: "박사후연구원" },
  phd: { en: "Ph.D. Course", ko: "박사과정" },
  ms: { en: "M.S. Course", ko: "석사과정" },
  undergrad: { en: "B.S. Course", ko: "학부과정" },
  staff: { en: "Staff", ko: "연구원" },
  alumni: { en: "Alumni", ko: "졸업생" },
};

const memberSchema = z.object({
  id: z.string().min(1),
  /** 영문 이름. 사이트 기본 표기이자 논문 저자 강조에 쓰인다. */
  name: z.string().min(1),
  /** 한국어 화면에서 쓰는 이름. 비어 있으면 영문 이름을 쓴다. */
  nameKo: z.string().default(""),
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

export const PUBLICATION_TYPE_LABEL: Record<PublicationType, { en: string; ko: string }> = {
  journal: { en: "Journal", ko: "저널" },
  conference: { en: "Conference", ko: "학술대회" },
  preprint: { en: "Preprint", ko: "프리프린트" },
  patent: { en: "Patent", ko: "특허" },
  thesis: { en: "Thesis", ko: "학위논문" },
};

/** 논문 목록의 연도 구간 필터. to가 null이면 상한 없이 최신까지 포함한다. */
export type PublicationPeriod = { id: string; label: string; from: number; to: number | null };

export const PUBLICATION_PERIODS: PublicationPeriod[] = [
  { id: "2000s", label: "2000–2009", from: 2000, to: 2009 },
  { id: "2010s", label: "2010–2019", from: 2010, to: 2019 },
  { id: "2020s", label: "2020–", from: 2020, to: null },
];

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

/**
 * 사이트는 영어 기본이고 헤더에서 한국어로 전환할 수 있다 (CLAUDE.md §1).
 * 연구실 이름과 논문 본문(제목·저자·게재지)을 뺀 화면 텍스트는 en/ko를 함께 담는다.
 */
export const LANGS = ["en", "ko"] as const;
export type Lang = (typeof LANGS)[number];

const localizedText = z.object({ en: z.string().min(1), ko: z.string().min(1) });
const localizedList = z.object({
  en: z.array(z.string().min(1)).default([]),
  ko: z.array(z.string().min(1)).default([]),
});

export type Localized = z.infer<typeof localizedText>;
export type LocalizedList = z.infer<typeof localizedList>;

const researchAreaSchema = z.object({
  id: z.string().min(1),
  title: localizedText,
  points: localizedList.default({ en: [], ko: [] }),
  // width·height는 실제 파일 크기. 레이아웃이 이미지 로딩 전에 자리를 잡게 한다.
  image: z
    .object({
      src: z.string().startsWith("/"),
      width: z.number().int().positive(),
      height: z.number().int().positive(),
      alt: z.string().min(1),
    })
    .nullable()
    .default(null),
  // 특허는 영문 명칭이 확정되지 않아 한국어 화면에서만 보인다. title은 한국어로 적는다.
  patents: z
    .array(
      z.object({
        title: z.string().min(1),
        status: z.enum(["filed", "registered"]),
        year: z.number().int().min(1900).max(2200),
      }),
    )
    .default([]),
});

export type ResearchArea = z.infer<typeof researchAreaSchema>;

/** Research 맨 아래 "Past Projects" 목록. 날짜는 원문 표기(YYYY.MM.DD) 그대로, JSON 순서대로 그린다. */
const pastProjectDate = z.string().regex(/^\d{4}\.\d{2}\.\d{2}$/, "YYYY.MM.DD 형식이어야 한다");
const pastProjectSchema = z.object({
  start: pastProjectDate,
  end: pastProjectDate,
  title: localizedText,
});

export type PastProject = z.infer<typeof pastProjectSchema>;

/* ---------- 교수 소개 ---------- */

/** 경력·학력·수상 한 줄. period/date는 원문 표기 그대로 둔다(예: "2002.03 – Present"). */
const localizedEntry = z.object({
  en: z.string().min(1),
  ko: z.string().min(1),
});

const professorSchema = z.object({
  name: localizedText,
  title: localizedText,
  affiliation: localizedText,
  email: emailField,
  photo: z
    .object({
      src: z.string().startsWith("/"),
      width: z.number().int().positive(),
      height: z.number().int().positive(),
    })
    .nullable()
    .default(null),
  interests: localizedList.default({ en: [], ko: [] }),
  experience: z.array(localizedEntry.extend({ period: z.string().min(1) })).default([]),
  education: z.array(localizedEntry.extend({ period: z.string().min(1) })).default([]),
  awards: z.array(localizedEntry.extend({ date: z.string().min(1) })).default([]),
});

export type Professor = z.infer<typeof professorSchema>;

/* ---------- 홈 공지(홍보) ---------- */

/**
 * 홈 히어로 바로 아래에 붙는 공지 카드.
 * JSON 배열 순서대로 위에서부터 쌓인다. 모집이 끝나면 enabled를 false로 바꾸면 카드가 사라진다.
 */
const announcementSchema = z.object({
  id: z.string().min(1),
  enabled: z.boolean().default(false),
  badge: localizedText.nullable().default(null),
  title: localizedText,
  target: localizedText.nullable().default(null),
  details: z.array(z.object({ label: localizedText, value: localizedText })).default([]),
  // 카드 아래 버튼들. href는 사이트 안 경로
  actions: z
    .array(z.object({ label: localizedText, href: z.string().startsWith("/") }))
    .default([]),
});

export type Announcement = z.infer<typeof announcementSchema>;

const newsItemSchema = z.object({
  id: z.string().min(1),
  date: isoDate,
  title: z.string().min(1),
  body: z.string().default(""),
  link: urlField,
});

export type NewsItem = z.infer<typeof newsItemSchema>;

const siteSchema = z.object({
  /** 연구실 이름은 한국어 화면에서도 영문으로 쓴다. nameKo는 참고용 (CLAUDE.md §0). */
  name: z.string().min(1),
  shortName: z.string().min(1),
  nameKo: z.string().default(""),
  department: localizedText,
  university: localizedText,
  /** 헤더 로고 영역 왼쪽에 붙는 학교 로고. 비워 두면 그리지 않는다. */
  universityLogo: z.string().startsWith("/").nullable().default(null),
  tagline: localizedText.nullable().default(null),
  /** 홈 히어로에서 tagline 아래 글머리표 목록으로 그린다. */
  taglinePoints: localizedList.default({ en: [], ko: [] }),
  email: emailField,
  phone: z.string().default(""),
  /** 주소 줄. 언어마다 줄 순서·개수가 달라서 목록으로 담는다. */
  address: localizedList.default({ en: [], ko: [] }),
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

/**
 * 검색 결과용 한 문장 소개(영문). tagline과 목록을 이어 붙인다.
 * 메타데이터는 언어 전환이 없어 영문만 쓴다.
 * tagline이 아직 미확정이면 null — 쓰는 쪽이 소속 정보로 대체한다 (§4-2).
 */
export function siteSummary(): string | null {
  if (site.tagline === null || isTodo(site.tagline.en)) return null;
  if (site.taglinePoints.en.length === 0) return site.tagline.en;
  return `${site.tagline.en} ${site.taglinePoints.en.join(", ")}.`;
}

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
export const pastProjects: PastProject[] = parse(
  z.array(pastProjectSchema),
  pastProjectsJson,
  "past-projects.json",
);
const allNews: NewsItem[] = parse(z.array(newsItemSchema), newsJson, "news.json");
export const professor: Professor = parse(professorSchema, professorJson, "professor.json");
const allAnnouncements: Announcement[] = parse(
  z.array(announcementSchema),
  announcementJson,
  "announcement.json",
);

/** 켜져 있는 공지만, JSON 순서 그대로 돌려준다. */
export function activeAnnouncements(): Announcement[] {
  return allAnnouncements.filter((item) => item.enabled);
}

/* ---------------------------------------------------------------------------
 * 정렬·그룹핑 — JSON 배열 순서에 의존하지 않는다 (CLAUDE.md §6).
 * ------------------------------------------------------------------------- */

/**
 * joined 오름차순. joined가 비어 있는 항목은 뒤로 보낸다.
 * joined가 같으면(둘 다 비어 있는 경우 포함) JSON에 적힌 순서를 유지한다 — sort는 안정 정렬이다.
 */
function byJoined(a: Member, b: Member): number {
  if (a.joined === b.joined) return 0;
  if (a.joined === null) return 1;
  if (b.joined === null) return -1;
  return a.joined.localeCompare(b.joined);
}

/** 재직 중인 구성원을 역할 순서대로 묶는다. 비어 있는 역할은 빠진다. */
export function membersByRole(): Array<{
  role: MemberRole;
  label: { en: string; ko: string };
  members: Member[];
}> {
  return MEMBER_ROLES.filter((role) => role !== "alumni")
    .map((role) => ({
      role,
      label: MEMBER_ROLE_LABEL[role],
      members: allMembers.filter((m) => m.role === role).sort(byJoined),
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
 * 저널마다 같은 사람의 표기가 갈린다.
 * "Moon-Que Lee" / "Moon Que Lee", "Seon-Hwa Yun" / "Seonhwa Yun" 이 실제로 섞여 있다.
 * publications.json에는 게재된 표기를 그대로 두고(§6), 비교할 때만 정규화한다.
 */
function normalizeName(value: string): string {
  return value.toLowerCase().replace(/[^a-z]/g, "");
}

/**
 * 논문 저자가 연구실 구성원인지 판정한다.
 * 강조 표시는 렌더링 단계에서 하고 JSON에는 마크업을 넣지 않는다 (CLAUDE.md §6).
 */
/**
 * 구성원 이름은 "Park Seung-jun"(성 먼저)으로, 논문은 "Seung-Jun Park"(성 나중)으로
 * 적히는 경우가 많다. 그래서 적힌 순서와, 첫 단어를 맨 뒤로 보낸 순서를 모두 등록한다.
 */
function nameVariants(name: string): string[] {
  const words = name.trim().split(/\s+/);
  const familyLast = [...words.slice(1), words[0]].join(" ");
  return [name, familyLast].map(normalizeName);
}

const memberNames = new Set(
  [...allMembers.map((m) => m.name), professor.name.en].flatMap(nameVariants),
);
export function isMemberName(author: string): boolean {
  return memberNames.has(normalizeName(author));
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

export { isTodo };
