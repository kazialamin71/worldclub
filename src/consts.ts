/* ------------------------------------------------------------------
   Site-wide constants.
   These are the values you are most likely to change. Nothing else
   in the codebase hard-codes a phone number, e-mail or domain.
------------------------------------------------------------------ */

export const SITE = {
  name: 'World Club',
  legalName: 'World Club',
  tagline: 'Importer, Exporter & Distributor of world-class brands to Bangladesh',
  description:
    'World Club imports, exports and distributes premium fruits, vegetables, dairy, frozen fish, meat, edible oils, spices, bakery and beverages across Bangladesh, plus a separate electronics and appliances division — FDA and REX approved, ISO 9001, ISO 22000 and HACCP certified, serving supershops, 5-star hotels, CSD stores and 500+ wholesalers.',
  url: 'https://arisa-worldclub.com',
  locale: 'en_US',
  founded: '2021',
} as const;

export const CONTACT = {
  /* ⚠️ Recommended: move off gmail to a domain address (e.g. info@arisa-worldclub.com)
     before launch — it materially improves B2B trust and e-mail deliverability. */
  email: 'faridzaman1976@gmail.com',
  phonePrimary: '+880 1720 556768',
  phoneSecondary: '+880 1975 140811',
  /* Digits only, international format — used for tel: and WhatsApp links. */
  phonePrimaryRaw: '8801720556768',
  whatsapp: '8801720556768',
} as const;

/* Web3Forms — free, no backend needed for a static site.
   Enquiries are delivered to the inbox registered at https://web3forms.com.
   This is Web3Forms' public access key: it is designed to ship in the page HTML and
   carries no account access, so it belongs in the repo rather than in .env.
   To point the form at a different inbox, register that address and swap the key. */
export const FORM_ACCESS_KEY = '03cf694e-653c-4d3f-a7e1-c2d468baa64b';

export const NAV: { label: string; href: string }[] = [
  { label: 'About', href: '/about' },
  { label: 'Products', href: '/products' },
  { label: 'Sourcing', href: '/sourcing' },
  { label: 'Certifications', href: '/certifications' },
  { label: 'Clients', href: '/clients' },
  { label: 'Contact', href: '/contact' },
];
