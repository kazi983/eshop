// ─────────────────────────────────────────────────────────────────────────────
// "use client" — 「開いているか・閉じているか」を `useState` で持っているだけ。
//
// なぜ `<Modal onClose={router.back}>`（デフォルト）を使わなかったか：
// このウェルカム画面は、出品詳細のモーダルと違って「どこかのページから
// クリックで遷移してきた」ものではない（`/` を開いたら最初から表示される）。
// なので「閉じる＝1つ前の履歴に戻る」という前提が成り立たず、`router.back()`
// を使うとブラウザの閲覧履歴しだいで予期しない場所に飛んでしまう。
//
// 代わりに、ここでは「閉じる」をただの `useState` の切り替えにしている——
// Step 1 の Q4 で話した「一時的な状態（ephemeral）」と同じ考え方：ページを
// 開き直せばまた表示されて良いし、ブラウザの履歴やストレージに一切触れない。
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useState } from "react";
import { Modal } from "@/components/Modal";

export function WelcomeModal() {
  const [open, setOpen] = useState(true);

  if (!open) {
    return null;
  }

  return (
    <Modal onClose={() => setOpen(false)}>
      <div className="flex flex-col items-center gap-4 px-7.5 py-12 text-center">
        <span className="border-ink bg-yellow inline-block border-2 px-2.5 py-0.5 font-mono text-xs tracking-wide uppercase">
          👋 Hi, I&apos;m Kazi
        </span>
        <h1 className="font-display text-3xl text-balance">
          Welcome to my garage.
        </h1>
        <p className="text-muted max-w-[46ch] text-[15px] leading-relaxed">
          Everything here is real — stuff I actually own, priced to move. Some
          of it&apos;s one-of-a-kind, so if something catches your eye,
          don&apos;t wait too long.
        </p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="border-ink bg-red text-paper mt-1 border-[3px] px-6 py-3 font-bold shadow-[4px_4px_0_var(--ink)]"
        >
          Let&apos;s go
        </button>
      </div>
    </Modal>
  );
}
