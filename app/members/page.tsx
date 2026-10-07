import type { Metadata } from "next";

import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import { alumni, membersByRole, professor, site } from "@/lib/content";

import MembersContent from "./MembersContent";

/** 연구실 이름은 하드코딩하지 않는다 (CLAUDE.md §4-1). site.name은 미확정 값이 아니다. */
export const metadata: Metadata = {
  title: "Members",
  description: `Faculty, researchers, and students of the ${site.name} at the ${site.university.en}, together with the center's alumni.`,
};

export default function MembersPage() {
  return (
    <>
      <PageHeader
        title={{ en: "Members", ko: "구성원" }}
        lead={{
          en: "Faculty, researchers, and students of the center, together with the alumni who have moved on.",
          ko: "연구센터의 교수와 학생, 그리고 졸업생을 소개합니다.",
        }}
      />

      <Container className="py-12 sm:py-16">
        <MembersContent professor={professor} groups={membersByRole()} alumni={alumni()} />
      </Container>
    </>
  );
}
