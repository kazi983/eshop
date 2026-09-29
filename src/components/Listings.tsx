// ─────────────────────────────────────────────────────────────────────────────
// "use client" — このファイルだけが Client Component。
//
// なぜここだけ？　フィルターのチップ（All / Garage / Home / Outdoor）を押すと
// 表示する商品が切り替わる。これには `useState`（状態）と `onClick`
// （クリックイベント）が必要で、どちらも Server Component にはできないこと
// だった（Step 0 のコメント参照）。
//
// 逆に言うと、ページの他の部分（Nav・Hero・Ticker・About・Footer）は
// クリックしても何も変わらない「ただの HTML」なので、Server Component の
// ままで良い。「動きが必要な部分だけ」を切り出すのが Server/Client を
// 混ぜるときの基本方針。
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useState } from "react";
import type { Category, Listing } from "@/lib/listings";

// フィルターの選択肢。"all" は実在の Category ではなく「絞り込まない」という
// 特別な値なので、Category とは別の型にしている。
type Filter = "all" | Category;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "garage", label: "Garage" },
  { value: "home", label: "Home" },
  { value: "outdoor", label: "Outdoor" },
];

// メディア（写真の代わり）の色と、その上に乗せる図形。
// 実物の写真は無いので、docs/design/kazis-garage-reference.html と同じく
// 色付きブロック＋図形1つで「商品ごとに違う見た目」を作る。
const MEDIA_BG: Record<Listing["media"]["color"], string> = {
  red: "bg-red",
  yellow: "bg-yellow",
  blue: "bg-blue",
};

function ListingCard({ listing }: { listing: Listing }) {
  return (
    <article
      className={`border-ink bg-paper flex flex-col border-[3px] transition-[transform,box-shadow] duration-150 ${
        listing.sold
          ? ""
          : "hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--ink)]"
      }`}
    >
      <div
        className={`border-ink relative flex aspect-4/3 items-center justify-center border-b-[3px] ${MEDIA_BG[listing.media.color]} ${
          listing.sold ? "opacity-55 grayscale" : ""
        }`}
      >
        {listing.media.shape === "circle" ? (
          <span className="border-ink bg-paper aspect-square w-[44%] rounded-full border-[3px]" />
        ) : (
          <span className="border-ink bg-paper aspect-square w-[44%] border-[3px]" />
        )}

        {listing.sold ? (
          <span className="border-red bg-paper font-display text-red absolute -rotate-[10deg] border-[3px] px-3.5 py-0.5 text-2xl">
            SOLD
          </span>
        ) : (
          <span className="border-ink bg-paper absolute top-2.5 left-2.5 border-2 px-2 py-0.5 font-mono text-[11px] font-medium">
            {listing.condition}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-[15.5px] leading-snug font-bold">{listing.name}</p>
        <p className="text-muted text-[13.5px] leading-relaxed">
          {listing.story}
        </p>

        <div className="mt-auto flex items-baseline justify-between gap-2 pt-2.5">
          <span>
            <span className="font-mono text-lg font-medium tabular-nums">
              ${listing.price}
            </span>
            {listing.wasPrice !== undefined && (
              <span className="text-muted ml-1.5 font-mono text-xs line-through">
                ${listing.wasPrice}
              </span>
            )}
          </span>
          <span className="text-xs font-bold">
            {listing.sold ? `Sold ${listing.soldDate}` : listing.pickup}
          </span>
        </div>

        <button
          disabled={listing.sold}
          className={
            listing.sold
              ? "border-ink bg-soft text-muted mt-2.5 cursor-default border-2 px-3 py-2 text-center text-[13.5px] font-bold"
              : "border-ink bg-yellow hover:bg-ink hover:text-yellow mt-2.5 cursor-pointer border-2 px-3 py-2 text-center text-[13.5px] font-bold"
          }
        >
          {listing.sold ? "Sold" : "Ask about this"}
        </button>
      </div>
    </article>
  );
}

export function Listings({ listings }: { listings: Listing[] }) {
  // `useState` はブラウザ側でだけ動く「状態」。React が再レンダリングの
  // たびにこの値を覚えていてくれる。Server Component ではこれが使えないから
  // "use client" が必要だった。
  const [filter, setFilter] = useState<Filter>("all");

  const visible =
    filter === "all" ? listings : listings.filter((l) => l.category === filter);

  return (
    <section id="sale" className="border-ink border-b-[3px] px-7.5 py-9">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-[26px]">For sale right now</h2>
        <span className="text-muted font-mono text-[12.5px]">
          Prices in CAD · updated Sep 29
        </span>
      </div>

      <div
        role="group"
        aria-label="Filter listings"
        className="mb-4.5 flex flex-wrap gap-2"
      >
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            aria-pressed={filter === f.value}
            onClick={() => setFilter(f.value)}
            className={`border-ink cursor-pointer rounded-full border-2 px-3 py-1.5 text-[13px] font-bold ${
              filter === f.value ? "bg-ink text-paper" : "bg-paper text-ink"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </section>
  );
}
