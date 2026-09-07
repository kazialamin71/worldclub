/**
 * Import the markdown product categories in src/content/products/ into Sanity,
 * so nothing has to be retyped by hand.
 *
 *   SANITY_PROJECT_ID=xxx SANITY_WRITE_TOKEN=yyy node scripts/migrate-products-to-sanity.mjs
 *
 * Documents are keyed by slug, so a re-run updates rather than duplicates — but it
 * *replaces* the document, which discards anything added in the Studio and not present in
 * the markdown, photos above all. So when you are pushing new categories into a Studio
 * that is already in use, name them:
 *
 *   node scripts/migrate-products-to-sanity.mjs --only=bakery-items,drinks-beverages
 *
 * Pass --dry to preview without writing anything.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { createClient } from '@sanity/client';

const DIR = 'src/content/products';
const dryRun = process.argv.includes('--dry');

/** --only=slug-a,slug-b restricts the push to those categories. */
const onlyArg = process.argv.find((a) => a.startsWith('--only='));
const only = onlyArg
  ? onlyArg.slice('--only='.length).split(',').map((s) => s.trim()).filter(Boolean)
  : null;

const projectId = process.env.SANITY_PROJECT_ID;
const token = process.env.SANITY_WRITE_TOKEN;
const dataset = process.env.SANITY_DATASET ?? 'production';

if (!projectId || (!token && !dryRun)) {
  console.error(
    'Missing credentials.\n' +
      '  SANITY_PROJECT_ID   — from sanity.io/manage\n' +
      '  SANITY_WRITE_TOKEN  — an Editor token from the same page (not needed with --dry)',
  );
  process.exit(1);
}

/** Match the typographic substitutions Astro's markdown renderer applies, so the
    imported text is character-for-character what the site published before. */
function smartQuotes(text) {
  return text.replace(/'/g, '’');
}

/** Split one paragraph into spans, turning **bold** into a `strong` mark. */
function toSpans(paragraph, blockIndex) {
  const spans = [];

  paragraph.split(/(\*\*[\s\S]+?\*\*)/g).forEach((part) => {
    if (!part) return;
    const bold = /^\*\*([\s\S]+)\*\*$/.exec(part);
    spans.push({
      _type: 'span',
      _key: `b${blockIndex}s${spans.length}`,
      text: smartQuotes(bold ? bold[1] : part),
      marks: bold ? ['strong'] : [],
    });
  });

  return spans;
}

/** Markdown paragraphs → Portable Text blocks. */
function toPortableText(markdown) {
  return markdown
    .replace(/\r\n/g, '\n')
    .trim()
    .split(/\n{2,}/)
    .filter(Boolean)
    .map((paragraph, i) => ({
      _type: 'block',
      _key: `block${i}`,
      style: 'normal',
      markDefs: [],
      // Unwrap the hard line breaks the source files use for readability.
      children: toSpans(paragraph.replace(/\s*\n\s*/g, ' ').trim(), i),
    }));
}

const docs = readdirSync(DIR)
  .filter((f) => f.endsWith('.md'))
  .filter((f) => !only || only.includes(f.replace(/\.md$/, '')))
  .map((file) => {
    const slug = file.replace(/\.md$/, '');
    const { data, content } = matter(readFileSync(join(DIR, file), 'utf8'));

    return {
      _id: `product-${slug}`,
      _type: 'product',
      title: data.title,
      slug: { _type: 'slug', current: slug },
      tagline: data.tagline,
      summary: data.summary,
      order: data.order ?? 99,
      featured: data.featured ?? false,
      icon: data.icon ?? 'leaf',
      division: data.division ?? 'Food & Beverage',
      storage: data.storage,
      items: data.items ?? [],
      origins: data.origins ?? [],
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      body: toPortableText(content),
    };
  });

if (only) {
  const missing = only.filter((slug) => !docs.some((d) => d.slug.current === slug));
  if (missing.length) {
    console.error(`No markdown file in ${DIR} for: ${missing.join(', ')}`);
    process.exit(1);
  }
} else {
  console.log(
    'Pushing every category. This replaces the existing Sanity documents, discarding\n' +
      'photos and any other Studio-only edits. Use --only=slug-a,slug-b to push just the new ones.\n',
  );
}

console.log(`Found ${docs.length} categories in ${DIR}:`);
for (const d of docs) {
  console.log(
    `  ${d.slug.current.padEnd(22)} ${String(d.items.length).padStart(2)} lines, ` +
      `${d.body.length} paragraphs, ${d.division}`,
  );
}

if (dryRun) {
  console.log('\n--dry given, nothing written.');
  process.exit(0);
}

const client = createClient({ projectId, dataset, apiVersion: '2024-10-01', token, useCdn: false });

// Photos are NOT migrated — there are none in the markdown yet. Add them in the Studio.
const tx = docs.reduce((t, doc) => t.createOrReplace(doc), client.transaction());

await tx.commit();
console.log(`\nImported ${docs.length} categories into ${projectId}/${dataset}.`);
console.log('Open the Studio to review them, then add photos.');
