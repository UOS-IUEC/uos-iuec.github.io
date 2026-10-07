import type { Metadata } from "next";

import Container from "@/components/Container";
import L from "@/components/L";
import PageHeader from "@/components/PageHeader";
import { pastProjects, researchAreas, site } from "@/lib/content";

import ResearchAreas from "./ResearchAreas";

/** 설명에는 TODO가 섞이면 안 되므로 확정된 소속 정보만 조합한다. */
export const metadata: Metadata = {
  title: "Research",
  description: `Research areas of the ${site.name}, ${site.department.en}, ${site.university.en}.`,
};

export default function ResearchPage() {
  const areas = researchAreas;

  return (
    <>
      <PageHeader
        title={{ en: "Research", ko: "연구" }}
        lead={{
          en: "An overview of the topics the group works on, with a short description of each area.",
          ko: "연구실이 수행하고 있는 연구 주제와 각 분야에 대한 간단한 소개입니다.",
        }}
      />

      <Container className="py-12 sm:py-16">
        {areas.length === 0 ? (
          <p className="rounded-lg border border-dashed border-line bg-surface px-5 py-12 text-center text-ink-muted">
            <L en="Research areas will be listed here." ko="연구 분야가 이곳에 표시됩니다." />
          </p>
        ) : (
          <ResearchAreas areas={areas} pastProjects={pastProjects} />
        )}
      </Container>
    </>
  );
}
