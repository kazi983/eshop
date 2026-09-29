# eshop — Kazi's Garage

Kazi 個人のガレージセールサイト（personal listing site）。学習プロジェクトとして一歩ずつ（step by step）作っていく。
完成イメージは [`docs/design/kazis-garage-reference.html`](docs/design/kazis-garage-reference.html)。
表示は英語、価格はすべてカナダドル（CAD）。

**ビジネスモデル（重要・2026-09-29 更新）：** カート＋ Stripe Checkout ありのショップ。
新品（New、複数在庫）と中古1点物（Used、1 of 1）が混在し、配送（Canada Post）と
East Van でのピックアップの両方に対応。プラットフォーム手数料は取らない（0%）のが売り。
以前のバージョン（決済無し・連絡して e-Transfer）は設計探索の途中段階だった。

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

| コマンド        | 内容                                                 |
| --------------- | ---------------------------------------------------- |
| `npm run dev`   | ホットリロード（hot reload）付きの開発サーバー       |
| `npm run build` | 本番ビルド（production build）。型チェックも行う     |
| `npm start`     | 本番ビルドを配信（serve）する（先に `build` を実行） |
| `npm run lint`  | ESLint でコードをチェック                            |

## 技術スタック（Tech stack / 予定）

| 領域             | 選択                                               | 無料枠（free tier）                                             |
| ---------------- | -------------------------------------------------- | --------------------------------------------------------------- |
| フレームワーク   | Next.js (App Router) + React + TypeScript          | —                                                               |
| スタイリング     | Tailwind CSS（後で CSS Modules と比較）            | —                                                               |
| データベース     | PostgreSQL on Neon + Drizzle ORM                   | ✅                                                              |
| 認証（admin 用） | Auth.js または Better Auth                         | —                                                               |
| 決済（payments） | Stripe Checkout（カード / Apple Pay / Google Pay） | ✅（売上ごとの手数料のみ、こちらのプラットフォーム手数料は 0%） |
| 画像（images）   | 未定（例：Vercel Blob / Cloudinary）               | ✅                                                              |
| PWA              | Web App Manifest + Service Worker (Serwist)        | —                                                               |
| ホスティング     | Vercel (Hobby)                                     | ✅                                                              |
| テスト           | Vitest + Playwright                                | —                                                               |

## ロードマップ（Roadmap）

各ステップは 1 つの小さな PR で、[`docs/learn/`](docs/learn/) に学習ノート（learning notes）がある。

- [x] **Step 0:** プロジェクトのセットアップ（project setup）（[ノート](docs/learn/00-project-setup.md)）
- [x] **Step 1:** ホームページ（完成イメージを実装。見た目のみ、カート/決済のロジックは無し）（[ノート](docs/learn/01-homepage.md)）
- [x] **Step 2:** 出品詳細（listing detail）。モーダル（クリック時）とページ（`/listings/[id]`、直接アクセス/共有用）の両方を Intercepting Routes で実装（[ノート](docs/learn/02-listing-detail.md)）
- [ ] **Step 3:** CSS 深掘り：Tailwind vs CSS Modules
- [ ] **Step 4:** カート（cart）：クライアント状態（client state）、ブラウザに保存（persist）
- [ ] **Step 5:** データベース：PostgreSQL + Drizzle。出品（listings）・在庫（stock）のスキーマ（schema）
- [ ] **Step 6:** 管理コンソール（admin console）：サインインと出品・在庫管理
- [ ] **Step 7:** Stripe（テストモード）によるゲスト購入（guest checkout）+ webhook → 注文（orders）
- [ ] **Step 8:** 在庫の確保（reservation）と減算（decrement）：トランザクション（transactions）。1点物（stock=1）は特に重要（同時に2人が買えてはいけない）
- [ ] **Step 9:** 配送（Canada Post）とピックアップの両対応。注文メールと配送情報
- [ ] **Step 10:** PWA：インストール可能（installable）、オフラインページ（offline page）、キャッシュ（caching）
- [ ] **Step 11:** テスト（unit + end-to-end）
- [ ] **Step 12:** Vercel へデプロイ（deploy）+ 公開前チェックリスト（go-live checklist）

> **更新履歴：** 一度「決済無し・対面 e-Transfer」に簡略化したが（2026-09-29 早朝）、完成イメージの更新で
> カート・Stripe Checkout・配送ありのバージョンが本当の方向性だと確定した（同日）。Step 1 の実装では
> 見た目（コピー・レイアウト）だけを反映し、カート/決済/配送計算のロジックは意図的に実装していない。
