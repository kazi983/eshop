# Step 0: プロジェクトのセットアップ（Project setup）

**ゴール（goal）：** 空の Next.js アプリを作り、中に入っている全ファイルの役割を理解して、自分のマシンで動かす。

> 💡 太字の英語（**bold English**）は、英語で説明するときにそのまま使えるキーワード。

## 1. 実行したコマンド

```bash
npx create-next-app@latest . \
  --ts --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --use-npm
```

| フラグ（flag）   | 意味                                                                                       |
| ---------------- | ------------------------------------------------------------------------------------------ |
| `--ts`           | TypeScript を使う。**type（型）** のおかげで、価格の入れ忘れなどを実行前に見つけられる。   |
| `--tailwind`     | Tailwind CSS v4 をセットアップする。                                                       |
| `--eslint`       | **linter** をセットアップする。バグや良くない書き方を検出する。                            |
| `--app`          | **App Router**（`src/app/`）を使う。現在の標準的なルーティング方式。                       |
| `--src-dir`      | コードを `src/` に入れて、設定ファイルと分ける。                                           |
| `--import-alias` | `"../../../lib/x"` ではなく `import x from "@/lib/x"` と書けるようにする。                 |

## 2. 各ファイルの役割（What each file is for）

```
eshop/
├── src/app/              ← すべてのルート（routes = ページ）はここ
│   ├── layout.tsx        ← 全ページを包む：<html>、<body>、フォント、メタデータ
│   ├── page.tsx          ← "/" のページ
│   ├── globals.css       ← グローバル CSS + Tailwind
│   └── favicon.ico       ← ブラウザのタブのアイコン
├── public/               ← そのまま配信される静的ファイル（static files、例：/robots.txt）
├── docs/learn/           ← この学習ノート
├── next.config.ts        ← Next.js の設定（今は空）
├── tsconfig.json         ← TypeScript の設定（strict mode、"@/*" エイリアス）
├── eslint.config.mjs     ← linter のルール（Next.js + Core Web Vitals + TypeScript）
├── postcss.config.mjs    ← Tailwind を CSS のビルドに組み込む
├── package.json          ← 依存関係（dependencies）と npm scripts
├── package-lock.json     ← 実際にインストールされた正確なバージョン（必ずコミットする！）
├── .nvmrc                ← Node.js のバージョン（22）
├── AGENTS.md / CLAUDE.md ← AI コーディングアシスタント向けのヒント（下記参照）
└── .gitignore            ← git が無視するファイル（node_modules、.next、.env*）
```

**AGENTS.md：** Next.js 16 が自動で作るファイル。AI アシスタント（私も含む）に「古い知識ではなく、`node_modules/next/dist/docs/` に同梱されたドキュメントを読むように」と伝える。消しても `next dev` が作り直すので、そのまま残しておく。

## 3. 重要な考え方：App Router は「フォルダ = URL」（**folders are routes**）

```
src/app/page.tsx                    →  /
src/app/products/page.tsx           →  /products
src/app/products/[slug]/page.tsx    →  /products/blue-tee   （[slug] は変数 = dynamic segment）
src/app/admin/layout.tsx            →  /admin/* の全ページで共有されるレイアウト
```

特別なファイル名（**special files**）：

- `page.tsx`：ページ本体
- `layout.tsx`：共通の外枠（shared wrapper）
- `loading.tsx`：読み込み中に表示
- `error.tsx`：エラー時に表示
- `not-found.tsx`：404
- `route.ts`：API エンドポイント（**Route Handler**。例：Stripe の webhook 受け口）

## 4. 重要な考え方：デフォルトは Server Component

`src/app/` のコンポーネントは、先頭に `"use client"` と書かない限りすべて **Server Component**。

