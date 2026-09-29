// ─────────────────────────────────────────────────────────────────────────────
// 出品詳細ページ →  URL: "/listings/[id]"（例：/listings/torque）
//
// Step 0 で予告した dynamic segment（`[id]`）を、ここで実際に使う。
// `src/app/listings/` フォルダの中に `[id]` という名前のフォルダがあるので、
// `/listings/torque` にアクセスすると、その "torque" という値が
// `params.id` として渡ってくる。
//
// これは URL に直接アクセスしたとき・リロードしたとき・リンクを共有された
// ときに表示される、**普通のページ**。ホームページのグリッドから
// クリックしたときは、代わりに `src/app/@modal/(.)listings/[id]/page.tsx`
// が「割り込んで」モーダルとして表示される（Intercepting Routes）。
// 中身の見た目（写真ギャラリー＋商品情報）はどちらも同じ
// `<ListingDetail>` を共有している。
// ─────────────────────────────────────────────────────────────────────────────

import Link from "next/link";
import { notFound } from "next/navigation";
import { getListing } from "@/lib/listings";
import { ListingDetail } from "@/components/ListingDetail";

export default async function ListingPage({
  params,
}: PageProps<"/listings/[id]">) {
  const { id } = await params;
  const listing = getListing(id);

  // 存在しない id（例：/listings/does-not-exist）なら、Next.js 標準の
  // 404 ページを表示する。
  if (!listing) {
    notFound();
  }

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

      <ListingDetail listing={listing} />

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
