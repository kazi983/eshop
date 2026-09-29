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
//
// これは Server Component（App Router のデフォルト）。サーバー上で実行され、
// ブラウザにはプレーンな HTML だけが届く。このコンポーネント用の JavaScript は送られない。
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
// `next/font` はフォントをビルド時（build time）にダウンロードし、自分のドメインから配信する。
// docs/design/kazis-garage-reference.html と同じ3書体（3つの役割）を読み込む：
//   Dela Gothic One      → 見出し（display）。太くてポップな日本語デザイナーズフォント
//   Zen Kaku Gothic New  → 本文（body）。読みやすい角ゴシック
//   DM Mono              → 価格・数値（mono）。桁が揃う等幅フォント
import {
  Dela_Gothic_One,
  Zen_Kaku_Gothic_New,
  DM_Mono,
} from "next/font/google";
import "./globals.css";

const delaGothicOne = Dela_Gothic_One({
  variable: "--font-dela-gothic-one",
  weight: "400", // この書体はウェイトが1種類しかない
  subsets: ["latin"],
});

const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  variable: "--font-zen-kaku-gothic-new",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Kazi's Garage",
    template: "%s | Kazi's Garage",
  },
  description:
    "Kazi's garage sale that never closes. Vancouver, BC. No fees, no algorithm — just Kazi and his stuff.",
};

// Step 2: `modal` は Parallel Route（並行ルート）のスロット。
// `src/app/@modal/` フォルダがあると、Next.js が自動的にこの props を
// 用意してくれる（`children` と同じように、名前だけで対応するフォルダの
// 中身が渡ってくる）。出品詳細をモーダルで開いたときはここに何かが入り、
// それ以外（`src/app/@modal/default.tsx` が使われるとき）は null になる。
export default function RootLayout({ children, modal }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${delaGothicOne.variable} ${zenKakuGothicNew.variable} ${dmMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {children}
        {modal}
      </body>
    </html>
  );
}
