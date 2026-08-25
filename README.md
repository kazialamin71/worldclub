# World Club — Website

Marketing and trade website for **World Club**, Importer, Exporter & Distributor of
world-class brands to Bangladesh.

Built with **Astro 5 + Tailwind CSS 4**. It compiles to plain static HTML/CSS with almost no
JavaScript, so it loads fast, scores well on Core Web Vitals, and can be hosted anywhere —
Vercel, Netlify, Cloudflare Pages, or ordinary cPanel shared hosting.

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs static site to dist/
npm run preview  # preview the built site locally
```

Requires Node 18.20+, 20.3+ or 22+.

---

## Where everything lives

```
src/
  consts.ts                    ← phone, email, domain, nav, form key   ⭐ EDIT THIS FIRST
  data/
    company.json               ← stats, leadership, offices, warehouses, policies, future plans
    clients.json               ← client & distributor list
    brands.json                ← brands represented + own brands
  content/
    products/*.md              ← one file per product category (file name = URL slug)
    certifications/*.md        ← one file per certificate
  components/                  ← reusable UI pieces
  layouts/BaseLayout.astro     ← page shell (head, header, footer)
  pages/                       ← one file per page/route
  styles/global.css            ← colours, fonts, shadows  ⭐ EDIT TO RE-BRAND
public/
  certificates/                ← the four certificate PDFs, publicly downloadable
  certificates/thumbs/         ← preview images shown on the certifications page
  images/products/             ← drop product photos here (see below)
  images/clients/              ← drop client logos here (see below)
  images/brands/               ← drop brand logos here (see below)
```

---

## Common edits

### Change a phone number, email or the domain
`src/consts.ts` — nothing else hard-codes them.

### Turn the enquiry form on ⚠️ REQUIRED BEFORE LAUNCH
The contact form posts to [Web3Forms](https://web3forms.com) (free, no backend needed).

1. Go to web3forms.com and enter the company inbox address.
2. Copy the access key they email you.
3. Paste it into `FORM_ACCESS_KEY` in `src/consts.ts`.

Until you do, the form shows a yellow setup notice and will not deliver mail. The notice
disappears by itself once a real key is in place.

### Add or edit a product category
Create a new `.md` file in `src/content/products/`. The file name becomes the URL
(`sauces-condiments.md` → `/products/sauces-condiments`). Copy an existing file as a template:

```yaml
---
title: Sauces & Condiments
order: 11                 # position in listings
featured: false           # true = also shown on the homepage
icon: droplet             # see src/components/Icon.astro for the full set
tagline: Short line shown above the title
summary: One or two sentences used in cards, search results and social shares.
storage: Ambient, dry
origins: [Thailand, Netherlands]
items:
  - Product one
  - Product two
---

Body copy in Markdown. Two or three paragraphs is right.
```

The category appears automatically in the navigation footer, the products page, the sourcing
origins map, the enquiry form dropdown and the sitemap. No code changes needed.

### Add a client or a brand
Add an entry to `src/data/clients.json` or `src/data/brands.json`.
Leave `"logo": ""` and the site renders a clean typographic tile instead — the grid never
looks broken. To use a real logo, drop the file into `public/images/clients/` (or `brands/`)
and set `"logo": "/images/clients/unimart.png"`.

### Update a certificate (e.g. after renewal)
1. Put the new PDF in `public/certificates/`.
2. Make a preview image: `pdftoppm -jpeg -jpegopt quality=68 -r 40 -f 1 -l 1 new-cert.pdf public/certificates/thumbs/name`
3. Update the dates and certificate number in the matching file in `src/content/certifications/`.

### Add real photography
The site is deliberately designed to look finished **without** photos — categories use
generated patterns instead of stock images. To add real photos, drop a file into
`public/images/products/` and add one line to the category's front matter:

```yaml
image: /images/products/fresh-fruits.jpg
```

Recommended: 1600×900px, JPG or WebP, under 250 KB. Photograph actual stock — real warehouse,
cold-storage and product photos will outperform stock imagery for a trade buyer.

### Re-brand colours or fonts
`src/styles/global.css`, in the `@theme` block at the top. Everything else derives from it.

---

## Before you go live — checklist

| # | Task | Where |
|---|------|-------|
| 1 | Set the real domain | `astro.config.mjs` (`SITE`) **and** `src/consts.ts` (`SITE.url`) **and** `public/robots.txt` |
| 2 | Add the Web3Forms access key | `src/consts.ts` |
| 3 | Move off the gmail address to `info@yourdomain.com` | `src/consts.ts` |
| 4 | **Confirm the HACCP certificate dates with QBM** — the printed certificate has two labels transposed (see the comment in the file) | `src/content/certifications/haccp.md` |
| 5 | Confirm the per-category `origins:` lists with the sourcing team | `src/content/products/*.md` |
| 6 | Add real client and brand logo files | `public/images/clients/`, `public/images/brands/` |
| 7 | Add product photography | `public/images/products/` |
| 8 | Submit the sitemap in Google Search Console | `/sitemap-index.xml` |
| 9 | Set up Google Business Profile for the Dhaka office | (external) |

---

## Deployment

**Cloudflare Pages / Netlify / Vercel** — connect the repository, then:
- Build command: `npm run build`
- Output directory: `dist`

**Shared hosting (cPanel)** — run `npm run build` locally and upload the **contents** of
`dist/` into `public_html/`. Add this to `.htaccess` for a clean 404 page:

```apache
ErrorDocument 404 /404.html
```

---

## What's built in

- **SEO** — per-page titles, meta descriptions, canonical URLs, Open Graph and Twitter cards,
  an auto-generated sitemap, `robots.txt`, and JSON-LD structured data (Organization with all
  five offices and the three certifications, WebSite, BreadcrumbList, ProductGroup, ItemList).
- **Performance** — static HTML, ~46 KB of CSS total, no JS framework, lazy-loaded images with
  explicit dimensions (no layout shift), self-hostable fonts.
- **Accessibility** — skip link, keyboard focus rings, one `<h1>` per page, labelled form
  fields, `aria-current` navigation state, alt text on every image, and full
  `prefers-reduced-motion` support.
- **Trade-buyer features** — downloadable certificate PDFs with numbers and dates, a client
  list grouped by segment, a sourcing-origin index built automatically from product content,
  a category-aware enquiry form and a floating WhatsApp button.

---

## Source documents

The five PDFs in the repository root are the originals this content was written from
(business profile, ISO 9001, ISO 22000, HACCP and DCCI membership certificate). They are kept
for reference; the four certificates are also published under `public/certificates/`.

---

## Dependency note

`vite` is pinned to **^6.4.1** as a direct dependency on purpose. Newer Vite (8.x) pulls in
`rolldown`, whose native binary fails to install on some Linux setups — including this one —
which breaks `astro build` with `Cannot find module '@rolldown/binding-wasm32-wasi'`. Astro 5
itself targets Vite 6, so pinning keeps a single Vite in the tree and the type-checker clean.
Don't bump it without testing `npm run build` and `npx astro check` on a clean `node_modules`.
