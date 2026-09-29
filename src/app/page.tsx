// ─────────────────────────────────────────────────────────────────────────────
// Home page  →  URL: "/"
//
// A file named `page.tsx` makes its folder reachable as a URL.
//   src/app/page.tsx               → /
//   src/app/products/page.tsx      → /products        (coming in Step 1)
//   src/app/products/[slug]/page.tsx → /products/blue-tee (Step 2)
//
// For now this is just a placeholder so we can confirm the app runs.
// Styling uses Tailwind CSS utility classes (`className="text-3xl ..."`).
// We will compare Tailwind with CSS Modules in a later step.
// ─────────────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    // <main> marks the main content of the page (good for accessibility).
    // mx-auto + max-w-3xl  → centered column, at most 48rem wide
    // flex-1               → grow to fill the height of <body>
    // px-4 py-16           → padding: 1rem left/right, 4rem top/bottom
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-6 px-4 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">eshop</h1>
      <p className="text-lg text-zinc-600 dark:text-zinc-400">
        Our shop is being built, one small step at a time.
      </p>
    </main>
  );
}
