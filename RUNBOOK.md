# World Club — Operations Runbook

Everything needed to run, update and deploy the site. Keep this file up to date as things change.

**Last updated:** 26 August 2026

---

## 1. Live URLs

| What | URL | Notes |
|---|---|---|
| **Live website** | https://arisa-worldclub.com | Public site |
| **www** | https://www.arisa-worldclub.com | Should redirect to the bare domain |
| **Studio** (edit content) | https://worldclub.sanity.studio | Vanity URL |
| **Studio** (direct link) | https://www.sanity.io/@ohg6t5qv9/studio/nimwxrumwbm6vawsx917c39y | Use if the vanity URL 404s |
| **Sanity admin** | https://sanity.io/manage | Tokens, webhooks, datasets, billing |
| **Cloudflare dashboard** | https://dash.cloudflare.com | Builds, domains, environment variables |
| **Code** | https://github.com/kazialamin71/worldclub | `main` is the deployed branch |

---

## 2. Key identifiers

| Item | Value |
|---|---|
| Sanity project ID | `5r5zmje7` |
| Sanity project name | `worldclub` |
| Sanity dataset | `production` |
| Studio app ID | `nimwxrumwbm6vawsx917c39y` |
| Cloudflare Worker | `worldclub` |
| Deployed branch | `main` |

Secrets (API tokens, the Cloudflare deploy hook URL) are deliberately **not** recorded here.
They live in `sanity.io/manage` and the Cloudflare dashboard.

---

## 3. Everyday tasks

### Update a product photo or description
1. Open the Studio.
2. Pick the category → change the field / upload the photo.
3. **Publish**.
4. The site rebuilds itself and the change is live in about a minute.

Photos: landscape works best. No need to resize or compress — Sanity does that.
Leave a photo empty and the site renders a branded pattern instead; it never looks broken.

### Add a new product category
Create it in the Studio, give it a **slug** (e.g. `sauces-condiments` → `/products/sauces-condiments`)
and set its **Trading division**. Publish, and it appears automatically in the products page,
the footer, the sourcing map, the enquiry form dropdown and the sitemap. No code change needed.

### Add or change the product lines inside a category
Studio → the category → **Trade details** → **Product lines**. It is a tag field: type a line,
press Enter, drag to reorder, click the × to remove. The count on the category card, the
catalogue totals on the homepage and the products page all recalculate themselves.

### Add a new trading division
A division is just the text in the **Trading division** field — the products page builds its
sections from whatever divisions the published categories actually use, in sort-order.

- To put a category in an existing division, type that name **exactly** (`Food & Beverage`,
  `Electronics & Appliances`). A typo silently creates a section of one.
- To start a new division, type its name on the first category that belongs to it.
- With only one division in use, the section headings disappear and the page looks as it did
  before — so this costs nothing until you use it.

### Change the FDA / REX approval badges
These are the gold badges in the header, on the homepage and on the certifications page.
They live in `src/data/company.json` under `approvals` — `name`, `short`, `market`, `detail`,
and `highlight` (which controls whether the badge shows in the header). Add an entry there and
it appears in all three places. Code file, so: edit, commit, push.

### Change a phone number, email or address
These are still in code, not the CMS: `src/consts.ts`. Edit, commit, push — the site redeploys.

### Change a certificate
Certificates are also still in code: `src/content/certifications/*.md`, with the PDFs in
`public/certificates/`. See the main README for the full procedure.

---

## 4. Running it locally

```bash
# website  → http://localhost:4321
cd D:\worldclub
npm install          # first time only
npm run dev

# studio   → http://localhost:3333
cd D:\worldclub\studio
npm install          # first time only
npm run dev
```

Local content comes from Sanity at server start, so **restart the dev server** to pick up
newly published edits.

Other commands:

```bash
npm run build        # build to dist/
npm run preview      # serve the built site
npx astro check      # type-check
```

---

## 5. How deployment works

```
edit code    → git push origin main   → Cloudflare builds → live
edit content → Publish in Studio      → webhook → Cloudflare builds → live
```

Cloudflare build settings (Workers & Pages → `worldclub` → Settings):

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Root directory | `/` |
| Build variable | `SANITY_PROJECT_ID` = `5r5zmje7` |

⚠️ **The build variable is essential.** Without it the build silently falls back to the
markdown files in `src/content/products/`. The site still works and looks identical, so the
only symptom is that Studio edits never appear — which is very hard to diagnose later.

A failed build leaves the previous deployment live, so a broken push cannot take the site down.
Build logs: Cloudflare → `worldclub` → **Deployments** → pick a build.

### Redeploying the Studio
Only needed after changing files in `studio/` (e.g. adding a field):

```bash
cd D:\worldclub\studio
npm run deploy
```

---

## 6. Content architecture (why it is set up this way)

Product categories — including their trading division and their product lines — come from
Sanity; everything else (certifications, export approvals, clients, brands, company details)
still comes from files in the repo.

The site stays **fully static** — Sanity is read at build time, not by visitors' browsers, so
there is no runtime dependency on Sanity and no slowdown.

A custom loader (`src/loaders/sanityProducts.ts`) feeds Sanity data into Astro's content
collections, so every page still calls `getCollection('products')` and neither knows nor cares
where the data came from.

**Fallback:** if `SANITY_PROJECT_ID` is unset, the build uses `src/content/products/*.md`
instead. The site cannot break because of a CMS problem.

**Guard:** if Sanity is configured but returns zero products, the build **fails deliberately**.
Without that, an empty or misconfigured dataset would publish a site with every product page
silently missing.

---

## 7. Troubleshooting

**A published change hasn't appeared**
Check Cloudflare → Deployments for a new build. No build = the Sanity webhook didn't fire:
check sanity.io/manage → API → Webhooks, which logs every attempt and its response.
The most common cause is the HTTP method not being `POST`.

**The site loads for others but not for you**
Almost certainly your ISP's DNS caching an old "domain doesn't exist" answer, not a site
problem. Fix: set your DNS servers to `1.1.1.1` / `1.0.0.1`, or test on mobile data.

**Build fails with "Sanity returned no published products"**
Working as intended — it is refusing to publish an empty catalogue. Either content is
unpublished (still a draft in the Studio), or `SANITY_PROJECT_ID` points at the wrong project.

**`worldclub.sanity.studio` returns 404**
Use the direct Studio link in section 1 instead.

**Studio changes aren't showing locally**
Restart `npm run dev` — Sanity is only read at startup.

---

## 8. Outstanding

- [ ] **Contact form does not deliver mail.** `FORM_ACCESS_KEY` in `src/consts.ts` is still a
      placeholder. Get a free key from https://web3forms.com using the company inbox and paste
      it in. Until then, enquiries are lost.
- [ ] **Revoke the two Sanity API tokens** created on 25 Aug 2026 (sanity.io/manage → API →
      Tokens). They were exposed during setup and are no longer needed.
- [ ] **Confirm `www.arisa-worldclub.com`** is attached as a custom domain in Cloudflare.
- [ ] **Verify the publish → rebuild webhook** end to end by publishing a change and watching
      for a build.
- [ ] Move the contact address off Gmail to `info@arisa-worldclub.com`.
- [ ] **Confirm the HACCP certificate dates with QBM** — the printed certificate appears to
      have two labels transposed (see the comment in `src/content/certifications/haccp.md`).
- [ ] Add real client and brand logos (`public/images/clients/`, `public/images/brands/`).
- [ ] Submit the sitemap in Google Search Console (`/sitemap-index.xml`).
- [ ] Set up a Google Business Profile for the Dhaka office.
