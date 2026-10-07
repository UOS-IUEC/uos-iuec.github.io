import type { Lang } from "@/lib/content";

/**
 * 한/영 전환 상태는 <html data-lang lang>과 localStorage에 둔다.
 * 정적 사이트라 서버가 언어를 알 수 없으므로, 페이지는 두 언어를 다 담고
 * CSS가 하나를 숨긴다 (components/L.tsx, app/globals.css의 ko: 변형).
 */
export const LANG_STORAGE_KEY = "lang";

/**
 * <head>에서 첫 페인트 전에 실행되는 스크립트. 저장된 선택을 미리 적용해
 * 영어가 잠깐 보였다가 한국어로 바뀌는 깜빡임을 막는다.
 */
export const LANG_INIT_SCRIPT = `(function(){try{if(localStorage.getItem("${LANG_STORAGE_KEY}")==="ko"){var h=document.documentElement;h.setAttribute("data-lang","ko");h.setAttribute("lang","ko")}}catch(e){}})()`;

export function readStoredLang(): Lang {
  try {
    return localStorage.getItem(LANG_STORAGE_KEY) === "ko" ? "ko" : "en";
  } catch {
    return "en";
  }
}

export function applyLang(lang: Lang): void {
  const root = document.documentElement;
  root.setAttribute("data-lang", lang);
  root.setAttribute("lang", lang);
}