|                               | Server Component（デフォルト）      | Client Component（`"use client"`）                  |
| ----------------------------- | ----------------------------------- | --------------------------------------------------- |
| 実行される場所                | サーバーのみ                        | サーバー（最初の HTML）**と**ブラウザ               |
| DB を直接読める               | ✅                                  | ❌（秘密情報 secrets が漏れてしまう）               |
| `useState`、`onClick`         | ❌                                  | ✅                                                  |
| ブラウザに送られる JS         | なし                                | あり                                                |

EC サイトでの使い分け：

- **商品ページ**は Server Component にする。速く、**SEO** に強く、DB を直接読める。
- **「カートに追加」ボタン**は Client Component にする。`onClick` と状態（**state**）が必要だから。

Step 1〜4 で両方を実際に使う。

## 5. なぜこの技術を選んだか（Why these choices?）

前提は次のとおり。

- 物理商品でバリエーションと在庫がある
- 商品数は 100 未満
- ゲスト購入（**guest checkout**）が必要
- 管理画面（**admin console**）が必要
- 英語表示・CAD
- 無料枠（**free tier**）で運用したい

各技術を選んだ理由：

- **Next.js：** ページ、SEO、API エンドポイント（Stripe の webhook 用）、管理画面を 1 つのプロジェクトで作れて、Vercel に無料でデプロイできる。
- **PostgreSQL（リレーショナル DB / relational database）：** 注文・注文明細・バリエーション・在庫は、互いに強く関係する（**related**）データ。在庫の変更は **transaction（トランザクション）** で守る必要がある。最後の 1 枚のシャツを 2 人が同時に買っても、両方が成功してはいけない（**race condition** を防ぐ）。Postgres はこれが得意。ドキュメント DB（**document database**：MongoDB、Firestore など）ではこれが難しくなる。詳しくは Step 5 で扱う。
- **Neon：** 無料のサーバーレス Postgres（**serverless Postgres**）で、Vercel との相性が良い。
- **Stripe Checkout：** Stripe がホストする決済ページ（**hosted payment page**）。カード番号がこちらのサーバーを通らないので、**PCI compliance（PCI DSS 準拠）** の作業のほとんどを避けられる。CAD にも対応している。月額料金はなく、売上ごとの手数料（**per-transaction fee**）だけ。

## 6. 自分で試してみよう（Try it yourself）

```bash
git clone git@github.com:kazi983/eshop.git && cd eshop
git checkout claude/ecommerce-site-build-4rugwo
nvm install && nvm use
npm install
npm run dev
```

<http://localhost:3000> を開いたら、次を試してみる。

1. `src/app/page.tsx` のテキストを変えて保存する。ブラウザがすぐに更新される（**Fast Refresh**）。
2. `src/app/about/page.tsx` を作り、`export default function About() { return <h1>About</h1> }` と書いて `/about` を開く。本当にフォルダが URL になる！（確認したら削除する）
3. OS をダークモードに切り替えて、色が変わるのを見る（`globals.css`）。
4. `npm run build` を実行して出力を読む。`○ (Static)` と表示されたページは、ビルド時に HTML として事前生成（**pre-rendered / static rendering**）されている。

## 理解度チェック（Check your understanding）

1. 全ページにヘッダーを追加したいとき、どのファイルを編集する？
2. Client Component が DB を直接読めないのはなぜ？
3. `package-lock.json` はコミットするのに、`node_modules/` はしないのはなぜ？

## 英語キーワードまとめ（Key English terms）

| English                       | 日本語                         |
| ----------------------------- | ------------------------------ |
| scaffold (a project)          | プロジェクトのひな形を作る     |
| route / routing               | ルート / ルーティング          |
| layout / wrap                 | 外枠 / 包む                    |
| Server Component / Client Component | サーバー / クライアントコンポーネント |
| render / pre-render           | 描画する / 事前に描画する      |
| dependency                    | 依存パッケージ                 |
| transaction                   | 一連の処理をまとめて全部成功 or 全部失敗にする仕組み |
| race condition                | 同時アクセスによる競合         |
| hosted payment page           | 外部がホストする決済ページ     |
| free tier                     | 無料枠                         |
