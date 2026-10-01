// ─────────────────────────────────────────────────────────────────────────────
// Server Component（"use client" 無し）。
//
// 出品詳細の中身（写真ギャラリー＋情報）を、ページ版とモーダル版の**両方**から
// 呼び出す共通コンポーネント。動きが必要な部分（写真の切り替え）だけ
// `<Gallery>`（Client Component）に切り出してあるので、この外側は
// Server Component のままでいい——Step 1 と同じ考え方。
// ─────────────────────────────────────────────────────────────────────────────

import type { Listing } from "@/lib/listings";
import { Gallery } from "@/components/Gallery";

export function ListingDetail({ listing }: { listing: Listing }) {
  const sold = listing.stock === 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <Gallery name={listing.name} photos={listing.photos} />

      <div className="flex flex-col gap-2.5 p-5.5">
        <div className="flex flex-wrap gap-1.5">
          {sold ? (
            <span className="border-ink bg-paper border-2 px-1.5 font-mono text-[11px] leading-relaxed">
              SOLD
            </span>
          ) : (
            <span
              className={`border-ink font-mono text-[11px] leading-relaxed font-medium ${
                listing.isNew ? "bg-ink text-yellow" : "bg-paper"
              } border-2 px-1.5`}
            >
              {listing.isNew ? "NEW" : `USED · ${listing.condition}`}
            </span>
          )}
          {!sold && (
            <span
              className={`border-ink border-2 px-1.5 font-mono text-[11px] leading-relaxed ${
                listing.stock === 1 ? "bg-red text-paper" : "bg-paper"
              }`}
            >
              {listing.stock === 1 ? "1 of 1" : `${listing.stock} in stock`}
            </span>
          )}
        </div>

        <h2 className="font-display pr-9 text-2xl text-balance">
          {listing.name}
        </h2>

        <div className="flex items-baseline gap-2">
          <span className="font-mono text-lg font-medium tabular-nums">
            ${listing.price}
          </span>
          {listing.wasPrice !== undefined && (
            <span className="text-muted font-mono text-xs line-through">
              ${listing.wasPrice}
            </span>
          )}
          <span className="text-muted font-mono text-xs">CAD</span>
        </div>

        <p className="text-[14.5px] leading-relaxed">{listing.story}</p>

        <ul className="border-ink mt-1 grid gap-1.5 border-t-2 border-dashed pt-3 text-[13.5px]">
          <li className="grid grid-cols-[88px_minmax(0,1fr)] gap-2.5">
            <b className="text-muted font-mono text-[11.5px] font-medium tracking-wide uppercase">
              Condition
            </b>
            <span>{listing.isNew ? "New, unused" : listing.condition}</span>
          </li>
          <li className="grid grid-cols-[88px_minmax(0,1fr)] gap-2.5">
            <b className="text-muted font-mono text-[11.5px] font-medium tracking-wide uppercase">
              Delivery
            </b>
            <span>
              {sold
                ? `Sold ${listing.soldDate}`
                : {
                    any: "Canada Post or free pickup in East Van",
                    ship: "Canada Post only",
                    pickup: "Pickup in East Van only",
                  }[listing.mode]}
            </span>
          </li>
          <li className="grid grid-cols-[88px_minmax(0,1fr)] gap-2.5">
            <b className="text-muted font-mono text-[11.5px] font-medium tracking-wide uppercase">
              Category
            </b>
            <span>
              {listing.category[0].toUpperCase() + listing.category.slice(1)}
            </span>
          </li>
        </ul>

        {/* 見た目だけのボタン。Step 1 と同じ方針で、カートのロジックは別ステップ。 */}
        <button
          disabled={sold}
          className={
            sold
              ? "border-ink bg-soft text-muted mt-auto cursor-default border-2 px-3 py-3 text-center text-[15px] font-bold"
              : "border-ink bg-yellow hover:bg-ink hover:text-yellow mt-auto cursor-pointer border-2 px-3 py-3 text-center text-[15px] font-bold"
          }
        >
          {sold ? "Sold" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}
