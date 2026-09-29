// ─────────────────────────────────────────────────────────────────────────────
// Root layout
//
// In the Next.js App Router, every folder under `src/app/` is a URL segment,
// and a `layout.tsx` file wraps every page inside that folder.
// This file sits at the very top (`src/app/layout.tsx`), so it wraps EVERY
// page of the shop. That makes it the right place for:
//   - the <html> and <body> tags (only the root layout may render them)
//   - global CSS
//   - fonts
//   - site-wide metadata (<title>, <meta name="description">, ...)
//   - later: the header with the cart icon, the footer, etc.
//
// Layouts do NOT re-render when you navigate between pages below them,
// so shared UI (like a header) keeps its state while the page changes.
//
// This is a Server Component (the default in the App Router): it runs on the
// server and sends plain HTML to the browser, with no JavaScript for it.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
// `next/font` downloads the font at BUILD time and serves it from our own
// domain. The browser never talks to Google, which is faster and better for
// privacy. It also prevents the page from "jumping" when the font loads.
import { Geist, Geist_Mono } from "next/font/google";
// Importing a .css file here applies it to the whole site.
import "./globals.css";

const geistSans = Geist({
  // Exposes the font as a CSS variable, so CSS (and Tailwind) can use it:
  // `font-family: var(--font-geist-sans)`.
  variable: "--font-geist-sans",
  // Only download the characters we need (English text → "latin").
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// `metadata` is a special export. Next.js turns it into <head> tags.
// Child pages can override it (e.g. each product page gets its own title).
export const metadata: Metadata = {
  // `template` lets child pages set just "T-shirt" and get "T-shirt | eshop".
  title: {
    default: "eshop",
    template: "%s | eshop",
  },
  description: "A small online shop. Prices in Canadian dollars (CAD).",
};

// `LayoutProps<"/">` is a type that Next.js generates for us from the folder
// structure. It says "this layout receives `children`" (the current page).
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // lang="en" helps screen readers and search engines. The store is
    // English-only (with prices in CAD), so this never changes.
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* `children` is whatever page matches the current URL. */}
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
