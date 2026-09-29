// ─────────────────────────────────────────────────────────────────────────────
// ホームページ（Home page） →  URL: "/"
//
// Step 1: docs/design/kazis-garage-reference.html（"take 5 · shop mode"）を、
// 実際に動く Next.js + Tailwind のページに変換する。商品データはまだ
// ハードコード（データベースは Step 5 で導入）。
//
// このステップでは「見た目」だけを反映している。完成イメージにはカートの
// 開閉・Stripe 決済・配送料の計算が入っているが、それらはまだ実装しない
// （別のステップでまとめてやる）。Nav の「Cart」ボタンは見た目だけで、
// クリックしても何も起きない。
//
// このファイル自体は Server Component（先頭に "use client" が無い）。
// クリックしても何も変わらない部分（Nav・Hero・Ticker・About・Footer）は
// すべてここに書く。フィルターチップだけ状態（useState）が必要なので、
// その部分だけ `<Listings>`（Client Component、src/components/Listings.tsx）
// に切り出してある。これが Step 0 で説明した「動きが必要な部分だけ
// Client Component にする」の実例。
// ─────────────────────────────────────────────────────────────────────────────

import { listings } from "@/lib/listings";
import { Listings } from "@/components/Listings";

const TICKER_ITEMS = [
  "No platform fees",
  "New & used",
  "Ships across Canada",
  "Free pickup in East Van",
  "Secure checkout by Stripe",
  "No app to download",
];

// 「配送する」「取りに来てもらう」の2ルート。それぞれ3ステップ。
const PATHS = [
  {
    title: "Ship it",
    note: "Canada Post · tracked",
    headBg: "bg-blue text-paper",
    steps: [
      {
        title: "Add to cart and pay",
        body: "Card, Apple Pay or Google Pay through Stripe. I never see your card number.",
      },
      {
        title: "I pack it within 2 business days",
        body: "Everything in your cart goes in one box, so you pay shipping once.",
      },
      {
        title: "Track it to your door",
        body: "You get a Canada Post tracking number by email.",
      },
    ],
  },
  {
    title: "Pick it up",
    note: "Free · East Van",
    headBg: "bg-yellow text-ink",
    steps: [
      {
        title: "Choose pickup at checkout",
        body: "Pay online, or reserve it and pay in person by e-Transfer.",
      },
      {
        title: "We pick a time",
        body: "I email you within a day with a few time slots.",
      },
      {
        title: "Meet near Commercial–Broadway",
        body: "Check the item before you take it home. Big items are pickup only; a few new items are ships only.",
      },
    ],
  },
];

const NOW_ITEMS = [
  { label: "Building", text: "This site, with Claude" },
  { label: "Fixing", text: "A squeaky front brake" },
  { label: "Clearing", text: "The garage before winter" },
];

// くり返し使う「太い枠 + ハードシャドウ」ボタンのスタイル。
// hover で左上に少し動き、影が伸びる。active（押した瞬間）で逆に沈む。
const buttonBase =
  "border-[3px] border-ink px-5 py-3 font-bold shadow-[4px_4px_0_var(--ink)] transition-[transform,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--ink)] active:translate-x-0.75 active:translate-y-0.75 active:shadow-[1px_1px_0_var(--ink)]";

