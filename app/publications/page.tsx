import type { Metadata } from "next";

import Container from "@/components/Container";
import PageHeader from "@/components/PageHeader";
import {
  PUBLICATION_TYPE_LABEL,
  publicationTypesInUse,
  publicationsByYear,
  site,
} from "@/lib/content";

import PublicationBrowser from "./PublicationBrowser";

/** 설명에는 TODO가 섞이면 안 되므로 확정된 소속 정보만 조합한다. */
export const metadata: Metadata = {
  title: "Publications",
  description: `Journal articles, conference papers and other output from the ${site.name}, ${site.department}, ${site.university}.`,
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
        title="Publications"
        lead="Peer-reviewed articles, conference papers and other output from the group, listed by year with the most recent first."
      />

      <Container className="py-12 sm:py-16">
        {groups.length === 0 ? (
          <p className="rounded-lg border border-dashed border-line bg-surface px-5 py-12 text-center text-ink-muted">
            Publications will be listed here.
          </p>
        ) : (
          <PublicationBrowser groups={groups} types={types} />
        )}
      </Container>
    </>
  );
}
