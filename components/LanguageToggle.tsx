"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";

import type { Lang } from "@/lib/content";
import { applyLang, LANG_STORAGE_KEY, readStoredLang } from "@/lib/lang";

const OPTIONS: Array<{ value: Lang; short: string; label: string }> = [
  { value: "en", short: "EN", label: "English" },
  { value: "ko", short: "KO", label: "한국어" },
];

/** <html data-lang>을 언어 상태의 원천으로 삼는다. 속성이 바뀌면 다시 그린다. */
function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-lang"] });
  return () => observer.disconnect();
}

function currentLang(): Lang {
  return document.documentElement.dataset.lang === "ko" ? "ko" : "en";
}

/** 헤더의 EN / KO 전환 버튼. 선택은 브라우저에 저장되어 다른 페이지·다음 방문에도 유지된다. */
export default function LanguageToggle({ className = "" }: { className?: string }) {
  // 서버에서는 기본값(영어)으로 그리고, 하이드레이션 뒤 실제 속성값으로 맞춘다
  const lang = useSyncExternalStore(subscribe, currentLang, () => "en");

  // 개발 모드의 Strict Mode 재마운트가 <html> 속성을 지우는 경우를 되살린다. 운영 빌드에서는 효과 없음.
  useLayoutEffect(() => {
    applyLang(readStoredLang());
  }, []);

  function choose(next: Lang) {
    applyLang(next);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, next);
    } catch {
      // 저장소를 못 쓰는 환경(사생활 보호 모드 등)에서는 이번 페이지에만 적용된다
    }
  }

  return (
    <div
      role="group"
      aria-label="Language / 언어"
      className={`inline-flex shrink-0 rounded-full border border-line bg-surface p-0.5 ${className}`}
    >
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          lang={option.value}
          aria-label={option.label}
          aria-pressed={lang === option.value}
          onClick={() => choose(option.value)}
          className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
            lang === option.value
              ? "bg-canvas text-accent shadow-sm"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          {option.short}
        </button>
      ))}
    </div>
  );
}
