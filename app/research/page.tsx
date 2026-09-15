import type { Metadata } from "next";
import Image from "next/image";

import Container from "@/components/Container";
import ContentText from "@/components/ContentText";
import PageHeader from "@/components/PageHeader";
import { isTodo, researchAreas, site } from "@/lib/content";

/**
 * 분야가 이만큼 이상이면 상단에 바로가기 목록을 붙인다.
 * 지금은 플레이스홀더 두 건뿐이라 그려지지 않지만, 항목이 늘어나면
 * 긴 스크롤 없이 원하는 분야로 갈 수 있어야 한다.
 */
const TOC_MIN_AREAS = 4;

/** 설명에는 TODO가 섞이면 안 되므로 확정된 소속 정보만 조합한다. */
export const metadata: Metadata = {
  title: "Research",
  description: `Research areas of the ${site.name}, ${site.department}, ${site.university}.`,
};

export default function ResearchPage() {
  const areas = researchAreas;

  return (
    <>
      <PageHeader
        title="Research"
        lead="An overview of the topics the group works on, with a short description of each area."
      />

      <Container className="py-12 sm:py-16">
        {areas.length === 0 ? (
          <p className="rounded-lg border border-dashed border-line bg-surface px-5 py-12 text-center text-ink-muted">
            Research areas will be listed here.
          </p>
        ) : (
          <>
            {areas.length >= TOC_MIN_AREAS ? (
              <nav
                aria-label="Research areas"
                className="mb-12 rounded-lg border border-line bg-surface p-5"
              >
                <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  On this page
                </h2>
                <ul className="mt-3 grid gap-x-8 gap-y-2 sm:grid-cols-2">
                  {areas.map((area) => (
                    <li key={area.id}>
                      <a href={`#${area.id}`} className="text-sm hover:text-accent">
                        <ContentText value={area.title} />
                      </a>
                    </li>
                  ))}
                </ul>
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
                  <div className="grid gap-6 md:grid-cols-3 md:gap-10">
                    <div className={area.image ? "md:col-span-2" : "md:col-span-3"}>
                      <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                        <ContentText value={area.title} />
                      </h2>

                      {area.summary ? (
                        <p className="mt-3 max-w-2xl leading-relaxed text-ink-muted">
                          <ContentText value={area.summary} />
                        </p>
                      ) : null}

                      {area.tags.length > 0 ? (
                        <ul aria-label="Topics" className="mt-5 flex flex-wrap gap-2">
                          {area.tags.map((tag) => (
                            <li
                              key={tag}
                              className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent"
                            >
                              <ContentText value={tag} />
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>

                    {area.image ? (
                      <figure className="md:col-span-1">
                        <Image
                          src={area.image}
                          // 제목이 아직 TODO면 그 문자열을 alt로 읽히게 두지 않는다
                          alt={
                            isTodo(area.title)
                              ? "Illustration of a research area"
                              : `Illustration of the ${area.title} research area`
                          }
                          width={800}
                          height={600}
                          className="h-auto w-full rounded-md border border-line"
                        />
                      </figure>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </Container>
    </>
  );
}
