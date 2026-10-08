import type { Metadata } from "next";

import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import { isTodo, professor, site } from "@/lib/content";

import ProfessorProfile from "../ProfessorProfile";

/** 교수 이름은 검색 유입 경로라 설명에 넣는다. 미확정(TODO)이면 소속만 쓴다 (CLAUDE.md §7). */
export const metadata: Metadata = {
  title: "Professor",
  description: isTodo(professor.name.en)
    ? `Professor of the ${site.name} at the ${site.university.en}.`
    : `${professor.name.en}, professor of the ${site.name} at the ${site.university.en}: experience, education, and awards.`,
};

export default function ProfessorPage() {
  return (
    <>
      <PageHeader title={{ en: "Professor", ko: "교수" }} />

      <Container className="py-12 sm:py-16">
        <ProfessorProfile professor={professor} />
      </Container>
    </>
  );
}
