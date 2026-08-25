/**
 * One-time import of the markdown product categories in src/content/products/
 * into Sanity, so nothing has to be retyped by hand.
 *
 *   SANITY_PROJECT_ID=xxx SANITY_WRITE_TOKEN=yyy node scripts/migrate-products-to-sanity.mjs
 *
 * Safe to re-run: documents are keyed by slug, so a second run updates rather than duplicates.
 * Pass --dry to preview without writing anything.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { createClient } from '@sanity/client';

const DIR = 'src/content/products';
const dryRun = process.argv.includes('--dry');

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
      storage: data.storage,
      items: data.items ?? [],
      origins: data.origins ?? [],
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      body: toPortableText(content),
    };
  });

console.log(`Found ${docs.length} categories in ${DIR}:`);
for (const d of docs) {
  console.log(`  ${d.slug.current.padEnd(22)} ${d.items.length} lines, ${d.body.length} paragraphs`);
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
