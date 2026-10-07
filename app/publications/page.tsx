import type { Metadata } from "next";

import Container from "@/components/Container";
import L from "@/components/L";
import PageHeader from "@/components/PageHeader";
import {
  PUBLICATION_PERIODS,
  PUBLICATION_TYPE_LABEL,
  publicationTypesInUse,
  publicationsByYear,
  site,
} from "@/lib/content";

import PublicationBrowser from "./PublicationBrowser";

/** 설명에는 TODO가 섞이면 안 되므로 확정된 소속 정보만 조합한다. */
export const metadata: Metadata = {
  title: "Publications",
  description: `Journal articles, conference papers and other output from the ${site.name}, ${site.department.en}, ${site.university.en}.`,
};

export default function PublicationsPage() {
  const groups = publicationsByYear();

  // 라벨까지 여기서 붙여 넘긴다. 필터 컴포넌트가 타입 목록의 표기 규칙을
  // 따로 알 필요가 없고, 실제로 존재하는 타입만 버튼이 된다.
  const types = publicationTypesInUse().map((type) => ({
    value: type,
    label: PUBLICATION_TYPE_LABEL[type],
  }));

  return (
    <>
      <PageHeader
        title={{ en: "Publications", ko: "논문" }}
        lead={{
          en: "Peer-reviewed articles, conference papers and other output from the group, listed by year with the most recent first.",
          ko: "연구실이 발표한 학술지 논문과 학술대회 논문 등을 최신 연도순으로 정리했습니다.",
        }}
      />

      <Container className="py-12 sm:py-16">
        {groups.length === 0 ? (
          <p className="rounded-lg border border-dashed border-line bg-surface px-5 py-12 text-center text-ink-muted">
            <L en="Publications will be listed here." ko="논문 목록이 이곳에 표시됩니다." />
          </p>
        ) : (
          <PublicationBrowser groups={groups} types={types} periods={PUBLICATION_PERIODS} />
        )}
      </Container>
    </>
  );
}
