// ─────────────────────────────────────────────────────────────────────────────
// ホームページ（Home page） →  URL: "/"
//
// `page.tsx` という名前のファイルがあると、そのフォルダが URL としてアクセス可能になる。
//   src/app/page.tsx                 → /
//   src/app/products/page.tsx        → /products          （Step 1 で作る）
//   src/app/products/[slug]/page.tsx → /products/blue-tee （Step 2、動的ルート dynamic route）
//
// 今はアプリが動くことを確認するための仮ページ（placeholder）。
// スタイルは Tailwind CSS のユーティリティクラス（utility classes：`className="text-3xl ..."`）。
// Tailwind と CSS Modules の比較（comparison）は後のステップでやる。
// ─────────────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    // <main> はページのメインコンテンツを示す（アクセシビリティ accessibility に良い）。
    // mx-auto + max-w-3xl → 中央寄せ（centered）で最大幅 48rem のカラム
    // flex-1              → <body> の高さいっぱいまで伸びる（grow）
    // px-4 py-16          → 左右 1rem、上下 4rem のパディング（padding）
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-6 px-4 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">eshop</h1>
      <p className="text-lg text-zinc-600 dark:text-zinc-400">
        Our shop is being built, one small step at a time.
      </p>
    </main>
  );
}
