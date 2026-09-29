# eshop

物理商品（physical products）を販売する小さなオンラインショップ。学習プロジェクトとして一歩ずつ（step by step）作っていく。
ストアの表示は英語、価格はすべてカナダドル（CAD / Canadian dollars）。

## はじめ方（Getting started / Ubuntu）

Node.js 22 が必要。バージョンは `.nvmrc` で固定（pin）している。

```bash
# nvm が無ければ一度だけインストール: https://github.com/nvm-sh/nvm
nvm install        # .nvmrc を読んで Node 22 をインストール
nvm use

npm install        # package-lock.json から依存関係（dependencies）をインストール
npm run dev        # 開発サーバー（dev server）を起動 → http://localhost:3000
```

その他のスクリプト（scripts）：

| コマンド         | 内容                                                  |
| ---------------- | ----------------------------------------------------- |
| `npm run dev`    | ホットリロード（hot reload）付きの開発サーバー        |
| `npm run build`  | 本番ビルド（production build）。型チェックも行う      |
| `npm start`      | 本番ビルドを配信（serve）する（先に `build` を実行）  |
| `npm run lint`   | ESLint でコードをチェック                             |

## 技術スタック（Tech stack / 予定）

| 領域                 | 選択                                                | 無料枠（free tier） |
| -------------------- | --------------------------------------------------- | ------------------- |
| フレームワーク       | Next.js (App Router) + React + TypeScript           | —                   |
| スタイリング         | Tailwind CSS（後で CSS Modules と比較）             | —                   |
| データベース         | PostgreSQL on Neon + Drizzle ORM                    | ✅                  |
| 認証（admin 用）     | Auth.js または Better Auth                          | —                   |
| 決済（payments）     | Stripe Checkout + webhooks（まずテストモード）      | ✅（売上ごとの手数料のみ） |
| 画像（images）       | 未定（例：Vercel Blob / Cloudinary）                | ✅                  |
| PWA                  | Web App Manifest + Service Worker (Serwist)         | —                   |
| ホスティング         | Vercel (Hobby)                                      | ✅                  |
| テスト               | Vitest + Playwright                                 | —                   |

## ロードマップ（Roadmap）

各ステップは 1 つの小さな PR で、[`docs/learn/`](docs/learn/) に学習ノート（learning notes）がある。

- [x] **Step 0:** プロジェクトのセットアップ（project setup）（[ノート](docs/learn/00-project-setup.md)）
- [ ] **Step 1:** 商品一覧ページ（product list page）。データはハードコード（hard-coded）
- [ ] **Step 2:** 商品詳細ページ（product detail page）。バリエーション（variants：サイズ・色）付き
- [ ] **Step 3:** CSS 深掘り：Tailwind vs CSS Modules
- [ ] **Step 4:** カート（cart）：クライアント状態（client state）、ブラウザに保存（persist）
- [ ] **Step 5:** データベース：PostgreSQL + Drizzle。商品・バリエーション・在庫（stock）のスキーマ（schema）
- [ ] **Step 6:** 管理コンソール（admin console）：サインインと商品・在庫管理
- [ ] **Step 7:** Stripe（テストモード）によるゲスト購入（guest checkout）+ webhook → 注文（orders）
- [ ] **Step 8:** 在庫の確保（reservation）と減算（decrement）：トランザクション（transactions）
- [ ] **Step 9:** 注文メール（order emails）と配送情報（shipping details）
- [ ] **Step 10:** PWA：インストール可能（installable）、オフラインページ（offline page）、キャッシュ（caching）
- [ ] **Step 11:** テスト（unit + end-to-end）
- [ ] **Step 12:** Vercel へデプロイ（deploy）+ 公開前チェックリスト（go-live checklist）
