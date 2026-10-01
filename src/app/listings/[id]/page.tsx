// ─────────────────────────────────────────────────────────────────────────────
// 出品詳細ページ →  URL: "/listings/[id]"（例：/listings/torque）
//
// Step 0 で予告した dynamic segment（`[id]`）を、ここで実際に使う。
// `src/app/listings/` フォルダの中に `[id]` という名前のフォルダがあるので、
// `/listings/torque` にアクセスすると、その "torque" という値が
// `params.id` として渡ってくる。
//
// これは URL に直接アクセスしたとき・リロードしたとき・リンクを共有された
// ときに表示される、**普通のページ**。ホームページのグリッドから
// クリックしたときは、代わりに `src/app/@modal/(.)listings/[id]/page.tsx`
// が「割り込んで」モーダルとして表示される（Intercepting Routes）。
// 中身の見た目（写真ギャラリー＋商品情報）はどちらも同じ
// `<ListingDetail>` を共有している。
//
// `id` が存在しなければ `notFound()` を呼ぶ。この隣にある
// `not-found.tsx` が、そのときに表示される 404 ページ。
// ─────────────────────────────────────────────────────────────────────────────

import { notFound } from "next/navigation";
import { getListing } from "@/lib/listings";
import { ListingDetail } from "@/components/ListingDetail";
import { DetailFrame } from "@/components/DetailFrame";

export default async function ListingPage({
  params,
}: PageProps<"/listings/[id]">) {
  const { id } = await params;
  const listing = getListing(id);

  if (!listing) {
    notFound();
  }

  return (
    <DetailFrame>
      <ListingDetail listing={listing} />
    </DetailFrame>
  );
}
