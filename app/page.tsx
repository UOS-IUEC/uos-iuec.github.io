import type { Metadata } from "next";
import Link from "next/link";

import Container from "@/components/Container";
import ContentText from "@/components/ContentText";
import L, { LBlock } from "@/components/L";
import {
  activeAnnouncements,
  PUBLICATION_TYPE_LABEL,
  highlightedPublications,
  isMemberName,
  isTodo,
  recentNews,
  researchAreas,
  site,
  siteSummary,
  type Announcement,
  type Localized,
  type NewsItem,
  type Publication,
  type ResearchArea,
} from "@/lib/content";

/**
 * 검색 결과에 "TODO:"가 나가면 안 되므로 tagline이 미확정인 동안에는 소속으로 대체한다.
 * layout.tsx가 기본 description에 쓰는 처리와 같은 이유다 (CLAUDE.md §4-2, §7).
 */
const description =
  siteSummary() ??
  `Research areas and selected publications from ${site.name} (${site.shortName}) at the ${site.department.en}, ${site.university.en}.`;

export const metadata: Metadata = {
  // 홈만 "Home — IUEC" 대신 전체 명칭을 쓴다. 루트 페이지의 title이 곧 검색 결과 제목이다.
  title: { absolute: `${site.name} — ${site.university.en}` },
  description,
};

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * "YYYY-MM-DD"를 직접 잘라 쓴다.
 * toLocaleDateString은 서버와 브라우저의 로캘·시간대가 달라 하이드레이션 불일치를 만든다.
 */
function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  const name = MONTH_NAMES[Number(month) - 1];
  return name ? `${name} ${Number(day)}, ${year}` : iso;
}

function TaglinePoints({ points }: { points: string[] }) {
  if (points.length === 0) return null;
  return (
    <ul className="mt-3 max-w-2xl list-disc space-y-1.5 pl-6 text-lg leading-relaxed text-ink-muted marker:text-accent">
      {points.map((point) => (
        <li key={point}>{point}</li>
      ))}
    </ul>
  );
}

/** 비어 있거나 아직 미확정("TODO: ...")인 주소는 링크로 만들지 않는다. */
function externalHref(value: string): string | null {
  return value !== "" && !isTodo(value) ? value : null;
}

/** 섹션 제목과 전체 목록 링크. 세 섹션이 같은 형태를 쓰도록 한곳에 모아 둔다. */
function SectionHeading({
  id,
  title,
  href,
  linkLabel,
}: {
  id: string;
  title: Localized;
  href: string;
  linkLabel: Localized;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line pb-3">
      <h2 id={id} className="text-xl font-semibold tracking-tight sm:text-2xl">
        <L {...title} />
      </h2>
      <Link href={href} className="text-sm text-accent hover:underline">
        <L {...linkLabel} /> <span aria-hidden="true">&rarr;</span>
      </Link>
    </div>
  );
}

function ResearchCard({ area }: { area: ResearchArea }) {
  const [firstEn] = area.points.en;
  const [firstKo] = area.points.ko;

  return (
    <article className="flex h-full flex-col rounded-lg border border-line bg-surface p-5">
      <h3 className="break-keep font-medium leading-snug">
        <Link href={`/research#${area.id}`} className="hover:text-accent">
          <L {...area.title} />
        </Link>
      </h3>
      {firstEn && firstKo ? (
        <p className="mt-2 break-keep text-sm leading-relaxed text-ink-muted">
          <L en={firstEn} ko={firstKo} />
        </p>
      ) : null}
    </article>
  );
}

