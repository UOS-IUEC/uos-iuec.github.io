import L from "@/components/L";
import type { Member, MemberRole, Professor } from "@/lib/content";

import ProfessorProfile from "./ProfessorProfile";

type RoleGroup = { role: MemberRole; label: { en: string; ko: string }; members: Member[] };

/** 한국어 이름이 없으면 영문 이름을 양쪽에 쓴다. */
function MemberName({ member }: { member: Member }) {
  return <L en={member.name} ko={member.nameKo || member.name} />;
}

/**
 * Members 본문. 교수 소개가 위, 학생이 아래 (헤더 하위 메뉴 #professor·#students).
 * 언어는 헤더의 전환 버튼을 따른다.
 */
export default function MembersContent({
  professor,
  groups,
  alumni,
}: {
  professor: Professor;
  groups: RoleGroup[];
  alumni: Member[];
}) {
  return (
    <div>
      <ProfessorProfile professor={professor} />

      <section id="students" aria-labelledby="students-heading" className="mt-20 scroll-mt-24">
        <h2
          id="students-heading"
          className="border-b border-line pb-3 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          <L en="Students" ko="학생" />
        </h2>

        {groups.length === 0 ? (
          <p className="mt-8 text-ink-muted">
            <L en="No students are listed yet." ko="등록된 학생이 아직 없습니다." />
          </p>
        ) : (
          // 이름만 나열한다. 과정 | 이름들 두 열, 좁은 화면에서는 과정이 위로 올라간다.
          <dl className="mt-8 divide-y divide-line">
            {groups.map((group) => (
              <div
                key={group.role}
                className="grid gap-x-8 gap-y-2 py-5 first:pt-0 sm:grid-cols-[10rem_1fr]"
              >
                <dt className="font-semibold text-ink">
                  <L {...group.label} />
                </dt>
                <dd>
                  <ul className="flex flex-wrap gap-x-8 gap-y-2 text-ink">
                    {group.members.map((member) => (
                      <li key={member.id}>
                        <MemberName member={member} />
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        )}

        {/* 졸업생은 이름과 진로 정보만 (title에 담겨 있다) */}
        {alumni.length > 0 ? (
          <section aria-labelledby="role-alumni" className="mt-16 border-t border-line pt-10">
            <h3 id="role-alumni" className="font-semibold text-ink">
              <L en="Alumni" ko="졸업생" />
            </h3>
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {alumni.map((member) => (
                <li
                  key={member.id}
                  className="flex flex-col gap-0.5 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                >
                  <span className="font-medium">
                    <MemberName member={member} />
                  </span>
                  {member.title ? (
                    <span className="text-sm text-ink-muted sm:text-right">{member.title}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </section>
    </div>
  );
}
