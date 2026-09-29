// ─────────────────────────────────────────────────────────────────────────────
// "use client" — 「今どの写真を見ているか」という状態（useState）が必要なので
// Client Component。Step 1 の Listings.tsx と同じパターン：動きが必要な部分
// だけをここに切り出し、呼び出し元（ListingDetail.tsx）は Server Component
// のまま。
//
// この状態は Step 1 の Q4 で話した「一時的な状態（ephemeral）」——ページを
// 開き直せば 1 枚目に戻ってよく、ブラウザに保存する必要は無い——なので、
// カートとは違ってこの場で作り切ってよい。
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useState } from "react";
import type { Photo } from "@/lib/listings";

const MEDIA_BG: Record<Photo["color"], string> = {
  red: "bg-red",
  yellow: "bg-yellow",
  blue: "bg-blue",
};

function Shape({ photo }: { photo: Photo }) {
  if (photo.shape === "circle") {
    return (
      <span className="border-ink bg-paper aspect-square w-[42%] rounded-full border-[3px]" />
    );
  }
  if (photo.shape === "pill") {
    return (
      <span className="border-ink bg-paper aspect-2/1 w-[56%] rounded-full border-[3px]" />
    );
  }
  return (
    <span className="border-ink bg-paper aspect-square w-[42%] border-[3px]" />
  );
}

export function Gallery({ name, photos }: { name: string; photos: Photo[] }) {
  const [index, setIndex] = useState(0);
  const current = photos[index];
  const hasMultiple = photos.length > 1;

  const go = (delta: number) => {
    setIndex((i) => (i + delta + photos.length) % photos.length);
  };

  return (
    <div className="border-ink flex flex-col border-b-[3px] md:border-r-[3px] md:border-b-0">
      {/* ---- Stage: 今表示している1枚 ---- */}
      <div
        className={`border-ink relative flex aspect-4/3 items-center justify-center border-b-[3px] ${MEDIA_BG[current.color]}`}
      >
        <Shape photo={current} />
        <span className="border-ink bg-paper absolute bottom-3 left-3 border-2 px-2 py-0.5 font-mono text-xs">
          {current.label}
        </span>
        {hasMultiple && (
          <>
            <span className="bg-ink text-paper absolute top-3 right-3 px-2 py-0.5 font-mono text-xs">
              {index + 1} / {photos.length}
            </span>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous photo"
              className="border-ink bg-paper absolute top-1/2 left-3 grid h-10.5 w-10.5 -translate-y-1/2 place-items-center border-[3px] text-xl active:translate-y-[calc(-50%+2px)] active:shadow-[1px_1px_0_var(--ink)]"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next photo"
              className="border-ink bg-paper absolute top-1/2 right-3 grid h-10.5 w-10.5 -translate-y-1/2 place-items-center border-[3px] text-xl active:translate-y-[calc(-50%+2px)] active:shadow-[1px_1px_0_var(--ink)]"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* ---- Thumbnails ---- */}
      {hasMultiple && (
        <div
          role="group"
          aria-label="Photos"
          className="flex gap-2.5 overflow-x-auto p-3"
        >
          {photos.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Photo ${i + 1}: ${p.label}`}
              aria-current={i === index}
              className={`border-ink flex h-14 w-14 shrink-0 items-center justify-center border-[3px] ${MEDIA_BG[p.color]} ${
                i === index ? "outline-ink outline-2 outline-offset-2" : ""
              }`}
            >
              <span className="border-ink bg-paper h-4 w-4 border-2" />
            </button>
          ))}
        </div>
      )}
      <p className="sr-only" aria-live="polite">
        Showing photo {index + 1} of {photos.length} for {name}: {current.label}
      </p>
    </div>
  );
}
