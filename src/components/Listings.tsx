// ─────────────────────────────────────────────────────────────────────────────
// "use client" — このファイルだけが Client Component。
//
// なぜここだけ？　フィルターのチップ（New/Used、カテゴリ）を押すと表示する
// 出品が切り替わる。これには `useState` と `onClick` が必要で、どちらも
// Server Component にはできない（Step 0 のコメント参照）。
//
// 注意：「Add to cart」ボタンは見た目だけで、まだ何も起きない。カートの
// 状態管理・Stripe 決済・配送料の計算は、この完成イメージ
// （docs/design/kazis-garage-reference.html）には含まれているが、
// 別のステップでまとめて実装する予定（Step 1 の範囲を超えるため）。
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useState } from "react";
import type { Category, DeliveryMode, Listing } from "@/lib/listings";

type ConditionFilter = "all" | "new" | "used";
type CategoryFilter = "all" | Category;

const CONDITION_FILTERS: { value: ConditionFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "used", label: "Used" },
];

const CATEGORY_FILTERS: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "Everything" },
  { value: "garage", label: "Garage" },
  { value: "home", label: "Home" },
  { value: "outdoor", label: "Outdoor" },
];

const MEDIA_BG: Record<Listing["media"]["color"], string> = {
  red: "bg-red",
  yellow: "bg-yellow",
  blue: "bg-blue",
};

// 「Ships or pickup」のように、配送方法を一言のラベルにする。
const MODE_LABEL: Record<DeliveryMode, string> = {
  any: "Ships or pickup",
  ship: "Ships only",
  pickup: "Pickup only",
};

function ChipGroup<T extends string>({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div role="group" aria-label={legend} className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={`border-ink cursor-pointer rounded-full border-2 px-3 py-1.5 text-[13px] font-bold ${
            value === o.value ? "bg-ink text-paper" : "bg-paper text-ink"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function ListingCard({ listing }: { listing: Listing }) {
  const sold = listing.stock === 0;

  return (
    <article
      className={`border-ink bg-paper flex flex-col border-[3px] transition-[transform,box-shadow] duration-150 ${
        sold
          ? ""
          : "hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--ink)]"
      }`}
    >
      <div
        className={`border-ink relative flex aspect-4/3 items-center justify-center border-b-[3px] ${MEDIA_BG[listing.media.color]} ${
          sold ? "opacity-55 grayscale" : ""
        }`}
      >
        {listing.media.shape === "circle" ? (
          <span className="border-ink bg-paper aspect-square w-[42%] rounded-full border-[3px]" />
        ) : listing.media.shape === "pill" ? (
          <span className="border-ink bg-paper aspect-2/1 w-[56%] rounded-full border-[3px]" />
        ) : (
          <span className="border-ink bg-paper aspect-square w-[42%] border-[3px]" />
        )}

        {sold ? (
          <span className="border-red bg-paper font-display text-red absolute -rotate-[10deg] border-[3px] px-3.5 py-0.5 text-2xl">
            SOLD
          </span>
        ) : (
          <div className="absolute top-2.5 right-2.5 left-2.5 flex flex-wrap gap-1.5">
            <span
              className={`border-ink font-mono text-[11px] leading-relaxed font-medium ${
                listing.isNew ? "bg-ink text-yellow" : "bg-paper"
              } border-2 px-1.5`}
            >
              {listing.isNew ? "NEW" : `USED · ${listing.condition}`}
            </span>
            <span className="border-ink bg-paper ml-auto border-2 px-1.5 font-mono text-[11px] leading-relaxed">
              {listing.stock === 1 ? "1 of 1" : `${listing.stock} in stock`}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-[15.5px] leading-snug font-bold">{listing.name}</p>
        <p className="text-muted text-[13.5px] leading-relaxed">
          {listing.story}
        </p>

        <div className="mt-auto flex flex-wrap items-baseline justify-between gap-2 pt-2.5">
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
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-bold ${sold ? "text-muted" : ""}`}
          >
            {sold ? `Sold ${listing.soldDate}` : MODE_LABEL[listing.mode]}
          </span>
        </div>

        {/* 見た目だけのボタン。onClick は無し（カートの状態管理は別ステップ）。 */}
        <button
          disabled={sold}
          className={
            sold
              ? "border-ink bg-soft text-muted mt-2.5 cursor-default border-2 px-3 py-2 text-center text-[13.5px] font-bold"
              : "border-ink bg-yellow hover:bg-ink hover:text-yellow mt-2.5 cursor-pointer border-2 px-3 py-2 text-center text-[13.5px] font-bold"
          }
        >
          {sold ? "Sold" : "Add to cart"}
        </button>
      </div>
    </article>
  );
}

export function Listings({ listings }: { listings: Listing[] }) {
  const [condition, setCondition] = useState<ConditionFilter>("all");
  const [category, setCategory] = useState<CategoryFilter>("all");

  const visible = listings.filter((l) => {
    const matchesCondition =
      condition === "all" || (condition === "new") === l.isNew;
    const matchesCategory = category === "all" || l.category === category;
    return matchesCondition && matchesCategory;
  });

  return (
    <section id="sale" className="border-ink border-b-[3px] px-7.5 py-9">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-[26px]">In the shop</h2>
        <span className="text-muted font-mono text-[12.5px]">
          {visible.length} items · prices in CAD
        </span>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2.5 sm:gap-4.5">
        <ChipGroup
          legend="Condition"
          options={CONDITION_FILTERS}
          value={condition}
          onChange={setCondition}
        />
        <span aria-hidden className="bg-ink hidden h-6 w-0.5 sm:block" />
        <ChipGroup
          legend="Category"
          options={CATEGORY_FILTERS}
          value={category}
          onChange={setCategory}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </section>
  );
}