/** 학부연구생 모집 같은 홍보 공지. */
function AnnouncementCard({ item }: { item: Announcement }) {
  return (
    <article className="rounded-xl border border-accent/30 bg-accent-soft p-6 sm:p-8">
      <div className="flex flex-wrap items-center gap-2">
        {item.badge ? (
          <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-canvas">
            <L {...item.badge} />
          </span>
        ) : null}
        {item.target ? (
          <span className="text-sm text-accent">
            <L {...item.target} />
          </span>
        ) : null}
      </div>

      <h2 className="mt-3 break-keep text-xl font-semibold tracking-tight sm:text-2xl">
        <L {...item.title} />
      </h2>

      {item.details.length > 0 ? (
        <dl className="mt-5 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[10rem_1fr] sm:text-base">
          {item.details.map((detail) => (
            <div key={detail.label.en} className="contents">
              <dt className="font-medium text-ink">
                <L {...detail.label} />
              </dt>
              <dd className="mb-2 break-keep text-ink-muted sm:mb-0">
                <L {...detail.value} />
              </dd>
            </div>
          ))}
        </dl>
      ) : null}

      {item.actions.length > 0 ? (
        <ul className="mt-6 flex flex-wrap gap-3">
          {item.actions.map((action) => (
            <li key={action.href}>
              <Link
                href={action.href}
                className="inline-block rounded-full bg-accent px-4 py-2 text-sm font-medium text-canvas hover:opacity-90"
              >
                <L {...action.label} /> <span aria-hidden="true">&rarr;</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

/** 논문 제목·저자·게재지는 번역하지 않는다. 타입 라벨만 전환된다. */
function PublicationItem({ item }: { item: Publication }) {
  const href = externalHref(item.url);

  return (
    <article>
      <p className="text-xs uppercase tracking-wide text-ink-muted">
        <L {...PUBLICATION_TYPE_LABEL[item.type]} /> &middot; {item.year}
      </p>

      <h3 className="mt-1 font-medium leading-snug">
        {href ? (
          <a className="hover:text-accent" href={href} target="_blank" rel="noreferrer">
            <ContentText value={item.title} />
          </a>
        ) : (
          <ContentText value={item.title} />
        )}
      </h3>

      {/* 연구실 구성원 이름은 렌더링 단계에서 강조한다. JSON에는 마크업을 넣지 않는다 (CLAUDE.md §6). */}
      <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
        {item.authors.map((author, index) => (
          <span key={`${item.id}-author-${index}`}>
            {index > 0 ? ", " : null}
            {isMemberName(author) ? (
              <span className="font-medium text-ink">
                <ContentText value={author} />
              </span>
            ) : (
              <ContentText value={author} />
            )}
          </span>
        ))}
      </p>

      {item.venue ? (
        <p className="mt-1 text-sm leading-relaxed text-ink-muted">
          <ContentText value={item.venue} />
        </p>
      ) : null}

      {item.award ? (
        <p className="mt-2">
          <span className="inline-block rounded bg-accent-soft px-2 py-0.5 text-xs text-accent">
            <ContentText value={item.award} />
          </span>
        </p>
      ) : null}
    </article>
  );
}

function NewsRow({ item }: { item: NewsItem }) {
  const href = externalHref(item.link);

  return (
    <article className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
      <time dateTime={item.date} className="shrink-0 text-sm text-ink-muted sm:w-40">
        {formatDate(item.date)}
      </time>
      <h3 className="font-medium leading-snug">
        {href ? (
          <a className="hover:text-accent" href={href} target="_blank" rel="noreferrer">
            <ContentText value={item.title} />
          </a>
        ) : (
          <ContentText value={item.title} />
        )}
      </h3>
    </article>
  );
}

export default function HomePage() {
  const announcements = activeAnnouncements();
  const areas = researchAreas.slice(0, 3);
  const selectedPublications = highlightedPublications(3);
  const latestNews = recentNews(3);

  return (
    <>
      {/* 히어로 — 홈은 PageHeader를 쓰지 않고 여기서 h1을 그린다. */}
      <section className="border-b border-line bg-surface">
        <Container className="py-16 sm:py-24">
          <p className="text-sm text-ink-muted">
            <L {...site.department} /> &middot; <L {...site.university} />
          </p>
          {/* 연구실 이름은 한국어 화면에서도 영문 그대로 둔다 */}
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            {site.name}
          </h1>
          {site.tagline ? (
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-muted">
              <L {...site.tagline} />
            </p>
          ) : null}
          <LBlock
            en={<TaglinePoints points={site.taglinePoints.en} />}
            ko={<TaglinePoints points={site.taglinePoints.ko} />}
          />
        </Container>
      </section>

      {announcements.length > 0 ? (
        <section aria-label="Announcements / 공지">
          <Container className="space-y-5 pt-14 sm:pt-20">
            {announcements.map((item) => (
              <AnnouncementCard key={item.id} item={item} />
            ))}
          </Container>
        </section>
      ) : null}

      {/* 아래 세 섹션은 데이터가 없으면 통째로 빠진다. 제목만 남은 빈 섹션을 만들지 않는다. */}
      {areas.length > 0 ? (
        <section aria-labelledby="home-research">
          <Container className="py-14 sm:py-20">
            <SectionHeading
              id="home-research"
              title={{ en: "Research", ko: "연구 분야" }}
              href="/research"
              linkLabel={{ en: "All research areas", ko: "연구 분야 전체 보기" }}
            />
            {/* auto-fit — 항목이 하나면 한 줄을 채우고, 셋이면 3열이 된다 */}
            <ul className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-5">
              {areas.map((area) => (
                <li key={area.id}>
                  <ResearchCard area={area} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      {selectedPublications.length > 0 ? (
        <section aria-labelledby="home-publications">
          <Container className="py-14 sm:py-20">
            <SectionHeading
              id="home-publications"
              title={{ en: "Selected publications", ko: "주요 논문" }}
              href="/publications"
              linkLabel={{ en: "All publications", ko: "논문 전체 보기" }}
            />
            <ul className="mt-6 divide-y divide-line">
              {selectedPublications.map((item) => (
                <li key={item.id} className="py-5">
                  <PublicationItem item={item} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      {/* News 페이지는 소식이 생길 때까지 숨겨 두었다(app/_news). news.json이 비어 있어 이 섹션도 그려지지 않는다.
          소식을 넣을 때는 폴더명을 app/news로 되돌리고 lib/nav.ts에 메뉴를 다시 추가한다. */}
      {latestNews.length > 0 ? (
        <section aria-labelledby="home-news">
          <Container className="py-14 sm:py-20">
            <SectionHeading
              id="home-news"
              title={{ en: "Recent news", ko: "최근 소식" }}
              href="/news"
              linkLabel={{ en: "All news", ko: "소식 전체 보기" }}
            />
            <ul className="mt-6 divide-y divide-line">
              {latestNews.map((item) => (
                <li key={item.id} className="py-4">
                  <NewsRow item={item} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}
    </>
  );
}
