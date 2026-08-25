import type { Loader } from 'astro/loaders';
import { toHTML } from '@portabletext/to-html';
import { sanityClient, imageUrl } from '~/lib/sanity';

const QUERY = `*[_type == "product" && !(_id in path("drafts.**"))]{
  "slug": slug.current,
  title, order, featured, icon, tagline, summary, storage,
  origins, items, image, seoTitle, seoDescription, body
}`;

/** GROQ returns `null` for fields that were never filled in; Zod's `.optional()`
    expects `undefined`. Drop the empty keys so schema defaults apply instead. */
function omitNullish<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== null && value !== undefined),
  ) as Partial<T>;
}

interface SanityProduct {
  slug?: string;
  title?: string;
  order?: number;
  featured?: boolean;
  icon?: string;
  tagline?: string;
  summary?: string;
  storage?: string;
  origins?: string[];
  items?: string[];
  image?: unknown;
  seoTitle?: string;
  seoDescription?: string;
  body?: unknown;
}

/**
 * Pulls product categories from Sanity at build time and shapes them to match the
 * frontmatter the markdown files used, so every page keeps calling getCollection('products')
 * unchanged.
 */
export function sanityProductsLoader(): Loader {
  return {
    name: 'sanity-products',
    load: async ({ store, parseData, logger }) => {
      if (!sanityClient) {
        logger.warn('Sanity is not configured — skipping.');
        return;
      }

      const docs = await sanityClient.fetch<SanityProduct[]>(QUERY);

      /* Refuse to build an empty catalogue. Without this the site still builds "successfully"
         but every product page silently disappears — which, on a deploy triggered by a Sanity
         webhook, would publish a gutted site with no error anywhere. */
      if (docs.length === 0) {
        throw new Error(
          'Sanity returned no published products, which would drop every product page from the site.\n' +
            '  • First time setting this up? Import the markdown content:\n' +
            '      node scripts/migrate-products-to-sanity.mjs\n' +
            '  • Content still in drafts? Publish it in the Studio.\n' +
            '  • Not ready to use Sanity yet? Remove SANITY_PROJECT_ID from .env to build\n' +
            '    from src/content/products/ instead.',
        );
      }

      logger.info(`Loaded ${docs.length} product categories from Sanity.`);

      store.clear();

      for (const doc of docs) {
        if (!doc.slug) {
          logger.warn(`Skipping "${doc.title ?? 'untitled'}" — it has no slug.`);
          continue;
        }

        const data = await parseData({
          id: doc.slug,
          data: omitNullish({
            title: doc.title,
            order: doc.order,
            featured: doc.featured,
            icon: doc.icon,
            tagline: doc.tagline,
            summary: doc.summary,
            storage: doc.storage,
            origins: doc.origins ?? [],
            items: doc.items ?? [],
            image: imageUrl(doc.image),
            seoTitle: doc.seoTitle,
            seoDescription: doc.seoDescription,
          }),
        });

        store.set({
          id: doc.slug,
          data,
          rendered: { html: doc.body ? toHTML(doc.body as never) : '' },
        });
      }
    },
  };
}
