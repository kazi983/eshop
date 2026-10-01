// ─────────────────────────────────────────────────────────────────────────────
// ルート（`src/app/`）直下の `not-found.tsx`。存在しない URL 全般
// （例：/foobar）で使われる、サイト全体の 404 ページ。
//
// `src/app/listings/[id]/not-found.tsx` の方が階層が深い（より近い）ので、
// `/listings/存在しないid` のときはそちらが優先して使われる。こちらが
// 使われるのは、それ以外の存在しない URL のとき。
// ─────────────────────────────────────────────────────────────────────────────

import Link from "next/link";
import { DetailFrame } from "@/components/DetailFrame";

export default function NotFound() {
  return (
    <DetailFrame>
      <div className="flex flex-col items-center gap-4 px-7.5 py-16 text-center">
        <p className="font-display text-7xl">404</p>
        <h1 className="font-display text-2xl">Nothing here.</h1>
        <p className="text-muted max-w-[42ch] text-[15px]">
          This page doesn&apos;t exist. Everything I&apos;m selling is on the
          shop page.
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
