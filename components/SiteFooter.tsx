import ContactDetails, { hasContactDetails } from "@/components/ContactDetails";
import Container from "@/components/Container";
import ContentText from "@/components/ContentText";
import L, { LBlock } from "@/components/L";
import { site } from "@/lib/content";

function AddressLines({ lines }: { lines: string[] }) {
  return (
    <>
      {lines.map((line) => (
        <div key={line}>
          <ContentText value={line} />
        </div>
      ))}
    </>
  );
}

/** 페이지 이동은 헤더가 맡으므로 푸터에는 연구실 정보와 연락처만 둔다. */
export default function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line bg-surface">
      <Container className="grid gap-10 py-12 sm:grid-cols-2">
        <div>
          {/* 헤더·홈 제목은 영문 명칭을 쓰고, 푸터는 한국어 화면에서 국문 명칭을 쓴다 (CLAUDE.md §0) */}
          <p className="font-semibold tracking-tight">
            <L en={site.name} ko={site.nameKo || site.name} />
          </p>
          <p className="mt-1 text-sm text-ink-muted">
            <L {...site.department} />
            <br />
            <L {...site.university} />
          </p>

          <address className="mt-4 space-y-0.5 text-sm not-italic text-ink-muted">
            <LBlock
              en={<AddressLines lines={site.address.en} />}
              ko={<AddressLines lines={site.address.ko} />}
            />
          </address>
        </div>

        {hasContactDetails() ? (
          <div className="sm:justify-self-end">
            <p className="font-semibold tracking-tight">
              <L en="Contact" ko="연락처" />
            </p>
            <ContactDetails className="mt-2 space-y-1 text-sm text-ink-muted" />
          </div>
        ) : null}
      </Container>

      <Container className="border-t border-line py-6 text-xs text-ink-muted">
        © {new Date().getFullYear()} {site.name}
      </Container>
    </footer>
  );
}
