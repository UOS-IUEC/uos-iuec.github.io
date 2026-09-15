"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import Container from "@/components/Container";
import { site } from "@/lib/content";
import { NAV_ITEMS } from "@/lib/nav";

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="min-w-0 leading-tight hover:text-accent"
          aria-label={`${site.name} home`}
        >
          <span className="block truncate text-base font-semibold tracking-tight">
            {site.shortName}
          </span>
          <span className="hidden truncate text-xs text-ink-muted sm:block">{site.name}</span>
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`rounded px-3 py-2 text-sm transition-colors hover:bg-surface ${
                    isActive(item.href) ? "font-medium text-accent" : "text-ink-muted"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="-mr-2 rounded p-2 text-ink-muted hover:bg-surface md:hidden"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {open ? (
              <>
                <path d="M5 5l12 12" />
                <path d="M17 5L5 17" />
              </>
            ) : (
              <>
                <path d="M3 6h16" />
                <path d="M3 11h16" />
                <path d="M3 16h16" />
              </>
            )}
          </svg>
        </button>
      </Container>

      <nav
        id="mobile-nav"
        aria-label="Main"
        hidden={!open}
        className="border-t border-line md:hidden"
      >
        <Container>
          <ul className="py-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`block rounded px-2 py-3 text-sm hover:bg-surface ${
                    isActive(item.href) ? "font-medium text-accent" : "text-ink-muted"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </nav>
    </header>
  );
}
