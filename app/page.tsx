import type { Metadata } from "next";
import Link from "next/link";

import Container from "@/components/Container";
import ContentText from "@/components/ContentText";
import {
  PUBLICATION_TYPE_LABEL,
  highlightedPublications,
  isMemberName,
  isTodo,
  recentNews,
  researchAreas,
  site,
  type NewsItem,
  type Publication,
  type ResearchArea,
} from "@/lib/content";

/**
 * 검색 결과에 "TODO:"가 나가면 안 되므로 tagline이 미확정인 동안에는 소속으로 대체한다.
 * layout.tsx가 기본 description에 쓰는 처리와 같은 이유다 (CLAUDE.md §4-2, §7).
 */
const description = isTodo(site.tagline)
  ? `Research areas, selected publications and recent news from ${site.name} (${site.shortName}) at the ${site.department}, ${site.university}.`
  : site.tagline;

export const metadata: Metadata = {
  // 홈만 "Home — IUEC" 대신 전체 명칭을 쓴다. 루트 페이지의 title이 곧 검색 결과 제목이다.
  title: { absolute: `${site.name} — ${site.university}` },
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
  title: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line pb-3">
      <h2 id={id} className="text-xl font-semibold tracking-tight sm:text-2xl">
        {title}
      </h2>
      <Link href={href} className="text-sm text-accent hover:underline">
        {linkLabel} <span aria-hidden="true">&rarr;</span>
      </Link>
    </div>
  );
}

function ResearchCard({ area }: { area: ResearchArea }) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-line bg-surface p-5">
      <h3 className="font-medium leading-snug">
        <ContentText value={area.title} />
      </h3>
      {area.summary ? (
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          <ContentText value={area.summary} />
        </p>
      ) : null}
      {area.tags.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {area.tags.map((tag) => (
            <li key={tag} className="rounded bg-accent-soft px-2 py-0.5 text-xs text-accent">
              <ContentText value={tag} />
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

function PublicationItem({ item }: { item: Publication }) {
  const href = externalHref(item.url);

  return (
    <article>
      <p className="text-xs uppercase tracking-wide text-ink-muted">
        {PUBLICATION_TYPE_LABEL[item.type]} &middot; {item.year}
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
  const areas = researchAreas.slice(0, 3);
  const selectedPublications = highlightedPublications(3);
  const latestNews = recentNews(3);

  return (
    <>
      {/* 히어로 — 홈은 PageHeader를 쓰지 않고 여기서 h1을 그린다. */}
      <section className="border-b border-line bg-surface">
        <Container className="py-16 sm:py-24">
          <p className="text-sm text-ink-muted">
            {site.department} &middot; {site.university}
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            {site.name}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-muted">
            <ContentText value={site.tagline} />
          </p>
        </Container>
      </section>

      {/* 아래 세 섹션은 데이터가 없으면 통째로 빠진다. 제목만 남은 빈 섹션을 만들지 않는다. */}
      {areas.length > 0 ? (
        <section aria-labelledby="home-research">
          <Container className="py-14 sm:py-20">
            <SectionHeading
              id="home-research"
              title="Research"
              href="/research"
              linkLabel="All research areas"
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
              title="Selected publications"
              href="/publications"
              linkLabel="All publications"
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

      {latestNews.length > 0 ? (
        <section aria-labelledby="home-news">
          <Container className="py-14 sm:py-20">
            <SectionHeading
              id="home-news"
              title="Recent news"
              href="/news"
              linkLabel="All news"
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
