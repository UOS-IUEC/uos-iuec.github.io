import Link from "next/link";

import Container from "@/components/Container";
import ContentText from "@/components/ContentText";
import L, { LBlock } from "@/components/L";
import { isTodo, site, type Localized } from "@/lib/content";
import { NAV_ITEMS } from "@/lib/nav";

const EXTERNAL_LINKS: ReadonlyArray<{ key: "university" | "github" | "scholar"; label: Localized }> = [
  { key: "university", label: site.university },
  { key: "github", label: { en: "GitHub", ko: "GitHub" } },
  { key: "scholar", label: { en: "Google Scholar", ko: "Google Scholar" } },
];

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

export default function SiteFooter() {
  const external = EXTERNAL_LINKS.map((link) => ({
    ...link,
    href: site.links[link.key] ?? "",
  })).filter((link) => link.href !== "" && !isTodo(link.href));

  return (
    <footer className="mt-20 border-t border-line bg-surface">
      <Container className="grid gap-10 py-12 sm:grid-cols-2">
        <div>
          <p className="font-semibold tracking-tight">{site.name}</p>
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
            {site.email ? (
              <div className="pt-1">
                {isTodo(site.email) ? (
                  <ContentText value={site.email} />
                ) : (
                  <a className="hover:text-accent" href={`mailto:${site.email}`}>
                    {site.email}
                  </a>
                )}
              </div>
            ) : null}
          </address>
        </div>

        <div className="sm:justify-self-end">
          <nav aria-label="Footer">
            <ul className="space-y-2 text-sm">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link className="text-ink-muted hover:text-accent" href={item.href}>
                    <L {...item.label} />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {external.length > 0 ? (
            <ul className="mt-6 space-y-2 text-sm">
              {external.map((link) => (
                <li key={link.key}>
                  <a
                    className="text-ink-muted hover:text-accent"
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <L {...link.label} />
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </Container>

      <Container className="border-t border-line py-6 text-xs text-ink-muted">
        © {new Date().getFullYear()} {site.name}
      </Container>
    </footer>
  );
}
