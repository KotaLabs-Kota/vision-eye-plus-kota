import { fileURLToPath } from 'node:url';
import { buildSite } from '../src/site.mjs';

const dest = fileURLToPath(new URL('../dist/', import.meta.url));
const { origin, count, indexableCount } = await buildSite(dest);
console.log(`Built ${count} static pages in dist/`);
console.log(origin
  ? `SEO: ${indexableCount} indexable pages and sitemap for ${origin}`
  : 'SEO: non-indexable build. Set SITE_URL on a production build to generate canonical URLs and the sitemap.');
