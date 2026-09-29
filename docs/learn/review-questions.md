# Review questions（理解度チェックの記録）

各ステップの後に出題した理解度チェックの質問と、回答・添削・model answer をここに時系列で記録する。
後で読み返して復習する（**spaced repetition** 的な使い方）ためのファイル。

凡例：

- ❓ 未回答（not yet answered）
- ⚠️ 回答したが要復習（answered, needs review）
- ✅ 理解できている（understood）

---

## Step 1: Homepage

### Q4: データの形とロジックを分けてスコープ管理する

**Q (EN):** The design was updated to include a cart and Stripe checkout, and
you confirmed that's the real direction. Why did the homepage sync add new
_fields_ to `Listing` (`isNew`, `stock`, `mode`, `size`) but NOT add any
`onClick` handler to the "Add to cart" button? What's the difference between
"the data's shape" and "the logic that acts on it," and why is that
distinction useful for keeping a step's scope under control?

**Status:** ❓ 未回答

---

### Q1: Server/Client の境界線をどこで引くか

**Q (EN):** Why is `src/components/Listings.tsx` a Client Component while
`src/app/page.tsx` (which renders it) stays a Server Component? What's the
general rule for deciding where the `"use client"` boundary goes?

**Status:** ✅ 理解できている

**回答の要約：** 「client での操作が必要かどうかをファイルごとに判断し、不要なら
Server Component にする」「state を使って見た目をサーバーを介さずに変えたいときに
client 操作が必要」——核心を正確に理解できていた。判断基準を「state」だけに
限定していたので、`onClick` などのイベントハンドラーや `useEffect`、
`localStorage` などブラウザ専用 API も同じ理由（ブラウザでしか実行できない）で
Client Component が必要になる、と補足した。

**Model answer (EN):**

> "The `'use client'` boundary is decided per component, not per whole app: a
> component only needs to be a Client Component if it uses something that can
> only run in the browser — state (`useState`), other Hooks (`useEffect`),
> event handlers (`onClick`), or browser-only APIs like `localStorage`.
> Everything else stays a Server Component, which is the default, so JS for
> it never ships to the browser."

---

### Q3: `Listing` という型名の選択

**Q (EN):** In `src/lib/listings.ts`, why is the type called `Listing`
instead of `Product`, and what does its shape (no `quantity`, no variants)
tell you about the business model this site is built for?

**Status:** ⚠️ 要復習

**回答の要約：** 「Listing の方が良い」という結論は正しかったが、理由として
「リストを表示する意味合いが出るから」と回答しており、"list"（一覧・配列）と
"a listing"（不動産・eBay などで使う「1件の出品」の意味）を混同していた。
本来の理由——`Product` は新品・SKU・複数在庫・バリエーションを持つ「カタログの
商品」を連想させる言葉、`Listing` は個人が出す「1件の出品」を連想させる言葉で、
このサイトのビジネスモデル（フリマ的な個人販売）に合っている——には触れられず、
質問後半（`quantity`/variant が無いことが何を語るか）への回答も無かった。

**Model answer (EN):**

> "`Listing` was chosen over `Product` because these items are posted for
> sale individually — like a real-estate or eBay listing — not manufactured
> goods sitting in a catalog. `Product` implies a SKU with stock and variants
> (size, color) at scale; `Listing` implies one specific posting, whether
> it's a one-of-a-kind used item or a restockable new one. The absence of
> `quantity`/variant fields in the type reflects that: this is a personal
> marketplace, not a shop catalog."

---

## Step 0: Project setup

### Q1: Server Component と Client Component の違い

**Q (EN):** What is the difference between a Server Component and a Client
Component in the Next.js App Router? Give one concrete reason why the product
pages should be Server Components.

**Status:** ⚠️ 要復習

**回答の要約：** Server Component はリクエストに応じてサーバーが返す、という理解は概ね正しかった。
一方で、商品ページを Server Component にする理由として「売り手が再ビルド無しで商品を更新できるから」
と答えたが、これは **Server/Client Component の軸**（どこで動くか・DB に直接アクセスできるか）と
**Static/Dynamic rendering の軸**（HTML をいつ作るか）を混同したもの。この2つは独立した軸であり、
「再ビルド不要」は Server Component + dynamic rendering の組み合わせで実現される。
また、Client Component は「ビルド時に一度だけレンダリングされる」のではなく、初回はサーバーで
1度レンダリングされた後、ブラウザで **hydration**（ハイドレーション）されて以降はブラウザ側で
再レンダリングされる、という2段階のプロセスであることも未整理だった。

**本人のコメント（2026-09-28 23:24 ごろ）：** "I don't quite get that yet" — hydration や
static/dynamic rendering の区別について、まだ腑に落ちていないと申告。要復習。

**Model answer (EN):**

> "Product pages should be Server Components because they can query the
> database directly, without exposing an API or shipping DB credentials to
> the browser. Combined with dynamic rendering — which Next.js applies
> automatically when a Server Component reads uncached data — this also
> means the seller's product updates show up on the very next request, with
> no rebuild required from me."

**復習用メモ:**

