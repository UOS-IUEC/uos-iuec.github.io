import { Fragment, type ReactNode } from "react";

import ContentText from "@/components/ContentText";
import {
  isMemberName,
  isTodo,
  PUBLICATION_TYPE_LABEL,
  type Publication,
} from "@/lib/content";

type EntryLink = { key: string; label: string; href: string };
type CitationPart = { key: string; node: ReactNode };

/** 빈 문자열인 필드는 링크로 그리지 않는다. */
function entryLinks(publication: Publication): EntryLink[] {
  const links: EntryLink[] = [];

  // doi에는 식별자만 담기고(예: "10.1109/TAP.2026.1234"), 주소는 여기서 만든다.
  if (publication.doi) {
    links.push({
      key: "doi",
      label: "DOI",
      href: `https://doi.org/${publication.doi}`,
    });
  }
  if (publication.url) links.push({ key: "url", label: "Publisher", href: publication.url });
  if (publication.pdf) links.push({ key: "pdf", label: "PDF", href: publication.pdf });
  if (publication.code) links.push({ key: "code", label: "Code", href: publication.code });

  return links;
}

/**
 * 게재 정보 한 줄. 채워진 필드만 쉼표로 잇는다.
 * volume·pages에는 번호만 들어온다고 보고 "vol." "pp." 표기를 여기서 붙인다.
 */
function citationParts(publication: Publication): CitationPart[] {
  const parts: CitationPart[] = [];

  if (publication.venue) {
    parts.push({
      key: "venue",
      node: (
        <span className="italic">
          <ContentText value={publication.venue} />
        </span>
      ),
    });
  }
  if (publication.volume) {
    parts.push({ key: "volume", node: <>vol. {publication.volume}</> });
  }
  if (publication.pages) {
    parts.push({ key: "pages", node: <>pp. {publication.pages}</> });
  }
  parts.push({ key: "year", node: <>{publication.year}</> });

  return parts;
}

/** 논문 한 건. 목록 항목 안에서 쓰이므로 제목은 h3다 (연도가 h2). */
export default function PublicationEntry({ publication }: { publication: Publication }) {
  const parts = citationParts(publication);
  const links = entryLinks(publication);

  // 제목이 아직 TODO면 그 문자열을 링크 이름으로 읽히게 두지 않는다.
  const linkContext = isTodo(publication.title) ? "this publication" : publication.title;

  return (
    <article>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-line bg-surface px-2.5 py-0.5 text-xs font-medium text-ink-muted">
          {PUBLICATION_TYPE_LABEL[publication.type]}
        </span>
        {publication.award ? (
          <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">
            <ContentText value={publication.award} />
          </span>
        ) : null}
      </div>

      <h3 className="mt-2 break-words text-base font-medium leading-snug sm:text-lg">
        <ContentText value={publication.title} />
      </h3>

      {/* 연구실 구성원만 강조한다. 판정은 여기서 하고 JSON에는 마크업을 넣지 않는다 */}
      <p className="mt-1.5 text-sm leading-relaxed">
        {publication.authors.map((author, index) => (
          <Fragment key={`${author}-${index}`}>
            {index > 0 ? <span className="text-ink-muted">, </span> : null}
            <span
              className={isMemberName(author) ? "font-medium text-ink" : "text-ink-muted"}
            >
              <ContentText value={author} />
            </span>
          </Fragment>
        ))}
      </p>

      <p className="mt-1 text-sm text-ink-muted">
        {parts.map((part, index) => (
          <Fragment key={part.key}>
            {index > 0 ? ", " : null}
            {part.node}
          </Fragment>
        ))}
      </p>

      {links.length > 0 ? (
        <ul className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1">
          {links.map((link) => (
            <li key={link.key}>
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${link.label} for ${linkContext}`}
                className="text-sm font-medium text-accent underline-offset-4 hover:underline"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
