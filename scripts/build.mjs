import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PRODUCTS, productImage } from '../public/js/catalog.mjs';
import { layout } from '../src/layout.mjs';
import { home } from '../src/home.mjs';
import { product, shop } from '../src/catalogue.mjs';
import { about, contact, eyeTests, notFound } from '../src/visit.mjs';

const source = fileURLToPath(new URL('../public/', import.meta.url));
const dest = fileURLToPath(new URL('../dist/', import.meta.url));
const pages = [
  { file: 'index.html', page: 'home', active: 'home', title: 'Vision Eye Plus Kota | Eyewear & In-store Eye Tests', description: 'Discover eyeglasses, sunglasses, and in-store eye tests at Vision Eye Plus, opposite City Mall on Jhalawar Road in Kota.', content: home(), image: '/images/campaign.webp', preload: true },
  { file: 'shop/index.html', page: 'shop', title: 'Eyeglasses & Sunglasses Collection | Vision Eye Plus Kota', description: 'Browse frame styles, filter by shape, material and colour, and save ideas for your next visit to Vision Eye Plus in Kota.', content: shop(), image: '/images/category-optical.webp' },
  ...PRODUCTS.map(frame => ({ file: `shop/${frame.id}/index.html`, page: 'product', active: frame.type, title: `${frame.name} Frame Preview | Vision Eye Plus Kota`, description: frame.description, content: product(frame), image: productImage(frame.id) })),
  { file: 'eye-tests/index.html', page: 'eye-tests', active: 'eye-tests', title: 'In-store Eye Tests in Kota | Vision Eye Plus', description: 'Find out what to bring to a routine vision test and request an appointment at Vision Eye Plus near City Mall, Kota.', content: eyeTests(), image: '/images/eye-care.webp' },
  { file: 'about/index.html', page: 'about', title: 'About Our Kota Optical Shop | Vision Eye Plus', description: 'Meet Vision Eye Plus, an optician and optical wholesaler at Bagherwal Four Seasons on Jhalawar Road, Kota.', content: about(), image: '/images/kota-store.webp' },
  { file: 'contact/index.html', page: 'contact', active: 'contact', title: 'Visit, Call & Hours | Vision Eye Plus Kota', description: 'Get directions, opening hours, the store phone number, and WhatsApp enquiries for Vision Eye Plus opposite City Mall, Kota.', content: contact() },
  { file: '404.html', page: 'not-found', title: 'Page not found | Vision Eye Plus Kota', description: 'Find the frame collection or contact Vision Eye Plus in Kota.', content: notFound() },
];

await rm(dest, { recursive: true, force: true });
await cp(source, dest, { recursive: true });
await Promise.all(pages.map(async ({ file, ...data }) => {
  const path = join(dest, file);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, layout(data));
}));
console.log(`Built ${pages.length} static pages in dist/`);
