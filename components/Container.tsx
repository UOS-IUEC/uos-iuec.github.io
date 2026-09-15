import type { ReactNode } from "react";

/** 모든 페이지가 같은 좌우 여백과 최대 폭을 쓰도록 하는 래퍼. */
export default function Container({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`mx-auto w-full max-w-5xl px-5 sm:px-8 ${className}`}>{children}</div>
  );
}
