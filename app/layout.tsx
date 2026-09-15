import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { isTodo, site } from "@/lib/content";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * tagline이 아직 미확정이면 소속 정보로 대체한다.
 * 화면에는 TODO를 그대로 보여주되(§4-2), 검색 결과에 노출되는 설명에는 넣지 않는다.
 */
const description = isTodo(site.tagline)
  ? `${site.name} (${site.shortName}) at the ${site.department}, ${site.university}.`
  : site.tagline;

export const metadata: Metadata = {
  title: {
    default: `${site.name} — ${site.university}`,
    template: `%s — ${site.shortName}`,
  },
  description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-canvas font-sans text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded focus:bg-ink focus:px-3 focus:py-2 focus:text-sm focus:text-canvas"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
