# Step 1: ホームページ（Homepage）

**ゴール（goal）：** `docs/design/kazis-garage-reference.html`（完成イメージ）を、実際に動く
Next.js + Tailwind のページに変換する。データはまだハードコード。

## 1. ビジネスモデルが変わった話

このステップの直前に、完成イメージ（Kazi's Garage）を見て分かったこと：これはオンライン決済のある
「ネットショップ」ではなく、**個人のガレージセール掲示板**だった。

|        | 当初の想定                          | 実際（Kazi's Garage）                                     |
| ------ | ----------------------------------- | --------------------------------------------------------- |
| 決済   | Stripe（オンライン決済）            | 無し。「Ask about this」→ 連絡 → 対面で e-Transfer / 現金 |
| カート | あり                                | 無い（買い物かごの概念自体が無い）                        |
| 在庫   | 数量・バリエーション（variant）管理 | 1点物（one-off）。売れたら `sold: true` にするだけ        |

README のロードマップもこれに合わせて更新した。Stripe・カート・在庫予約（トランザクション）は削除し、
学習目的での Stripe 体験だけ任意のステップとして残してある。

## 2. Server Component と Client Component の使い分け（実例）

Step 0 で説明した「動きが必要な部分だけ Client Component にする」を、初めて実際のコードで使った。

```
src/app/page.tsx         ← Server Component（"use client" 無し）
  ├─ Nav, Hero, Ticker         → 静的な HTML。クリックしても何も変わらない
  ├─ <Listings listings={…}>  → ここだけ Client Component（フィルターチップに useState が必要）
  └─ HowItWorks, About, Footer → 静的な HTML
```

`src/components/Listings.tsx` の先頭に `"use client"` と書いてあるのはこのファイルだけ。
フィルターチップ（All / Garage / Home / Outdoor）を押すと表示する出品が切り替わるが、これには

- `useState`（今どのフィルターが選ばれているか、という**状態**を覚えておく）
- `onClick`（ボタンを押したときの処理）

が必要で、どちらも Server Component ではできない。ページの他の部分は全部「ただの HTML」なので、
Server Component のままで良い——JS を送る必要が無いので、その分ブラウザに送られる JavaScript が減る。

## 3. ハードコードデータの設計（`src/lib/listings.ts`）

商品ではなく「出品（listing）」という言葉を使っている。理由は、新品を複数在庫持つ「商品（product）」
ではなく、Kazi が持っている**1点物の中古品**だから。型はこう：

```ts
export type Listing = {
  id: string;
  name: string;
  story: string; // 状態や経緯を一言で
  price: number;
  wasPrice?: number; // 値下げした場合、元の価格
  category: "garage" | "home" | "outdoor";
  condition: "Like new" | "Good" | "Fair";
  sold?: boolean;
};
```

Step 5 でこの配列をデータベースに置き換える予定だが、他のファイルは `listings` という名前の配列を
import しているだけなので、データの取得元が変わってもコンポーネント側はほぼ変更不要——これが
「データとUIを分ける」設計のメリット。

## 4. Tailwind でデザインを再現する（新しく出てきた書き方）

- **カスタムテーマトークン：** `globals.css` の `@theme inline` に `--color-red` などを追加すると、
  `bg-red` / `text-red` / `border-red` が使えるようになる（Step 0 の `--color-background` と同じ仕組み）
- **任意の値（arbitrary values）：** Tailwind の既定サイズに無い値は `[ ]` で直接指定できる。
  例：`border-[3px]`（既定は `border`=1px か `border-2`=2px しか無い）、
  `shadow-[6px_6px_0_var(--ink)]`（角がはっきり付いた「ベタ塗りの影」。よくある `shadow-lg` の
  ぼかし影とは違う）
- **小数のスペーシング：** Tailwind CSS v4 では `px-7.5`（=30px）のように小数も使える。
  v3 までは決められた数値（1, 2, 3...）しか無かったが、v4 は `calc(var(--spacing) * 7.5)` を
  その場で計算するようになった
- **自作のアニメーション：** `@keyframes strike { ... }` を `globals.css` に書いて、
  `animate-[strike_0.6s_0.5s_...]` のように名前を指定して使う。Tailwind に無いアニメーションは
  こうやって自分で追加できる

## 5. 見つけたバグと直し方

ヒーローの領収書カード（"I get" の金額）が、右端で切れて見えなくなっていた。原因は：

- カードに `-rotate-3`（反時計回りに3度）をかけていた
- 回転の中心はカードの真ん中なので、**下の方にある要素ほど、右に大きくズレる**
- 一番下の行（"I get"）が、一番右にズレて、親要素の `overflow-hidden` に切られていた

直し方はシンプルで、親要素の余白（padding）を増やし、カード自体の最大幅を少し狭くしただけ
（`px-6` → `px-9`、`max-w-[290px]` → `max-w-64`）。回転や影のような「見た目は箱からはみ出す」
スタイルを使うときは、**実際のレイアウト箱（box）より少し外側まで余白を確保しておく**、
という教訓。

## 自分で試してみよう

1. `npm run dev` で開いて、フィルターチップを押してみる。ブラウザの DevTools で
   `src/components/Listings.tsx` の `useState` に breakpoint を張ると、クリックのたびに
   `filter` の値が変わるのが見える
2. `src/lib/listings.ts` に新しい出品を1つ追加してみる。`sold: true` にすると何が変わるか確認する
3. ブラウザの DevTools で「Emulate CSS prefers-reduced-motion: reduce」を有効にすると、
   ticker のスクロールや 0% スタンプのアニメーションが止まるのを確認できる

## 理解度チェック（Comprehension check）

CLAUDE.md のルールに沿って、この後まとめて質問します（日本語で評価・英語の model answer 付き、
`docs/learn/review-questions.md` に記録）。
