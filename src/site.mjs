import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PHOTO_SIZE, PRODUCTS, categoryHref, collectionHref, productHref } from '../public/js/catalog.mjs';
import { aboutTrail, audienceTrail, categoryTrail, contactTrail, eyeTestsTrail, shopTrail } from './breadcrumbs.mjs';
import { audiencePages, categoryPages, collection } from './categories.mjs';
import { product, shop } from './catalogue.mjs';
import { home } from './home.mjs';
import { layout } from './layout.mjs';
import { resolveSiteOrigin, robotsTxt, sitemapXml } from './seo.mjs';
import { about, contact, eyeTests, notFound } from './visit.mjs';

const source = fileURLToPath(new URL('../public/', import.meta.url));

const pages = [
  {
    route: '/', page: 'home', indexable: true, preload: true, render: home,
    title: 'Optical Shop in Kota | Vision Eye Plus',
    description: 'Visit Vision Eye Plus opposite City Mall on Jhalawar Road, Kota. Try on eyeglasses and sunglasses or ask about an in-store eye test.',
  },
  {
    route: '/shop/', page: 'shop', indexable: true, trail: shopTrail, render: shop,
    title: 'Browse Eyeglasses & Sunglasses | Vision Eye Plus Kota',
    description: 'Browse frame photos by shape, rim style and colour at Vision Eye Plus in Kota. Open a frame to ask about availability, fitting or ordering.',
  },
  ...Object.entries(categoryPages).map(([type, category]) => ({
    route: categoryHref(type), page: 'category', indexable: true, trail: categoryTrail(type),
    title: category.title, description: category.description, render: () => collection(type),
  })),
  ...Object.entries(audiencePages).map(([audience, edit]) => ({
    route: collectionHref(audience), page: 'category', indexable: false, trail: audienceTrail(audience),
    title: edit.title, description: edit.description, render: () => collection('eyeglasses', audience),
  })),
  {
    route: '/eye-tests/', page: 'eye-tests', indexable: true, trail: eyeTestsTrail, render: eyeTests,
    title: 'Eye Tests in Kota | Vision Eye Plus',
    description: 'Ask about an in-store eye test at Vision Eye Plus near City Mall, Kota. Learn what to bring and how to request a time with the shop.',
  },
  {
    route: '/about/', page: 'about', indexable: true, trail: aboutTrail, render: about,
    title: 'About Vision Eye Plus | Optician in Kota',
    description: 'Meet Vision Eye Plus, an optician and optical wholesaler at Bagherwal Four Seasons on Jhalawar Road, Kota. Ask about frames, lenses and wholesale enquiries.',
  },
  {
    route: '/contact/', page: 'contact', indexable: true, trail: contactTrail, render: contact,
    title: 'Vision Eye Plus Kota: Address, Hours & Directions',
    description: 'Find Vision Eye Plus at Shop UG-05, Bagherwal Four Seasons, opposite City Mall, Kota. See opening hours, directions and the shop’s phone number.',
  },
  ...PRODUCTS.map(frame => ({
    route: productHref(frame.id), page: 'product', indexable: false,
    title: `${frame.name} | Vision Eye Plus Kota`, description: frame.description, render: () => product(frame),
    socialImage: { path: frame.photos[0].src, ...PHOTO_SIZE, alt: frame.photos[0].alt },
  })),
  {
    route: '/404.html', page: 'not-found', indexable: false, render: notFound,
    title: 'Page not found | Vision Eye Plus Kota', description: 'Find the frame collection or contact Vision Eye Plus in Kota.',
  },
];

export async function buildSite(dest, env = process.env) {
  const origin = resolveSiteOrigin(env);
  await rm(dest, { recursive: true, force: true });
  await cp(source, dest, { recursive: true });
  await Promise.all(pages.map(async ({ render, ...page }) => {
    const file = page.route.endsWith('/') ? `${page.route}index.html` : page.route;
    const path = join(dest, file.slice(1));
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, layout({ ...page, origin, content: render() }));
  }));
  await writeFile(join(dest, 'robots.txt'), robotsTxt(origin));
  if (origin) await writeFile(join(dest, 'sitemap.xml'), sitemapXml(origin, pages));
  return { origin, count: pages.length, indexableCount: origin ? pages.filter(page => page.indexable).length : 0 };
}
