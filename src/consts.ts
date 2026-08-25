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
    'World Club imports, exports and distributes premium fruits, vegetables, dairy, frozen fish, meat, edible oils, spices and herbs across Bangladesh — ISO 9001, ISO 22000 and HACCP certified, serving supershops, 5-star hotels, CSD stores and 500+ wholesalers.',
  url: 'https://www.arisa-worldclub.com',
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
   1. Go to https://web3forms.com, enter the company inbox, get an access key.
   2. Paste the key below. That is the entire setup. */
export const FORM_ACCESS_KEY = 'REPLACE_WITH_YOUR_WEB3FORMS_ACCESS_KEY';

export const NAV: { label: string; href: string }[] = [
  { label: 'About', href: '/about' },
  { label: 'Products', href: '/products' },
  { label: 'Sourcing', href: '/sourcing' },
  { label: 'Certifications', href: '/certifications' },
  { label: 'Clients', href: '/clients' },
  { label: 'Contact', href: '/contact' },
];
