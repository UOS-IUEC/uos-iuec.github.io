import type { Metadata } from "next";

import Container from "@/components/Container";
import L from "@/components/L";
import PageHeader from "@/components/PageHeader";
import { albumEvents, site } from "@/lib/content";

import AlbumGallery from "./AlbumGallery";

export const metadata: Metadata = {
  title: "Album",
  description: `Photos from conferences and events of the ${site.name}, ${site.university.en}.`,
};

export default function AlbumPage() {
  const events = albumEvents();

  return (
    <>
      <PageHeader title={{ en: "Album", ko: "앨범" }} />

      <Container className="py-12 sm:py-16">
        {events.length === 0 ? (
          <p className="rounded-lg border border-dashed border-line bg-surface px-5 py-12 text-center text-ink-muted">
            <L
              en="Photos from conferences and lab events will appear here."
              ko="학회 참석과 연구실 행사 사진이 이곳에 올라옵니다."
            />
          </p>
        ) : (
          <AlbumGallery events={events} />
        )}
      </Container>
    </>
  );
}
