import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  },
  /* The hosted Studio lives at https://worldclub.sanity.studio
     Set here so `sanity deploy` doesn't prompt for a hostname. */
  studioHost: 'worldclub',
  deployment: {
    appId: 'nimwxrumwbm6vawsx917c39y',
  },
});
