"use client";

import { useState } from "react";

import L from "@/components/L";
import type { Localized, Publication, PublicationPeriod, PublicationType } from "@/lib/content";

import PublicationEntry from "./PublicationEntry";

type YearGroup = { year: number; items: Publication[] };
type TypeOption = { value: PublicationType; label: Localized };

/** "전부 보기" 상태. PublicationType 값과 겹치지 않아야 한다. */
const ALL = "all";

type Selection = PublicationType | typeof ALL;

function filterButtonClass(selected: boolean): string {
  return [
    "rounded-full border px-3 py-1.5 text-sm transition-colors",
    selected
      ? "border-accent bg-accent-soft font-medium text-accent"
      : "border-line text-ink-muted hover:border-ink-muted hover:text-ink",
  ].join(" ");
}

/** 필터를 바꿨을 때 몇 건이 남았는지 알려준다 (aria-live로 읽힌다). */
function countLabel(shown: number, total: number): Localized {
  if (shown === total) {
    return {
      en: `${total} ${total === 1 ? "publication" : "publications"}`,
      ko: `논문 ${total}편`,
    };
  }
  return { en: `${shown} of ${total} publications`, ko: `${total}편 중 ${shown}편` };
}

/**
 * 타입 필터와 연도별 목록. 상호작용이 필요한 부분만 클라이언트로 내리고,
 * 데이터 로딩·정렬은 page.tsx(서버)가 맡는다.
 */
export default function PublicationBrowser({
  groups,
  types,
  periods,
}: {
  groups: YearGroup[];
  types: TypeOption[];
  periods: PublicationPeriod[];
}) {
  const [selected, setSelected] = useState<Selection>(ALL);
  // 처음에는 아무 구간도 고르지 않은 상태(전부 보기). 고른 버튼을 다시 누르면 해제된다.
  const [period, setPeriod] = useState<PublicationPeriod | null>(null);

  // 타입이 한 종류뿐이면 고를 것이 없으므로 필터를 아예 그리지 않는다.
  const showFilter = types.length > 1;

  // 연도 구간 → 타입 순으로 거르고, 그 결과 빈 연도가 생기면 연도째 뺀다.
  const visible = groups
    .filter(
      (group) =>
        period === null ||
        (group.year >= period.from && (period.to === null || group.year <= period.to)),
    )
    .map((group) => ({
      year: group.year,
      items:
        selected === ALL ? group.items : group.items.filter((item) => item.type === selected),
    }))
    .filter((group) => group.items.length > 0);

  const total = groups.reduce((sum, group) => sum + group.items.length, 0);
  const shown = visible.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <div>
      <div
        role="group"
        aria-label="Filter by year range / 연도 구간"
        className="mb-6 flex flex-wrap gap-2"
      >
        {periods.map((option) => {
          const isSelected = period?.id === option.id;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setPeriod(isSelected ? null : option)}
              className={filterButtonClass(isSelected)}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        {showFilter ? (
          <div
            role="group"
            aria-label="Filter by publication type / 논문 종류"
            className="flex flex-wrap gap-2"
          >
            <button
              type="button"
              aria-pressed={selected === ALL}
              onClick={() => setSelected(ALL)}
              className={filterButtonClass(selected === ALL)}
            >
              <L en="All" ko="전체" />
            </button>
            {types.map((type) => (
              <button
                key={type.value}
                type="button"
                aria-pressed={selected === type.value}
                onClick={() => setSelected(type.value)}
                className={filterButtonClass(selected === type.value)}
              >
                <L {...type.label} />
              </button>
            ))}
          </div>
        ) : null}

        <p aria-live="polite" className="text-sm text-ink-muted">
          <L {...countLabel(shown, total)} />
        </p>
      </div>

      {visible.length === 0 ? (
        <p className="mt-10 rounded-lg border border-dashed border-line bg-surface px-5 py-12 text-center text-ink-muted">
          <L en="No publications match this filter." ko="조건에 맞는 논문이 없습니다." />
        </p>
      ) : (
        <div className="mt-10 space-y-12 sm:mt-12">
          {visible.map((group) => (
            <section key={group.year} aria-labelledby={`publications-${group.year}`}>
              <h2
                id={`publications-${group.year}`}
                className="border-b border-line pb-2 text-xl font-semibold tracking-tight"
              >
                {group.year}
              </h2>
              <ul className="mt-6 space-y-8">
                {group.items.map((publication) => (
                  <li key={publication.id}>
                    <PublicationEntry publication={publication} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
