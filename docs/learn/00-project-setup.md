# Step 0: Project setup

**Goal:** Create an empty Next.js app, understand every file it contains, and get it running on your machine.

## 1. The command we ran

```bash
npx create-next-app@latest . \
  --ts --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --use-npm
```

| Flag             | Meaning                                                                             |
| ---------------- | ----------------------------------------------------------------------------------- |
| `--ts`           | Use TypeScript. Types catch mistakes such as a missing price before the code runs.  |
| `--tailwind`     | Set up Tailwind CSS v4.                                                             |
| `--eslint`       | Set up the linter, which catches bugs and bad patterns.                             |
| `--app`          | Use the **App Router** (`src/app/`), the modern routing system.                     |
| `--src-dir`      | Put the code in `src/` so it stays separate from config files.                      |
| `--import-alias` | Lets us write `import x from "@/lib/x"` instead of `"../../../lib/x"`.              |

## 2. What each file is for

```
eshop/
├── src/app/              ← all routes (pages) live here
│   ├── layout.tsx        ← wraps every page: <html>, <body>, fonts, metadata
│   ├── page.tsx          ← the page at "/"
│   ├── globals.css       ← global CSS + Tailwind
│   └── favicon.ico       ← the browser tab icon
├── public/               ← static files served as-is (e.g. /robots.txt)
├── docs/learn/           ← these learning notes
├── next.config.ts        ← Next.js settings (empty for now)
├── tsconfig.json         ← TypeScript settings (strict mode, "@/*" alias)
├── eslint.config.mjs     ← linter rules (Next.js + Core Web Vitals + TypeScript)
├── postcss.config.mjs    ← hooks Tailwind into the CSS build
├── package.json          ← dependencies and npm scripts
├── package-lock.json     ← exact installed versions (always commit this!)
├── .nvmrc                ← Node.js version (22)
├── AGENTS.md / CLAUDE.md ← hints for AI coding assistants (see below)
└── .gitignore            ← files git should ignore (node_modules, .next, .env*)
```

**AGENTS.md:** Next.js 16 creates this file itself. It tells AI assistants (including me) to read the docs bundled in `node_modules/next/dist/docs/` rather than rely on older knowledge. `next dev` re-adds it if it's removed, so we keep it.

## 3. Key idea: the App Router is "folders = URLs"

```
src/app/page.tsx                    →  /
src/app/products/page.tsx           →  /products
src/app/products/[slug]/page.tsx    →  /products/blue-tee   ([slug] is a variable)
src/app/admin/layout.tsx            →  a layout shared by every /admin/* page
```

Special file names: `page.tsx` (the page itself), `layout.tsx` (shared wrapper), `loading.tsx` (shown while loading), `error.tsx` (shown on errors), `not-found.tsx` (404) and `route.ts` (an API endpoint, e.g. for the Stripe webhook).

## 4. Key idea: Server Components by default

Every component in `src/app/` is a **Server Component** unless it starts with `"use client"`.

|                          | Server Component (default)            | Client Component (`"use client"`)       |
| ------------------------ | ------------------------------------- | --------------------------------------- |
| Runs on                  | the server only                       | the server (first HTML) **and** browser |
| Can read the DB directly | ✅                                    | ❌ (secrets would leak)                 |
| `useState`, `onClick`    | ❌                                    | ✅                                      |
| JS sent to browser       | none                                  | yes                                     |

This matters for an e-commerce site:

- **Product pages** are Server Components. They are fast, SEO-friendly and can read the DB directly.
- **"Add to cart" button** is a Client Component because it needs `onClick` and state.

We'll see both in Steps 1–4.

## 5. Why these technology choices?

Your shop sells physical products with variants and stock, has fewer than 100 products, needs guest checkout and an admin console, is English with CAD prices, and should run on free tiers.

- **Next.js** gives you pages, SEO, API endpoints (for Stripe webhooks) and admin in one project, and deploys to Vercel for free.
- **PostgreSQL (relational DB)** fits because orders, order items, variants and stock are strongly *related* data. Stock changes must be **transactional**: two people buying the last shirt at the same moment must not both succeed. Postgres handles that well. A document DB (e.g. MongoDB, Firestore) makes this harder. We'll go deeper in Step 5.
- **Neon** offers free serverless Postgres that works well with Vercel.
- **Stripe Checkout** is a hosted payment page. Card numbers never touch our server, which keeps us out of most PCI compliance work. It supports CAD. There's no monthly fee; Stripe only takes a fee per sale.

## 6. Try it yourself

```bash
git clone https://github.com/kazi983/eshop.git && cd eshop
git checkout claude/ecommerce-site-build-4rugwo
nvm install && nvm use
npm install
npm run dev
```

Open <http://localhost:3000>. Then try these:

1. Change the text in `src/app/page.tsx` and save. The browser updates instantly (Fast Refresh).
2. Create `src/app/about/page.tsx` with `export default function About() { return <h1>About</h1> }` and visit `/about`. Folders really are URLs! (Delete it afterwards.)
3. Switch your OS to dark mode and watch the colours change (`globals.css`).
4. Run `npm run build` and read the output. Pages marked `○ (Static)` are pre-rendered to HTML at build time.

## Questions to check your understanding

1. Which file would you edit to add a header to every page?
2. Why can't a Client Component read the database directly?
3. Why is `package-lock.json` committed, but `node_modules/` is not?
