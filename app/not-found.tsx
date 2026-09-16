import type { Metadata } from "next";
import Link from "next/link";

import Container from "@/components/Container";
import { NAV_ITEMS } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Page not found",
};

/**
 * Next 기본 404는 자체 스타일을 주입해서 사이트와 따로 논다.
 * 정적 export에서는 이 페이지가 out/404.html 이 되고, GitHub Pages가 그것을 쓴다.
 */
export default function NotFound() {
  return (
    <Container className="py-24 sm:py-32">
      <p className="text-sm font-medium text-accent">404</p>

      <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
        Page not found
      </h1>

      <p className="mt-4 max-w-xl leading-relaxed text-ink-muted">
        The page you are looking for does not exist, or it may have moved.
      </p>

      <nav aria-label="Site sections" className="mt-8">
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <li>
            <Link href="/" className="text-accent hover:underline">
              Home
            </Link>
          </li>
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="text-accent hover:underline">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Container>
  );
}
