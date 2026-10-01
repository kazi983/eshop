// ─────────────────────────────────────────────────────────────────────────────
// Server Component。出品詳細ページと 404 ページ、両方で同じ外枠
// （ロゴ・「← Back to shop」・フッター）を使うので、ここに共通化した。
// ホームページ（src/app/page.tsx）はナビゲーションの中身が違う
// （Shop / Shipping & pickup / About me のフルメニュー）ので、
// 無理にこれと共通化はしていない。
// ─────────────────────────────────────────────────────────────────────────────

import Link from "next/link";

export function DetailFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-ink bg-paper mx-auto my-5.5 max-w-[1040px] border-[3px] shadow-[5px_5px_0_var(--ink)] sm:shadow-[8px_8px_0_var(--ink)]">
      <header className="border-ink flex items-center gap-2.5 border-b-[3px] px-5.5 py-3.5">
        <Link
          href="/"
          className="font-display flex items-center gap-2.5 text-xl no-underline"
        >
          <span
            aria-hidden
            className="border-ink grid h-6.5 w-6.5 grid-cols-2 border-2"
          >
            <i className="bg-red not-italic" />
            <i className="bg-yellow not-italic" />
            <i className="bg-blue not-italic" />
            <i className="bg-paper not-italic" />
          </span>
          Kazi&apos;s Garage
        </Link>
        <Link
          href="/#sale"
          className="text-muted ml-auto text-sm font-bold no-underline hover:underline"
        >
          ← Back to shop
        </Link>
      </header>

      {children}

      <footer className="bg-ink text-paper flex flex-wrap items-center justify-between gap-3 px-7.5 py-5">
        <div>
          <div className="font-display text-base">Kazi&apos;s Garage</div>
          <div className="text-[13px] opacity-85">
            Vancouver, BC · Shipping by Canada Post · No platform in between.
          </div>
        </div>
      </footer>
    </div>
  );
}
