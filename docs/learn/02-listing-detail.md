# Step 2: 出品詳細（Listing detail）

**ゴール（goal）：** 完成イメージの「商品ビューア（写真ギャラリー付きのモーダル）」を、
**モーダルとして開けつつ、URL で共有できる普通のページでもある**形で実装する。

## 1. Intercepting Routes（インターセプトルート）

「基本モーダルだけど URL で共有できる個別ページも持てる？」という質問に対する答えが、
Next.js の **Parallel Routes（並行ルート）** と **Intercepting Routes（インターセプトルート）**
という2つの仕組みの組み合わせ。

```
src/app/
├─ layout.tsx                          ← { children, modal } の両方を描画する
├─ page.tsx                            ← ホームページ（一覧）
├─ @modal/                             ← Parallel Route の「スロット」
│  ├─ default.tsx                      ← 何も無いときは null
│  └─ (.)listings/[id]/page.tsx        ← ★ ここが「割り込み」担当
└─ listings/[id]/
   └─ page.tsx                         ← 普通のページ（直接アクセス・リロード用）
```

- **`@modal`** ＝ Parallel Route。`layout.tsx` の `children` とは別に、もう1つの
  「差し込み口」を作る。フォルダ名の `@` は URL には出てこない
- **`(.)listings/[id]`** ＝ Intercepting Route。`(.)` は「同じ階層にある
  `listings/[id]` への**クリックでの遷移（ソフトナビゲーション）**を横取りする」
  という意味（これもフォルダ名の記法で、URL には出ない）

**挙動の分かれ方：**

| どうやって `/listings/torque` に来たか     | 表示されるもの                                                 |
| ------------------------------------------ | -------------------------------------------------------------- |
| ホームの一覧から `<Link>` をクリック       | `@modal/(.)listings/[id]/page.tsx`（モーダル。裏の一覧が残る） |
| URL に直接アクセス／リロード／リンクを共有 | `listings/[id]/page.tsx`（普通のページ）                       |

これは Step 0 で予告した dynamic segment（`[id]`）を実際に使った初めての場面。
`params` は Promise になっている（Next.js 15 以降の仕様）ので、`await params` が必要：

```tsx
export default async function ListingPage({ params }: PageProps<"/listings/[id]">) {
  const { id } = await params;
  const listing = getListing(id);
  if (!listing) notFound(); // Next.js 標準の 404 ページを表示
  ...
}
```

## 2. 同じ見た目を2箇所で使う（`<ListingDetail>`）

モーダル版とページ版で、中身（写真ギャラリー＋商品情報）は完全に同じにしたいので、
共通の Server Component `<ListingDetail listing={listing} />` として切り出し、
両方から呼んでいる。違うのは**外側だけ**：

- ページ版：`<header>` ＋ `<ListingDetail>` ＋ `<footer>`
- モーダル版：`<Modal>`（Client Component）で `<ListingDetail>` を包む

## 3. `<Modal>` が Client Component である理由

`src/components/Modal.tsx` は `"use client"` が必要。理由は2つ、どちらもブラウザでしか
できないこと：

1. **Esc キーで閉じる**（キーボードイベント）
2. **背景をクリックしたら閉じる**（クリックイベント）

「閉じる」処理は `router.back()`。モーダルはソフトナビゲーションの**上に重なっている
だけ**なので、1つ戻れば裏にあった一覧ページに戻る——ブラウザの「戻る」ボタンを押した
ときと同じ理屈。

## 4. `<Gallery>` の状態は「一時的」（Step 1 の Q4 の続き）

写真の切り替え（`useState` で「今何枚目か」を覚える）は、Step 1 の Q4 で話した
「一時的な状態（ephemeral）」に当たる。モーダルを閉じてもう一度開けば 1 枚目に戻って
問題ないし、ブラウザに保存する必要も無い。だからカートとは違って、この場で作り切って
良いと判断した——「Add to cart」ボタンは Step 1 と同じ方針で、まだ `onClick` を
付けていない。

## 5. 写真データの持たせ方

実物の写真はまだ無いので、`src/lib/listings.ts` の各出品に `photos: Photo[]`
（キャプション＋色＋形）を追加した。今まで使っていた「色付きブロックのプレース
ホルダー」を、1商品につき1枚ではなく**複数枚**用意しただけ——新しい仕組みを増やさず、
既にある表現方法を使い回している。

## 自分で試してみよう

1. `npm run dev` で開いて、商品名か写真をクリックしてみる。URL が
   `/listings/torque` のように変わるのに、一覧ページは裏に残っていることを確認する
2. Esc キーで閉じてみる。ブラウザの「戻る」ボタンでも同じように閉じられるか試す
3. `/listings/torque` を直接アドレスバーに入力してみる（または開いているタブを
   リロードしてみる）。今度はモーダルではなく、普通のページとして表示されるはず
4. `/listings/does-not-exist` にアクセスしてみる。Next.js 標準の 404 ページが出るのを確認する
