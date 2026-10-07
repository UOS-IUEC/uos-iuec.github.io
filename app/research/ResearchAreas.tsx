import Image from "next/image";

import L, { LBlock } from "@/components/L";
import type { PastProject, ResearchArea } from "@/lib/content";

/**
 * 분야가 이만큼 이상이면 상단에 바로가기 목록을 붙인다.
 * 항목이 늘어나도 긴 스크롤 없이 원하는 분야로 갈 수 있어야 한다.
 */
const TOC_MIN_AREAS = 4;

const PATENT_STATUS_LABEL = { filed: "출원", registered: "등록" } as const;

function Points({ points }: { points: string[] }) {
  if (points.length === 0) return null;
  return (
    <ul className="mt-4 max-w-2xl list-disc space-y-2 pl-5 leading-relaxed break-keep text-ink-muted marker:text-accent">
      {points.map((point) => (
        <li key={point}>{point}</li>
      ))}
    </ul>
  );
}

/**
 * 연구 분야 목록과 과거 프로젝트. 언어는 헤더의 전환 버튼을 따른다(CSS로 전환).
 * 특허는 영문 명칭이 확정되지 않아 한국어 화면에서만 보인다.
 */
export default function ResearchAreas({
  areas,
  pastProjects,
}: {
  areas: ResearchArea[];
  pastProjects: PastProject[];
}) {
  return (
    <div>
      {areas.length >= TOC_MIN_AREAS ? (
        <nav
          aria-label="Research areas / 연구 분야"
          className="mb-12 rounded-lg border border-line bg-surface p-5"
        >
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
            <L en="On this page" ko="바로가기" />
          </h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5">
            {areas.map((area) => (
              <li key={area.id} className="text-sm text-ink-muted">
                <a href={`#${area.id}`} className="text-ink hover:text-accent">
                  <L {...area.title} />
                </a>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}

      <div className="divide-y divide-line">
        {areas.map((area) => (
          <article
            key={area.id}
            id={area.id}
            // 헤더가 sticky라 앵커로 이동했을 때 제목이 가려지지 않게 여백을 준다
            className="scroll-mt-24 py-10 first:pt-0 last:pb-0 sm:py-14"
          >
            <div className="grid gap-6 md:grid-cols-5 md:gap-10">
              <div className={area.image ? "md:col-span-3" : "md:col-span-5"}>
                <h2 className="break-keep text-xl font-semibold leading-snug tracking-tight sm:text-2xl">
                  <L {...area.title} />
                </h2>

                <LBlock en={<Points points={area.points.en} />} ko={<Points points={area.points.ko} />} />

                {area.patents.length > 0 ? (
                  <section
                    lang="ko"
                    aria-labelledby={`${area.id}-patents`}
                    className="mt-6 hidden ko:block"
                  >
                    <h3 id={`${area.id}-patents`} className="text-sm font-semibold text-ink">
                      특허
                    </h3>
                    <ul className="mt-2 space-y-1.5">
                      {area.patents.map((patent) => (
                        <li
                          key={patent.title}
                          className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-sm"
                        >
                          <span className="break-keep text-ink">{patent.title}</span>
                          <span className="rounded bg-accent-soft px-1.5 py-0.5 text-xs text-accent">
                            {PATENT_STATUS_LABEL[patent.status]} {patent.year}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}
              </div>

              {area.image ? (
                <figure className="md:col-span-2">
                  <Image
                    src={area.image.src}
                    alt={area.image.alt}
                    width={area.image.width}
                    height={area.image.height}
                    className="h-auto w-full rounded-md border border-line"
                  />
                </figure>
              ) : null}
            </div>
          </article>
        ))}
      </div>

      {pastProjects.length > 0 ? (
        // 기본은 접힌 상태. <details>라 키보드·스크린리더 지원이 따로 필요 없다.
        <details className="group mt-16 border-b border-ink-muted sm:mt-20">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
            <h2 className="text-xl font-semibold tracking-tight text-accent sm:text-2xl">
              <L en="Past Projects" ko="과거 프로젝트" />
            </h2>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="shrink-0 text-ink-muted transition-transform group-open:rotate-180"
            >
              <path d="M5 8l5 5 5-5" />
            </svg>
          </summary>

          <ul className="divide-y divide-line border-t border-line pb-2">
            {pastProjects.map((project) => (
              <li
                key={`${project.start}-${project.title.en}`}
                className="flex flex-col gap-0.5 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
              >
                <span className="break-keep leading-relaxed text-ink">
                  <L {...project.title} />
                </span>
                <span className="shrink-0 text-sm tabular-nums text-ink-muted">
                  {project.start} – {project.end}
                </span>
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );
}
