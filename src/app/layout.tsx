// ─────────────────────────────────────────────────────────────────────────────
// ルートレイアウト（Root Layout）
//
// App Router では `src/app/` 以下のフォルダがそのまま URL のセグメント（segment）
// になり、`layout.tsx` はそのフォルダ内のすべてのページを包む（wrap する）。
// このファイルは最上位（`src/app/layout.tsx`）にあるので、サイトの「全ページ」を包む。
// そのため、ここに置くのは次のようなもの：
//   - <html> と <body> タグ（これを書けるのはルートレイアウトだけ）
//   - グローバル CSS（global CSS）
//   - フォント（fonts）
//   - サイト全体のメタデータ（metadata：<title>、<meta name="description"> など）
//   - 今後：カートアイコン付きのヘッダー（header）、フッター（footer）
//
// レイアウトは配下のページ間を移動（navigation）しても再レンダリング（re-render）
// されない。だからヘッダーのような共通 UI は、ページが変わっても状態（state）を保てる。
//
// これは Server Component（App Router のデフォルト）。サーバー上で実行され、
// ブラウザにはプレーンな HTML だけが届く。このコンポーネント用の JavaScript は送られない。
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
// `next/font` はフォントをビルド時（build time）にダウンロードし、自分のドメインから配信する。
// ブラウザが Google に直接アクセスしないので、速くてプライバシー（privacy）にも良い。
// フォント読み込み時にページがガタッと動く現象（layout shift）も防げる。
import { Geist, Geist_Mono } from "next/font/google";
// ここで .css ファイルを import すると、サイト全体に適用される。
import "./globals.css";

const geistSans = Geist({
  // フォントを CSS 変数（CSS variable）として公開する。
  // CSS（や Tailwind）から `font-family: var(--font-geist-sans)` のように使える。
  variable: "--font-geist-sans",
  // 必要な文字だけをダウンロードする（英語のテキストなので "latin"）。
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// `metadata` は特別な export。Next.js がこれを <head> タグに変換する。
// 子ページで上書き（override）できる（例：商品ページごとに別のタイトル）。
export const metadata: Metadata = {
  // `template` を使うと、子ページで "T-shirt" とだけ書けば "T-shirt | eshop" になる。
  title: {
    default: "eshop",
    template: "%s | eshop",
  },
  description: "A small online shop. Prices in Canadian dollars (CAD).",
};

// `LayoutProps<"/">` は、フォルダ構成から Next.js が自動生成する型（generated type）。
// 「このレイアウトは `children`（現在のページ）を受け取る」という意味。
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // lang="en" はスクリーンリーダー（screen reader）や検索エンジンの助けになる。
    // ストアは英語のみ（価格は CAD）なので、この値は変わらない。
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* `children` は現在の URL に一致する（match する）ページ。 */}
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
