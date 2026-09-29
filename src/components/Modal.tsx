// ─────────────────────────────────────────────────────────────────────────────
// "use client" — モーダルの開閉には、ブラウザだけができることが2つ必要：
//   1. Esc キーを押したら閉じる（キーボードイベント）
//   2. 背景をクリックしたら閉じる（クリックイベント）
// どちらも Server Component にはできない。
//
// 「閉じる」＝ `router.back()`。Intercepting Routes は「ソフトナビゲーション
// （クリックでの遷移）」の上に重ねて表示されているだけなので、1つ戻れば
// 裏にあった一覧ページに戻る。
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const close = () => router.back();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    // モーダルが開いている間、裏の一覧ページがスクロールしないようにする。
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      className="fixed inset-0 z-50 grid place-items-start justify-items-center overflow-y-auto bg-[rgba(17,17,20,.6)] p-4 pt-8 sm:place-items-center sm:pt-4"
    >
      <div className="border-ink bg-paper relative w-full max-w-[960px] border-[3px] shadow-[10px_10px_0_var(--ink)]">
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="border-ink bg-paper absolute top-2.5 right-2.5 z-10 grid h-9 w-9 place-items-center border-[3px] text-xl leading-none"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
