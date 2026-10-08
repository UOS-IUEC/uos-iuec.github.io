import ContentText from "@/components/ContentText";
import { isTodo, site } from "@/lib/content";

/** 국내 번호(02-…)를 tel: 링크용 국제 표기(+82-2-…)로 바꾼다. 해외에서 눌러도 걸리게 한다. */
function telHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  return `tel:${digits.startsWith("0") ? `+82${digits.slice(1)}` : digits}`;
}

/** 연락처가 하나라도 있는지. 없으면 쓰는 쪽이 제목까지 통째로 뺀다. */
export function hasContactDetails(): boolean {
  return site.email !== "" || site.phone !== "";
}

/**
 * "E-mail: …", "Tel: …" 두 줄. 푸터와 홈 모집 안내가 같은 값을 같은 표기로 쓰도록 한곳에 둔다.
 * 배치(세로로 쌓을지 한 줄로 늘어놓을지)는 className으로 정한다.
 */
export default function ContactDetails({ className = "" }: { className?: string }) {
  if (!hasContactDetails()) return null;

  return (
    <dl className={className}>
      {site.email !== "" ? (
        <div className="flex gap-2">
          <dt>E-mail:</dt>
          <dd>
            {isTodo(site.email) ? (
              <ContentText value={site.email} />
            ) : (
              <a className="hover:text-accent" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            )}
          </dd>
        </div>
      ) : null}
      {site.phone !== "" ? (
        <div className="flex gap-2">
          <dt>Tel:</dt>
          <dd>
            {isTodo(site.phone) ? (
              <ContentText value={site.phone} />
            ) : (
              <a className="tabular-nums hover:text-accent" href={telHref(site.phone)}>
                {site.phone}
              </a>
            )}
          </dd>
        </div>
      ) : null}
    </dl>
  );
}