export default function HomePage() {
  return (
    <div className="border-ink bg-paper mx-auto my-5.5 max-w-[1040px] border-[3px] shadow-[5px_5px_0_var(--ink)] sm:shadow-[8px_8px_0_var(--ink)]">
      {/* ---- Nav ---- */}
      <header className="border-ink flex flex-wrap items-center justify-between gap-x-5 gap-y-3 border-b-[3px] px-5.5 py-3.5">
        <a
          href="#top"
          className="font-display flex items-center gap-2.5 text-xl no-underline"
        >
          <span
            aria-hidden
            className="border-ink grid h-6.5 w-6.5 grid-cols-2 border-2"
          >
            <i className="bg-red not-italic" />
            <i className="bg-yellow not-italic" />
            <i className="bg-blue not-italic" />
            <i className="bg-paper not-italic" />
          </span>
          Kazi&apos;s Garage
        </a>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <nav
            aria-label="Main"
            className="flex flex-wrap gap-x-4.5 gap-y-1.5 text-sm font-bold"
          >
            <a
              href="#sale"
              className="hover:border-red border-b-[3px] border-transparent no-underline"
            >
              Shop
            </a>
            <a
              href="#how"
              className="hover:border-red border-b-[3px] border-transparent no-underline"
            >
              Shipping &amp; pickup
            </a>
            <a
              href="#about"
              className="hover:border-red border-b-[3px] border-transparent no-underline"
            >
              About me
            </a>
          </nav>
          {/* 見た目だけの Cart ボタン。カートの状態管理は別ステップで実装する。 */}
          <button
            type="button"
            aria-label="Cart, 0 items"
            className="border-ink bg-yellow inline-flex cursor-default items-center gap-2 border-[3px] px-3 py-1.5 text-sm font-bold shadow-[3px_3px_0_var(--ink)]"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className="stroke-ink h-4.5 w-4.5 fill-none stroke-[2.2]"
            >
              <path d="M4 7h16l-1.5 11a2 2 0 0 1-2 1.7H7.5a2 2 0 0 1-2-1.7L4 7Z" />
              <path d="M8 7V5a4 4 0 0 1 8 0v2" />
            </svg>
            Cart
            <span className="bg-red text-paper min-w-5 rounded-full px-1.5 text-center font-mono text-xs">
              0
            </span>
          </button>
        </div>
      </header>

      {/* ---- Hero ---- */}
      <section
        id="top"
        className="border-ink grid grid-cols-1 border-b-[3px] sm:grid-cols-[1.15fr_0.85fr]"
      >
        <div className="min-w-0 px-7.5 pt-11 pb-10">
          <p className="border-ink bg-yellow mb-4.5 inline-block border-2 px-2.5 py-0.5 font-mono text-xs tracking-wide uppercase">
            Hi, I&apos;m Kazi · Vancouver, BC
          </p>
          <h1 className="font-display mb-4.5 text-[clamp(34px,5.6vw,58px)] leading-[1.05] tracking-[-0.01em] text-balance">
            My stuff, my site,{" "}
            <span className="text-red">no&nbsp;middleman</span>.{" "}
            <span className="text-blue">Shipped</span> or picked&nbsp;up.
          </h1>
          <p className="mb-6.5 max-w-[46ch] text-[16.5px]">
            This is my corner of the internet, plus a shop that never closes.
            Some things are used and one of a kind, some are brand new with a
            few in stock. Pay securely by card, and I&apos;ll mail it anywhere
            in Canada or hand it to you in East Van.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#sale" className={`${buttonBase} bg-red text-paper`}>
              Shop now
            </a>
            <a href="#about" className={`${buttonBase} bg-paper text-ink`}>
              Who&apos;s selling?
            </a>
          </div>
        </div>

        <div
          className="border-ink bg-blue relative flex min-w-0 items-center justify-center overflow-hidden border-t-[3px] px-12 py-11 sm:border-t-0 sm:border-l-[3px]"
          aria-label="Example price tag: price $134, no platform fee added, you pay $134"
        >
          <span
            aria-hidden
            className="border-ink bg-yellow absolute -top-10 -right-10 h-37.5 w-37.5 rounded-full border-[3px]"
          />
          <span
            aria-hidden
            className="border-ink bg-red absolute -bottom-7.5 left-4.5 h-22.5 w-22.5 rotate-[12deg] border-[3px]"
          />

          <div className="border-ink bg-paper relative z-1 w-full max-w-72 -rotate-3 border-[3px] px-5 pt-4.5 pb-5 shadow-[7px_7px_0_var(--ink)]">
            <span
              aria-hidden
              className="border-ink bg-blue mx-auto mb-2.5 block h-3.5 w-3.5 rounded-full border-[3px]"
            />
            <p className="border-ink mb-3 border-b-2 border-dashed pb-2.5 text-sm font-bold">
              Digital Torque Wrench Set
            </p>
            <div className="flex justify-between gap-3 py-0.75 font-mono text-[13.5px] tabular-nums">
              <span>Price</span>
              <span>$134.00</span>
            </div>
            <div className="text-muted relative py-0.75 font-mono text-[13.5px] tabular-nums">
              <div className="flex justify-between gap-3">
                <span className="whitespace-nowrap">Platform fee (10%)</span>
                <span className="whitespace-nowrap">+$13.40</span>
              </div>
              <span
                aria-hidden
                className="bg-red absolute inset-x-[-4px] top-1/2 h-[3px] origin-left animate-[strike_0.6s_0.5s_cubic-bezier(0.6,0,0.3,1)_both]"
              />
            </div>
            <div className="border-ink mt-2 flex justify-between gap-3 border-t-[3px] pt-2.5 text-[17px] font-medium">
              <span>You pay</span>
              <span>$134.00</span>
            </div>

            <div
              aria-hidden
              className="border-ink bg-yellow font-display absolute -right-5 -bottom-6.5 grid h-21 w-21 rotate-[12deg] animate-[pop_0.4s_1.05s_cubic-bezier(0.3,1.6,0.5,1)_both] place-items-center rounded-full border-[3px] text-center text-[22px] leading-[0.95]"
            >
              0%
              <small className="mt-0.5 block font-mono text-[8.5px] tracking-wide">
                PLATFORM
                <br />
                FEE
              </small>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Ticker ---- */}
      <div
        aria-hidden
        className="border-ink bg-yellow overflow-hidden border-b-[3px] whitespace-nowrap"
      >
        <div className="font-display inline-flex animate-[scroll_32s_linear_infinite] gap-8.5 py-2.25 text-[15px]">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i}>
              {item} <span className="text-red text-[11px]">●</span>
            </span>
          ))}
        </div>
      </div>

      {/* ---- Listings: the only Client Component on this page ---- */}
      <Listings listings={listings} />

      {/* ---- Two ways to get it ---- */}
      <section id="how" className="border-ink border-b-[3px] px-7.5 py-9">
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-display text-[26px]">Two ways to get it</h2>
          <span className="text-muted font-mono text-[12.5px]">
            Choose at checkout
          </span>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {PATHS.map((path) => (
            <div key={path.title} className="border-ink min-w-0 border-[3px]">
              <div
                className={`border-ink flex flex-wrap items-baseline justify-between gap-2.5 border-b-[3px] px-4.5 py-3 ${path.headBg}`}
              >
                <h3 className="font-display text-lg">{path.title}</h3>
                <span className="font-mono text-xs">{path.note}</span>
              </div>
              <ol className="grid gap-3 px-4.5 py-4">
                {path.steps.map((step, i) => (
                  <li
                    key={step.title}
                    className="grid grid-cols-[28px_minmax(0,1fr)] gap-3 text-sm"
                  >
                    <span className="border-ink bg-paper font-display grid h-7 w-7 place-items-center border-2 text-[13px]">
                      {i + 1}
                    </span>
                    <div>
                      <b className="block text-[15px] font-bold">
                        {step.title}
                      </b>
                      <span className="text-muted">{step.body}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      {/* ---- About ---- */}
      <section id="about" className="border-ink border-b-[3px] px-7.5 py-9">
        <div className="grid grid-cols-1 items-start gap-7 sm:grid-cols-[180px_minmax(0,1fr)]">
          <div
            aria-hidden
            className="border-ink grid aspect-square w-full max-w-45 grid-cols-2 grid-rows-[1.4fr_1fr] border-[3px] shadow-[6px_6px_0_var(--ink)]"
          >
            <i className="border-ink bg-blue font-display text-paper col-span-2 grid place-items-center border-b-[3px] text-4xl not-italic">
              K
            </i>
            <i className="border-ink bg-yellow border-r-[3px] not-italic" />
            <i className="bg-red not-italic" />
          </div>
          <div>
            <h2 className="font-display mb-3 text-[26px]">About me</h2>
            <p className="max-w-[62ch]">
              I&apos;m Kazi, a software engineer in Vancouver who fixes his own
              car on weekends and buys one tool too many. This site is where I
              write about projects, sell things I&apos;ve outgrown, and stock a
              few items I like enough to buy in bulk.
            </p>
            <ul className="mt-4 grid gap-2">
              {NOW_ITEMS.map((item) => (
                <li
                  key={item.label}
                  className="flex items-baseline gap-3 text-[14.5px]"
                >
                  <span className="border-ink w-19 shrink-0 border-2 px-1.5 py-px text-center font-mono text-[11.5px] tracking-wide uppercase">
                    {item.label}
                  </span>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className="bg-ink text-paper flex flex-wrap items-center justify-between gap-3 px-7.5 py-5">
        <div>
          <div className="font-display text-base">Kazi&apos;s Garage</div>
          <div className="text-[13px] opacity-85">
            Vancouver, BC · Shipping by Canada Post · No platform in between.
          </div>
        </div>
      </footer>
    </div>
  );
}
