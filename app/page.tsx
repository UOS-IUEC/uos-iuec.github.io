import Container from "@/components/Container";
import ContentText from "@/components/ContentText";
import { site } from "@/lib/content";

/**
 * 셸 확인용 최소 홈. 소개·최근 소식·대표 논문 구성은 #10에서 채운다.
 * create-next-app 샘플 페이지를 걷어내기 위한 자리다.
 */
export default function HomePage() {
  return (
    <Container className="py-20 sm:py-28">
      <p className="text-sm text-ink-muted">
        {site.department} · {site.university}
      </p>
      <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
        {site.name}
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-ink-muted">
        <ContentText value={site.tagline} />
      </p>
    </Container>
  );
}