| 軸                          | 問うている内容           | 選択肢                                    |
| --------------------------- | ------------------------ | ----------------------------------------- |
| Server vs Client Component  | どこで動き、何ができるか | Server / Client                           |
| Static vs Dynamic rendering | HTML をいつ作るか        | Static（要再ビルド）/ Dynamic（毎回最新） |

---

### Q2: `[slug]` と dynamic segment

**Q (EN):** In `src/app/products/[slug]/page.tsx`, what does `[slug]`
represent, and what's the difference between this and a plain folder like
`products`?

**Status:** ⚠️ 要復習

**回答の要約：** 「compiler が slug files を生成する」という発想は、**Static Site
Generation（`generateStaticParams()`）** を使った場合には部分的に正しい
（ビルド時に `blue-tee.html` のような実ファイルが生成されることがある）。
ただしこれは `[slug]` の本質ではない。`[slug]` はまず **dynamic segment（動的
セグメント）**——URL パス中の「どんな値にも一致するプレースホルダー」——であり、
`products` のような **static segment**（決まった文字列にしか一致しない）との違いは
「1つのテンプレートで無数の URL を扱えるかどうか」。ビルド時に事前生成する（SSG）か
リクエスト毎に動的に処理するかは、Q1 の Static/Dynamic rendering の軸と同じ、
別の独立した話。

**Model answer (EN):**

> "`[slug]` is a dynamic route segment — a placeholder that matches any value
> in that position of the URL, unlike a plain folder like `products`, which
> only matches that exact literal string. One `page.tsx` file inside `[slug]`
> acts as a template for every product page; Next.js passes the actual
> value — say, `'blue-tee'` — into the component as `params.slug`, so I can
> look up the right product from the database. Whether that page is
> pre-built into a static HTML file at build time, or rendered on demand per
> request, is a separate decision controlled by `generateStaticParams()`."

---

### Q3: `next/font` が build time にダウンロードする理由

**Q (EN):** Why does `next/font` download fonts at build time instead of
letting the browser fetch them from Google at runtime? Name one concrete
benefit.

**Status:** ✅ 理解できている

**回答の要約：** フォントデータは頻繁に更新されないので、リクエストのたびに
Google から取得する必要がなく、ビルド時に一度だけダウンロードしておけば良い。
ブラウザが毎回外部（Google）にアクセスするとネットワーク越しの取得に時間がかかり
レスポンスが遅くなる、という核心を正しく説明できていた。self-hosting の
副次的メリット（privacy、layout shift 防止）はおまけとして補足した。

**Model answer (EN):**

> "`next/font` downloads font files at build time and bundles them as static
> assets, so the browser never has to make a runtime request to an external
> domain like Google Fonts. Since font files rarely change, there's no need
> to fetch the 'latest' version on every request — pre-fetching them once at
> build time avoids that extra network round trip, which would otherwise
> slow down the page's response. As a bonus, this also improves privacy,
> since the browser makes zero requests to Google, and it lets Next.js
> control font-loading behavior to prevent layout shift."

---

### Q4: `package-lock.json` と `node_modules/`

**Q (EN):** Why is `package-lock.json` committed to git, but `node_modules/`
is not?

**Status:** ⚠️ 要復習

**回答の要約：** `node_modules/` については正確（`npm install` で再生成できる、巨大に
なりうるので git 管理に向かない）。ただし質問の核心である `package-lock.json` に
ついては、`package.json`（バージョンの**範囲**を書くファイル）と混同しており、
`package-lock.json` が依存関係ツリー全体の**厳密なバージョン**を固定し、
reproducible build（再現可能なビルド）を保証する、という役割には触れられなかった。

**Model answer (EN):**

> "`package.json` only specifies acceptable version _ranges_ for each
> dependency — it doesn't pin exact versions, especially for nested
> (transitive) dependencies I never listed directly. `package-lock.json`
> records the exact, resolved version of every package in the whole
> dependency tree, so `npm install` produces a bit-for-bit identical
> `node_modules/` on any machine, at any time — that's what makes builds
> reproducible. `node_modules/` itself isn't committed because it's just the
> regenerated _result_ of that lock file: it can be huge, and anyone can
> recreate it locally by running `npm install`, so storing it in git would
> only bloat the repo for no benefit."

**フォローアップ質問：** "Why not just put everything into `package.json`
instead of having a separate `package-lock.json`?"

**回答の要点：** `package.json` は人間が書く小さいファイルで、直接使う
パッケージのバージョン*範囲*だけを書く。実際には孫依存（transitive
dependencies）が数百個あり、それらは `npm install` の実行時に npm が
自動で解決する。それを手で `package.json` に書くのは現実的でないため、
npm が自動生成する `package-lock.json` に、全パッケージの厳密なバージョン
＋改ざん検知用のハッシュ値（integrity hash）を記録する。役割（人間の意図
の表明 vs 機械による再現性・セキュリティの保証）が異なるため、1ファイルに
統合できない。Yarn の `yarn.lock`、pnpm の `pnpm-lock.yaml` も同じ理由で
存在する、業界共通の設計パターン。
