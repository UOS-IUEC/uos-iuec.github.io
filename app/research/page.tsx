import type { Metadata } from "next";

import Container from "@/components/Container";
import L from "@/components/L";
import PageHeader from "@/components/PageHeader";
import { pastProjects, researchThemes, site } from "@/lib/content";

import ResearchAreas from "./ResearchAreas";

/** 설명에는 TODO가 섞이면 안 되므로 확정된 소속 정보만 조합한다. */
export const metadata: Metadata = {
  title: "Research",
  description: `Research areas of the ${site.name}, ${site.department.en}, ${site.university.en}.`,
};

export default function ResearchPage() {
  return (
    <>
      <PageHeader title={{ en: "Research", ko: "연구" }} />

      <Container className="py-12 sm:py-16">
        {researchThemes.length === 0 ? (
          <p className="rounded-lg border border-dashed border-line bg-surface px-5 py-12 text-center text-ink-muted">
            <L en="Research areas will be listed here." ko="연구 분야가 이곳에 표시됩니다." />
          </p>
        ) : (
          <ResearchAreas themes={researchThemes} pastProjects={pastProjects} />
        )}
      </Container>
    </>
  );
}
