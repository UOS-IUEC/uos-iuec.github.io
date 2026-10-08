import Container from "@/components/Container";
import L from "@/components/L";
import type { Localized } from "@/lib/content";

/**
 * 모든 하위 페이지가 같은 형태의 제목 영역을 쓰도록 하는 컴포넌트. 제목은 한/영 한 쌍.
 * 제목을 되풀이하는 설명 문장은 두지 않는다 — 띠만 커지고 정보가 늘지 않는다.
 */
export default function PageHeader({ title }: { title: Localized }) {
  return (
    <header className="border-b border-line bg-surface">
      <Container className="py-8 sm:py-10">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          <L {...title} />
        </h1>
      </Container>
    </header>
  );
}
