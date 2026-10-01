// ─────────────────────────────────────────────────────────────────────────────
// `@modal` スロットの `page.tsx`（サブフォルダ無し）＝「URL がちょうど `/` の
// ときに、このスロットに表示するもの」。`@modal/default.tsx`（マッチしない
// あらゆる場合の受け皿）とは別の、`/` 専用のページ。
//
// 中身は `<WelcomeModal>` に任せている。「閉じる」をどう扱うかは
// WelcomeModal.tsx のコメント参照（router.back() を使わない理由）。
// ─────────────────────────────────────────────────────────────────────────────

import { WelcomeModal } from "@/components/WelcomeModal";

export default function ModalHome() {
  return <WelcomeModal />;
}
