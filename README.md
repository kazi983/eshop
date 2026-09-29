# eshop

A small online shop for physical products, built step by step as a learning project.
The storefront is in English and all prices are in Canadian dollars (CAD).

## Getting started (Ubuntu)

You need Node.js 22. The version is pinned in `.nvmrc`.

```bash
# Install nvm once, if you don't have it: https://github.com/nvm-sh/nvm
nvm install        # reads .nvmrc and installs Node 22
nvm use

npm install        # install dependencies from package-lock.json
npm run dev        # start the dev server → http://localhost:3000
```

Other scripts:

| Command         | What it does                                          |
| --------------- | ----------------------------------------------------- |
| `npm run dev`   | Development server with hot reload                    |
| `npm run build` | Production build (also type-checks)                   |
| `npm start`     | Serve the production build (run `build` first)        |
| `npm run lint`  | Check the code with ESLint                            |

## Tech stack (planned)

| Area           | Choice                                          | Free tier |
| -------------- | ----------------------------------------------- | --------- |
| Framework      | Next.js (App Router) + React + TypeScript       | —         |
| Styling        | Tailwind CSS (compared with CSS Modules later)  | —         |
| Database       | PostgreSQL on Neon + Drizzle ORM                | ✅        |
| Auth (admin)   | Auth.js or Better Auth                          | —         |
| Payments       | Stripe Checkout + webhooks (test mode first)    | ✅ (pay per sale) |
| Images         | To be decided (e.g. Vercel Blob / Cloudinary)   | ✅        |
| PWA            | Web App Manifest + Service Worker (Serwist)     | —         |
| Hosting        | Vercel (Hobby)                                  | ✅        |
| Tests          | Vitest + Playwright                             | —         |

## Roadmap

Each step is one small PR and has a learning note in [`docs/learn/`](docs/learn/).

- [x] **Step 0:** Project setup ([notes](docs/learn/00-project-setup.md))
- [ ] **Step 1:** Product list page with hard-coded data
- [ ] **Step 2:** Product detail page with variants (size, colour)
- [ ] **Step 3:** CSS deep dive: Tailwind vs CSS Modules
- [ ] **Step 4:** Cart (client state, persisted in the browser)
- [ ] **Step 5:** Database: PostgreSQL + Drizzle, schema for products, variants, stock
- [ ] **Step 6:** Admin console: sign-in and product/stock management
- [ ] **Step 7:** Guest checkout with Stripe (test mode) + webhook → orders
- [ ] **Step 8:** Stock reservation and decrement (transactions)
- [ ] **Step 9:** Order emails and shipping details
- [ ] **Step 10:** PWA: installable, offline page, caching
- [ ] **Step 11:** Tests (unit + end-to-end)
- [ ] **Step 12:** Deploy to Vercel + go-live checklist
