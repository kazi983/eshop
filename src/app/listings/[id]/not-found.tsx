// ─────────────────────────────────────────────────────────────────────────────
// `not-found.tsx` という名前のファイルを `page.tsx` と同じフォルダに置くと、
// そのフォルダ（または下の階層）で `notFound()` が呼ばれたときに、
// Next.js 標準の無地の 404 の代わりにこれが表示される。
//
// `src/app/listings/[id]/page.tsx` の `if (!listing) notFound();` が、
// まさにこのページを呼び出している。
// ─────────────────────────────────────────────────────────────────────────────

import Link from "next/link";
import { DetailFrame } from "@/components/DetailFrame";

export default function ListingNotFound() {
  return (
    <DetailFrame>
      <div className="flex flex-col items-center gap-4 px-7.5 py-16 text-center">
        <p className="font-display text-7xl">404</p>
        <h1 className="font-display text-2xl">
          This listing isn&apos;t here anymore.
        </h1>
        <p className="text-muted max-w-[42ch] text-[15px]">
          It may have sold out, or the link might just be wrong. Everything I
          still have is on the shop page.
        </p>
        <Link
          href="/#sale"
          className="border-ink bg-red text-paper border-[3px] px-5 py-3 font-bold no-underline shadow-[4px_4px_0_var(--ink)]"
        >
          Back to the shop
        </Link>
      </div>
    </DetailFrame>
  );
}
