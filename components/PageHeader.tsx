import Container from "@/components/Container";
import L from "@/components/L";
import type { Localized } from "@/lib/content";

/** 모든 하위 페이지가 같은 형태의 제목 영역을 쓰도록 하는 컴포넌트. 제목·설명은 한/영 한 쌍. */
export default function PageHeader({ title, lead }: { title: Localized; lead?: Localized }) {
  return (
    <header className="border-b border-line bg-surface">
      <Container className="py-12 sm:py-16">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          <L {...title} />
        </h1>
        {lead ? (
          <p className="mt-3 max-w-2xl break-keep text-ink-muted">
            <L {...lead} />
          </p>
        ) : null}
      </Container>
    </header>
  );
}
