import type { Metadata } from "next";

import Container from "@/components/Container";
import ContentText from "@/components/ContentText";
import L, { LBlock } from "@/components/L";
import PageHeader from "@/components/PageHeader";
import { isTodo, site, type Localized } from "@/lib/content";

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
  description: `How to reach the ${site.name} (${site.shortName}) at the ${site.department.en}, ${site.university.en} — ${listedDetails.join(", ")}.`,
};

/**
 * site.links에서 보여줄 항목과 그 순서. 서비스 이름은 화면 문구라 여기서 정하지만,
 * 소속 대학명은 콘텐츠이므로 site.json에서 가져온다(§4-1).
 * 비어 있거나 아직 미확정("TODO: ...")인 주소는 링크로 만들지 않는다.
 */
const EXTERNAL_LINKS: ReadonlyArray<{ key: "university" | "github" | "scholar"; label: Localized }> = [
  { key: "university", label: site.university },
  { key: "github", label: { en: "GitHub", ko: "GitHub" } },
  { key: "scholar", label: { en: "Google Scholar", ko: "Google Scholar" } },
];

function AddressLines({ lines }: { lines: string[] }) {
  return (
    <address className="mt-5 space-y-1 not-italic leading-relaxed">
      {lines.map((line, index) => (
        <div key={`${index}-${line}`} className="break-words">
          <ContentText value={line} />
        </div>
      ))}
    </address>
  );
}

export default function ContactPage() {
  const externalLinks = EXTERNAL_LINKS.map((link) => ({
    ...link,
    href: site.links[link.key] ?? "",
  })).filter((link) => link.href !== "" && !isTodo(link.href));

  const hasEmail = site.email !== "";
  const hasPhone = site.phone !== "";
  const hasAddress = site.address.en.length > 0 || site.address.ko.length > 0;

  // 미확정 값으로는 mailto:/tel: 주소를 만들 수 없다. 그때는 값만 그대로 보여준다.
  const mailtoHref = hasEmail && !isTodo(site.email) ? `mailto:${site.email}` : "";
  const telHref =
    hasPhone && !isTodo(site.phone) ? `tel:${site.phone.replace(/[^+\d]/g, "")}` : "";

  return (
    <>
      <PageHeader
        title={{ en: "Contact", ko: "연락처" }}
        lead={{
          en: "Questions about our research and possible collaborations are welcome. Email is the fastest way to reach us.",
          ko: "연구 내용이나 협력에 관한 문의를 환영합니다. 이메일로 연락 주시면 가장 빠르게 답변드릴 수 있습니다.",
        }}
      />

      <Container className="py-12 sm:py-16">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <section aria-labelledby="contact-details">
            <h2 id="contact-details" className="text-xl font-semibold tracking-tight">
              <L en="Get in touch" ko="문의하기" />
            </h2>

            {hasEmail || hasPhone ? (
              <dl className="mt-5 divide-y divide-line border-y border-line">
                {hasEmail ? (
                  <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-6">
                    <dt className="shrink-0 text-sm font-medium text-ink-muted sm:w-20">
                      <L en="Email" ko="이메일" />
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
                      <L en="Phone" ko="전화" />
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
                <L
                  en="Contact details for the lab have not been published yet."
                  ko="연구실 연락처가 아직 등록되지 않았습니다."
                />
              </p>
            )}

            {/* 정적 사이트라 문의 폼을 둘 수 없다 (CLAUDE.md §5). 대신 메일로 안내한다. */}
            <div className="mt-8 rounded-lg border border-line bg-surface p-5">
              <h3 className="text-sm font-semibold">
                <L en="Sending an inquiry" ko="문의 안내" />
              </h3>
              <p className="mt-2 break-keep text-sm leading-relaxed text-ink-muted">
                <L
                  en="This site has no contact form. Please write to us directly — a short note on your affiliation and what you are interested in helps us reply faster."
                  ko="이 사이트에는 문의 양식이 없습니다. 이메일로 직접 연락해 주세요. 소속과 관심 있는 내용을 간단히 적어 주시면 더 빠르게 답변드릴 수 있습니다."
                />
              </p>
            </div>
          </section>

          <section aria-labelledby="contact-address">
            <h2 id="contact-address" className="text-xl font-semibold tracking-tight">
              <L en="Address" ko="주소" />
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              <L {...site.department} />
              <br />
              <L {...site.university} />
            </p>

            {hasAddress ? (
              <LBlock
                en={<AddressLines lines={site.address.en} />}
                ko={<AddressLines lines={site.address.ko} />}
              />
            ) : (
              <p className="mt-5 text-ink-muted">
                <L
                  en="The lab address has not been published yet."
                  ko="연구실 주소가 아직 등록되지 않았습니다."
                />
              </p>
            )}
          </section>
        </div>

        <section
          aria-labelledby="contact-elsewhere"
          className="mt-14 border-t border-line pt-10"
        >
          <h2 id="contact-elsewhere" className="text-xl font-semibold tracking-tight">
            <L en="Elsewhere online" ko="온라인 채널" />
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
                    <span className="truncate">
                      <L {...link.label} />
                    </span>
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
              <L
                en="No external profiles are listed for the lab yet."
                ko="등록된 외부 채널이 아직 없습니다."
              />
            </p>
          )}
        </section>
      </Container>
    </>
  );
}
