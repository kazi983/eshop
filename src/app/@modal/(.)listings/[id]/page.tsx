// ─────────────────────────────────────────────────────────────────────────────
// Intercepting Route（インターセプトルート）: `(.)listings/[id]` というフォル
// ダ名がポイント。`(.)` は「同じ階層の `listings/[id]` への**クリックでの
// 遷移**を横取りする」という意味の特別な記法（フォルダ名の一部であって、
// URL には出てこない）。
//
// 挙動の違い：
//   - ホームページの一覧から <Link href="/listings/torque"> をクリック
//     → このファイルが使われる（モーダルとして重ねて表示、裏の一覧は残る）
//   - `/listings/torque` に直接アクセス／リロード／リンクを共有
//     → こちらは無視され、`src/app/listings/[id]/page.tsx`（普通のページ）
//       が使われる
//
// 中身は `src/app/listings/[id]/page.tsx` とほぼ同じで、`<ListingDetail>`
// を共有しつつ、外側を `<Modal>`（Client Component）で包んでいるだけ。
// ─────────────────────────────────────────────────────────────────────────────

import { notFound } from "next/navigation";
import { getListing } from "@/lib/listings";
import { ListingDetail } from "@/components/ListingDetail";
import { Modal } from "@/components/Modal";

export default async function ListingModal({
  params,
}: PageProps<"/listings/[id]">) {
  const { id } = await params;
  const listing = getListing(id);

  if (!listing) {
    notFound();
  }

  return (
    <Modal>
      <ListingDetail listing={listing} />
    </Modal>
  );
}
