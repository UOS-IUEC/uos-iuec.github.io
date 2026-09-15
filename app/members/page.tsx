import type { Metadata } from "next";
import Image from "next/image";

import Container from "@/components/Container";
import ContentText from "@/components/ContentText";
import PageHeader from "@/components/PageHeader";
import { alumni, isTodo, membersByRole, site, type Member } from "@/lib/content";

/** 연구실 이름은 하드코딩하지 않는다 (CLAUDE.md §4-1). site.name은 미확정 값이 아니다. */
export const metadata: Metadata = {
  title: "Members",
  description: `Faculty, researchers, and students of the ${site.name} at the ${site.university}, together with the center's alumni.`,
};

/** 카드에 그릴 외부 링크. Member.links의 키 순서를 여기서 정한다. */
const PROFILE_LINKS = [
  { key: "homepage", label: "Homepage" },
  { key: "scholar", label: "Scholar" },
  { key: "github", label: "GitHub" },
  { key: "linkedin", label: "LinkedIn" },
] as const;

/**
 * 사진이 없을 때 쓰는 이니셜.
 * 이름이 아직 미확정("TODO: ...")이면 의미 없는 글자가 나오므로 빈 문자열을 돌려주고,
 * 플레이스홀더 블록은 글자 없이 자리만 잡는다.
 */
function initials(name: string): string {
  if (isTodo(name)) return "";

  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

/** 값이 비어 있거나 미확정이면 링크로 걸 수 없다. */
function isUsableLink(value: string): boolean {
  return value !== "" && !isTodo(value);
}

function MemberCard({ member }: { member: Member }) {
  const links = PROFILE_LINKS.map((link) => ({
    ...link,
    href: member.links[link.key] ?? "",
  })).filter((link) => isUsableLink(link.href));

  return (
    <article className="flex gap-4 rounded-lg border border-line bg-canvas p-4">
      {/* 사진 유무와 상관없이 같은 크기를 차지하게 해서 격자가 흔들리지 않도록 한다 */}
      {member.photo ? (
        <Image
          src={member.photo}
          alt={`Portrait of ${member.name}`}
          width={192}
          height={192}
          className="h-20 w-20 shrink-0 rounded-md object-cover sm:h-24 sm:w-24"
        />
      ) : (
        <div
          aria-hidden="true"
          className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md bg-surface text-lg font-medium text-ink-muted sm:h-24 sm:w-24"
        >
          {initials(member.name)}
        </div>
      )}

      <div className="min-w-0">
        <h3 className="font-medium tracking-tight">
          <ContentText value={member.name} />
        </h3>
        {member.title ? (
          <p className="mt-0.5 text-sm text-ink-muted">
            <ContentText value={member.title} />
          </p>
        ) : null}

        {member.interests.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {member.interests.map((interest) => (
              <li
                key={interest}
                className={
                  isTodo(interest)
                    ? "text-xs"
                    : "rounded bg-accent-soft px-2 py-0.5 text-xs text-accent"
                }
              >
                <ContentText value={interest} />
              </li>
            ))}
          </ul>
        ) : null}

        {member.email ? (
          <p className="mt-3 text-sm break-words">
            {isTodo(member.email) ? (
              <ContentText value={member.email} />
            ) : (
              <a className="text-accent hover:underline" href={`mailto:${member.email}`}>
                {member.email}
              </a>
            )}
          </p>
        ) : null}

        {links.length > 0 ? (
          <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm">
            {links.map((link) => (
              <li key={link.key}>
                <a
                  className="text-ink-muted hover:text-accent"
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${member.name} — ${link.label}`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}

export default function MembersPage() {
  const groups = membersByRole();
  const formerMembers = alumni();

  return (
    <>
      <PageHeader
        title="Members"
        lead="Faculty, researchers, and students of the center, together with the alumni who have moved on."
      />

      <Container className="py-12 sm:py-16">
        {groups.length === 0 ? (
          <p className="text-ink-muted">
            {formerMembers.length === 0
              ? "Member profiles are not published yet."
              : "No current members are listed yet."}
          </p>
        ) : (
          <div className="space-y-12">
            {groups.map((group) => (
              <section key={group.role} aria-labelledby={`role-${group.role}`}>
                <h2
                  id={`role-${group.role}`}
                  className="text-sm font-semibold tracking-wide text-ink-muted uppercase"
                >
                  {group.label}
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {group.members.map((member) => (
                    <MemberCard key={member.id} member={member} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* 졸업생은 사진 없이 이름과 진로 정보만 (title에 담겨 있다) */}
        {formerMembers.length > 0 ? (
          <section
            aria-labelledby="role-alumni"
            className="mt-16 border-t border-line pt-10"
          >
            <h2
              id="role-alumni"
              className="text-sm font-semibold tracking-wide text-ink-muted uppercase"
            >
              Alumni
            </h2>
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {formerMembers.map((member) => (
                <li
                  key={member.id}
                  className="flex flex-col gap-0.5 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                >
                  <span className="font-medium">
                    <ContentText value={member.name} />
                  </span>
                  {member.title ? (
                    <span className="text-sm text-ink-muted sm:text-right">
                      <ContentText value={member.title} />
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </Container>
    </>
  );
}
