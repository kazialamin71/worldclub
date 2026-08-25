import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { sanityEnabled } from '~/lib/sanity';
import { sanityProductsLoader } from '~/loaders/sanityProducts';

/* Product categories.
   With SANITY_PROJECT_ID set, these come from Sanity and are edited in the Studio.
   Without it, the site falls back to the markdown files in src/content/products/,
   where the file name becomes the URL slug. Either way the shape below is identical,
   so pages never need to know which source is in use. */
const products = defineCollection({
  loader: sanityEnabled
    ? sanityProductsLoader()
    : glob({ base: './src/content/products', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    order: z.number().default(99),
    tagline: z.string(),
    summary: z.string(),
    /** Icon key — see src/components/Icon.astro for the available set. */
    icon: z.string().default('leaf'),
    /** Optional hero photo, e.g. "/images/products/fruits.jpg". Falls back to
        a generated pattern when empty, so the page never looks broken. */
    image: z.string().optional(),
    /** The individual SKUs/varieties listed under the category. */
    items: z.array(z.string()).default([]),
    /** Countries this category is principally sourced from. */
    origins: z.array(z.string()).default([]),
    /** Storage regime shown as a spec chip. */
    storage: z.string().optional(),
    /** Optional SEO overrides. */
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

/* Certifications & memberships. */
const certifications = defineCollection({
  loader: glob({ base: './src/content/certifications', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    order: z.number().default(99),
    standard: z.string(),
    issuer: z.string(),
    certificateNo: z.string().optional(),
    issued: z.string().optional(),
    expires: z.string().optional(),
    surveillance: z.array(z.string()).default([]),
    verifyUrl: z.string().optional(),
    /** PDF in /public/certificates/ */
    file: z.string().optional(),
    /** Preview image in /public/certificates/thumbs/ */
    thumb: z.string().optional(),
    scope: z.string().optional(),
    accent: z.enum(['brand', 'gold', 'ink']).default('brand'),
  }),
});

export const collections = { products, certifications };
