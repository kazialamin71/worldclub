import { defineField, defineType } from 'sanity';

/** Icon keys the website can render — see src/components/Icon.astro. */
const ICONS = [
  'fruit', 'leaf', 'fish', 'meat', 'milk', 'icecream',
  'droplet', 'spice', 'nut', 'bottle', 'bread', 'chip',
  'ship', 'globe', 'snow', 'truck', 'warehouse',
];

/** Trading divisions. These are the ones the site groups by today — but the field is a
    free-text string, so typing a new division name here creates a new section on
    /products by itself, with no code change. */
const DIVISIONS = ['Food & Beverage', 'Electronics & Appliances'];

export const product = defineType({
  name: 'product',
  title: 'Product category',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'trade', title: 'Trade details' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      group: 'content',
      description: 'The web address for this category, e.g. "fresh-fruits" → /products/fresh-fruits',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      group: 'content',
      description: 'Short line shown above the title on cards.',
      validation: (rule) => rule.required().max(90),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'One or two sentences used on cards, search results and social shares.',
      validation: (rule) => rule.required().max(320),
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      group: 'content',
      description:
        'Optional. Landscape works best. Leave empty and the site renders a branded pattern instead — it never looks broken.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'body',
      title: 'Description',
      type: 'array',
      group: 'content',
      of: [{ type: 'block' }],
      description: 'Two or three paragraphs shown on the category page.',
    }),
    defineField({
      name: 'division',
      title: 'Trading division',
      type: 'string',
      group: 'trade',
      description: `Groups this category into a section on the products page. In use today: ${DIVISIONS.join(
        ', ',
      )}. Type an exactly matching name to join a section, or a new name to start one.`,
      initialValue: 'Food & Beverage',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Product lines',
      type: 'array',
      group: 'trade',
      of: [{ type: 'string' }],
      description: 'The individual products listed under this category.',
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'origins',
      title: 'Sourcing origins',
      type: 'array',
      group: 'trade',
      of: [{ type: 'string' }],
      description: 'Countries this category is principally sourced from. Feeds the sourcing map.',
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'storage',
      title: 'Storage regime',
      type: 'string',
      group: 'trade',
      description: 'Shown as a chip on the photo, e.g. "Chilled 2–8°C".',
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      group: 'trade',
      description: 'Used when no photo is set.',
      initialValue: 'leaf',
      options: { list: ICONS.map((v) => ({ title: v, value: v })) },
    }),
    defineField({
      name: 'order',
      title: 'Sort order',
      type: 'number',
      group: 'trade',
      description: 'Lower numbers appear first.',
      initialValue: 99,
    }),
    defineField({
      name: 'featured',
      title: 'Show on homepage',
      type: 'boolean',
      group: 'trade',
      initialValue: false,
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO title',
      type: 'string',
      group: 'seo',
      description: 'Optional override for the browser tab and search results.',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO description',
      type: 'text',
      rows: 2,
      group: 'seo',
      description: 'Optional override for the search-result snippet.',
    }),
  ],
  orderings: [
    {
      title: 'Display order',
      name: 'displayOrder',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'tagline', media: 'image' },
  },
});
