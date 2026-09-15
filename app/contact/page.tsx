import type { Metadata } from "next";

import Container from "@/components/Container";
import ContentText from "@/components/ContentText";
import PageHeader from "@/components/PageHeader";
import { isTodo, site } from "@/lib/content";

/**
 * 확정된 연락 수단만 설명에 열거한다. 빈 값은 행 자체가 없고 미확정 값은 TODO 문구로만
 * 보이므로, 검색 결과 설명이 페이지에 없는 정보를 있다고 말하면 안 된다(§4-2).
 * layout.tsx가 tagline을 다루는 방식과 같다.
 */
const listedDetails = [
  site.email !== "" && !isTodo(site.email) ? "email" : null,
  site.phone !== "" && !isTodo(site.phone) ? "phone" : null,
  "campus address",
].filter((detail): detail is string => detail !== null);

export const metadata: Metadata = {
  title: "Contact",
  description: `How to reach the ${site.name} (${site.shortName}) at the ${site.department}, ${site.university} — ${listedDetails.join(", ")}.`,
};

/**
 * site.links에서 보여줄 항목과 그 순서. 서비스 이름은 화면 문구라 여기서 정하지만,
 * 소속 대학명은 콘텐츠이므로 site.json에서 가져온다(§4-1).
 * 비어 있거나 아직 미확정("TODO: ...")인 주소는 링크로 만들지 않는다.
 */
const EXTERNAL_LINKS = [
  { key: "university", label: site.university },
  { key: "github", label: "GitHub" },
  { key: "scholar", label: "Google Scholar" },
] as const;

export default function ContactPage() {
  const externalLinks = EXTERNAL_LINKS.map((link) => ({
    ...link,
    href: site.links[link.key] ?? "",
  })).filter((link) => link.href !== "" && !isTodo(link.href));

  // 빈 줄은 건너뛴다. 값이 아직 미확정이면 표시는 ContentText가 맡는다.
  const addressLines = [
    site.address.line1,
    site.address.line2,
    site.address.city,
    site.address.country,
  ].filter((line) => line !== "");

  const hasEmail = site.email !== "";
  const hasPhone = site.phone !== "";

  // 미확정 값으로는 mailto:/tel: 주소를 만들 수 없다. 그때는 값만 그대로 보여준다.
  const mailtoHref = hasEmail && !isTodo(site.email) ? `mailto:${site.email}` : "";
  const telHref =
    hasPhone && !isTodo(site.phone) ? `tel:${site.phone.replace(/[^+\d]/g, "")}` : "";

  return (
    <>
      <PageHeader
        title="Contact"
        lead="Questions about our research and possible collaborations are welcome. Email is the fastest way to reach us."
      />

      <Container className="py-12 sm:py-16">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <section aria-labelledby="contact-details">
            <h2 id="contact-details" className="text-xl font-semibold tracking-tight">
              Get in touch
            </h2>

            {hasEmail || hasPhone ? (
              <dl className="mt-5 divide-y divide-line border-y border-line">
                {hasEmail ? (
                  <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-6">
                    <dt className="shrink-0 text-sm font-medium text-ink-muted sm:w-20">
                      Email
                    </dt>
                    <dd className="min-w-0 break-words">
                      {mailtoHref ? (
                        <a
                          className="text-accent underline underline-offset-4 hover:no-underline"
                          href={mailtoHref}
                        >
                          {site.email}
                        </a>
                      ) : (
                        <ContentText value={site.email} />
                      )}
                    </dd>
                  </div>
                ) : null}

                {hasPhone ? (
                  <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-6">
                    <dt className="shrink-0 text-sm font-medium text-ink-muted sm:w-20">
                      Phone
                    </dt>
                    <dd className="min-w-0 break-words">
                      {telHref ? (
                        <a
                          className="text-accent underline underline-offset-4 hover:no-underline"
                          href={telHref}
                        >
                          {site.phone}
                        </a>
                      ) : (
                        <ContentText value={site.phone} />
                      )}
                    </dd>
                  </div>
                ) : null}
              </dl>
            ) : (
              <p className="mt-5 text-ink-muted">
                Contact details for the lab have not been published yet.
              </p>
            )}

            {/* 정적 사이트라 문의 폼을 둘 수 없다 (CLAUDE.md §5). 대신 메일로 안내한다. */}
            <div className="mt-8 rounded-lg border border-line bg-surface p-5">
              <h3 className="text-sm font-semibold">Sending an inquiry</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                This site has no contact form. Please write to us directly — a short note on
                your affiliation and what you are interested in helps us reply faster.
              </p>
              {mailtoHref ? (
                <a
                  className="mt-4 inline-block rounded-md bg-accent px-4 py-2 text-sm font-medium text-canvas hover:opacity-90"
                  href={mailtoHref}
                >
                  Email {site.shortName}
                </a>
              ) : null}
            </div>
          </section>

          <section aria-labelledby="contact-address">
            <h2 id="contact-address" className="text-xl font-semibold tracking-tight">
              Address
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              {site.department}
              <br />
              {site.university}
            </p>

            {addressLines.length > 0 ? (
              <address className="mt-5 space-y-1 not-italic leading-relaxed">
                {addressLines.map((line, index) => (
                  <div key={`${index}-${line}`} className="break-words">
                    <ContentText value={line} />
                  </div>
                ))}
              </address>
            ) : (
              <p className="mt-5 text-ink-muted">
                The lab address has not been published yet.
              </p>
            )}
          </section>
        </div>

        <section
          aria-labelledby="contact-elsewhere"
          className="mt-14 border-t border-line pt-10"
        >
          <h2 id="contact-elsewhere" className="text-xl font-semibold tracking-tight">
            Elsewhere online
          </h2>

          {externalLinks.length > 0 ? (
            <ul className="mt-5 flex flex-wrap gap-3">
              {externalLinks.map((link) => (
                <li key={link.key} className="min-w-0">
                  <a
                    className="inline-flex max-w-full items-center gap-2 rounded-md border border-line px-3 py-2 text-sm hover:border-accent hover:text-accent"
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="truncate">{link.label}</span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className="shrink-0"
                    >
                      <path d="M5 2h7v7" />
                      <path d="M12 2L5.5 8.5" />
                      <path d="M10 9.5V12H2V4h2.5" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-5 text-ink-muted">
              No external profiles are listed for the lab yet.
            </p>
          )}
        </section>
      </Container>
    </>
  );
}
