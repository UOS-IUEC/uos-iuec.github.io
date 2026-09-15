import type { Metadata } from "next";

import Container from "@/components/Container";
import ContentText from "@/components/ContentText";
import PageHeader from "@/components/PageHeader";
import { isTodo, news, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "News",
  description: `Announcements, awards, talks and other updates from the ${site.name}.`,
};

/**
 * 월 이름을 상수로 직접 들고 있는다.
 * new Date()나 toLocaleDateString()을 쓰면 서버와 브라우저의 타임존이 달라
 * 날짜가 하루 어긋나거나 hydration 불일치가 난다. 날짜 문자열만 잘라 쓴다.
 */
const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/**
 * "2026-09-15" → "Sep 15, 2026".
 * 형식은 lib/content.ts의 스키마가 보장하지만, 어긋나면 원본을 그대로 보여준다.
 */
function formatNewsDate(date: string): string {
  const [year, month, day] = date.split("-");
  const monthLabel = MONTH_LABELS[Number(month) - 1];
  if (!monthLabel || !year || !day) return date;
  return `${monthLabel} ${Number(day)}, ${year}`;
}

export default function NewsPage() {
  const items = news();

  return (
    <>
      <PageHeader
        title="News"
        lead="Announcements, awards, talks and other updates from the lab."
      />

      <Container className="py-12 sm:py-16">
        {items.length === 0 ? (
          <p className="rounded-lg border border-line bg-surface px-5 py-12 text-center text-ink-muted">
            No news yet. Updates from the lab will appear here.
          </p>
        ) : (
          // 최신순 목록이라 ol이 맞다. 항목이 하나뿐일 때도, 수십 개일 때도
          // 같은 구분선 리듬으로 읽힌다.
          <ol className="divide-y divide-line border-t border-line">
            {items.map((item) => (
              <li key={item.id}>
                <article className="grid gap-x-8 gap-y-1.5 py-8 sm:grid-cols-[7.5rem_minmax(0,1fr)]">
                  <time
                    dateTime={item.date}
                    className="text-sm tabular-nums text-ink-muted sm:pt-1"
                  >
                    {formatNewsDate(item.date)}
                  </time>

                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold tracking-tight break-words">
                      <ContentText value={item.title} />
                    </h2>

                    {item.body ? (
                      <p className="mt-2 text-ink-muted break-words">
                        <ContentText value={item.body} />
                      </p>
                    ) : null}

                    {item.link && !isTodo(item.link) ? (
                      <p className="mt-3">
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Read more: ${item.title}`}
                          className="inline-flex items-center gap-1 text-sm font-medium text-accent underline-offset-4 hover:underline"
                        >
                          Read more
                          <span aria-hidden="true">&#8599;</span>
                        </a>
                      </p>
                    ) : null}

                    {isTodo(item.link) ? (
                      // 링크가 미확정이면 앵커로 만들지 않고 채울 자리로 드러낸다 (CLAUDE.md §4-2)
                      <p className="mt-3 text-sm">
                        <ContentText value={item.link} />
                      </p>
                    ) : null}
                  </div>
                </article>
              </li>
            ))}
          </ol>
        )}
      </Container>
    </>
  );
}
