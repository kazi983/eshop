# eshop — Kazi's Garage

Kazi 個人のガレージセールサイト（personal listing site）。学習プロジェクトとして一歩ずつ（step by step）作っていく。
完成イメージは [`docs/design/kazis-garage-reference.html`](docs/design/kazis-garage-reference.html)。
表示は英語、価格はすべてカナダドル（CAD）。

**ビジネスモデル（重要）：** オンライン決済（Stripe など）は無い。買いたい人が「Ask about this」から連絡し、
Vancouver の East Van で対面ピックアップ、支払いは Interac e-Transfer か現金。プラットフォーム手数料ゼロ。

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

| 領域             | 選択                                        | 無料枠（free tier）   |
| ---------------- | ------------------------------------------- | --------------------- |
| フレームワーク   | Next.js (App Router) + React + TypeScript   | —                     |
| スタイリング     | Tailwind CSS（後で CSS Modules と比較）     | —                     |
| データベース     | PostgreSQL on Neon + Drizzle ORM            | ✅                    |
| 認証（admin 用） | Auth.js または Better Auth                  | —                     |
| 決済（payments） | なし。連絡 → 対面 e-Transfer / 現金         | —（手数料ゼロが売り） |
| 画像（images）   | 未定（例：Vercel Blob / Cloudinary）        | ✅                    |
| PWA              | Web App Manifest + Service Worker (Serwist) | —                     |
| ホスティング     | Vercel (Hobby)                              | ✅                    |
| テスト           | Vitest + Playwright                         | —                     |

## ロードマップ（Roadmap）

各ステップは 1 つの小さな PR で、[`docs/learn/`](docs/learn/) に学習ノート（learning notes）がある。

- [x] **Step 0:** プロジェクトのセットアップ（project setup）（[ノート](docs/learn/00-project-setup.md)）
- [x] **Step 1:** ホームページ（完成イメージを実装）。データはハードコード（hard-coded）（[ノート](docs/learn/01-homepage.md)）
- [ ] **Step 2:** 出品詳細ページ（listing detail page）＋「Ask about this」の連絡フォーム
- [ ] **Step 3:** CSS 深掘り：Tailwind vs CSS Modules
- [ ] **Step 4:** 「気になる」お問い合わせの通知（メール送信）。カートは無し（決済が無いので不要）
- [ ] **Step 5:** データベース：PostgreSQL + Drizzle。出品（listings）と sold フラグのスキーマ（schema）
- [ ] **Step 6:** 管理コンソール（admin console）：サインインと出品の追加・sold への切り替え
- [ ] **Step 7:** PWA：インストール可能（installable）、オフラインページ（offline page）、キャッシュ（caching）
- [ ] **Step 8:** テスト（unit + end-to-end）
- [ ] **Step 9:** Vercel へデプロイ（deploy）+ 公開前チェックリスト（go-live checklist）
- [ ] **Step 10（任意・学習用）:** Stripe Checkout を体験用に別ルートで試す。実サイトの決済には使わないが、決済フローを学ぶ目的で

> 以前のロードマップにあった Stripe 決済・カート・在庫の予約（トランザクション）は、実際のビジネスモデル（対面 e-Transfer、1点物）には不要と判明したため削除した。学習目的での Stripe 体験は Step 10 に任意として残した。
