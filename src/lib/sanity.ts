import { createClient, type SanityClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

const env = (key: string): string | undefined =>
  (import.meta.env?.[key] as string | undefined) ?? process.env[key] ?? undefined;

export const SANITY_PROJECT_ID = env('SANITY_PROJECT_ID');
export const SANITY_DATASET = env('SANITY_DATASET') ?? 'production';
export const SANITY_API_VERSION = env('SANITY_API_VERSION') ?? '2024-10-01';

/** True once a project id is present — until then the site builds from local markdown. */
export const sanityEnabled = Boolean(SANITY_PROJECT_ID);

export const sanityClient: SanityClient | null = sanityEnabled
  ? createClient({
      projectId: SANITY_PROJECT_ID!,
      dataset: SANITY_DATASET,
      apiVersion: SANITY_API_VERSION,
      // Bypass the CDN so a fresh build always sees just-published edits.
      useCdn: false,
      token: env('SANITY_READ_TOKEN'),
    })
  : null;

const builder = sanityClient ? createImageUrlBuilder(sanityClient) : null;

/** Turn a Sanity image reference into a sized, optimised CDN URL. */
export function imageUrl(source: unknown, width = 1600, height = 900): string | undefined {
  if (!builder || !source) return undefined;
  return builder.image(source as never).width(width).height(height).fit('crop').auto('format').url();
}
