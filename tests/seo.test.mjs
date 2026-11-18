import { test } from 'node:test';
import assert from 'node:assert/strict';
import { access, mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { BUSINESS, INSTAGRAM_URL, PRODUCTS, productHref } from '../public/js/catalog.mjs';
import { resolveSiteOrigin } from '../src/seo.mjs';
import { buildSite } from '../src/site.mjs';

const origin = 'https://www.vision.example.test';
const landingRoutes = ['/', '/shop/', '/shop/eyeglasses/', '/shop/sunglasses/', '/eye-tests/', '/about/', '/contact/'];
const excludedRoutes = [...PRODUCTS.map(frame => productHref(frame.id)), '/404.html'];
const allRoutes = [...landingRoutes, ...excludedRoutes];
const outputFile = route => route.endsWith('/') ? `${route.slice(1)}index.html` : route.slice(1);
const htmlFor = (dir, route) => readFile(join(dir, outputFile(route)), 'utf8');
const graphFor = html => JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])['@graph'];

async function tempBuild(t) {
  const dir = await mkdtemp(join(tmpdir(), 'vision-seo-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  return dir;
}

test('SITE_URL is an HTTPS origin and Vercel never supplies a fallback hostname', () => {
  assert.equal(resolveSiteOrigin({ SITE_URL: ' https://WWW.vision.example.test/ ' }), origin);
  assert.equal(resolveSiteOrigin({ VERCEL_ENV: 'production', VERCEL_URL: 'a-deployment.vercel.app', VERCEL_PROJECT_PRODUCTION_URL: 'a-production.vercel.app' }), null);
  for (const vercelEnv of [{ VERCEL_ENV: 'preview' }, { VERCEL_ENV: 'development' }, { VERCEL_ENV: 'production', VERCEL_TARGET_ENV: 'staging' }]) {
    assert.equal(resolveSiteOrigin({ ...vercelEnv, SITE_URL: origin }), null);
  }
  for (const url of ['vision.example.test', 'http://vision.example.test', 'https://localhost', 'https://127.0.0.1', `${origin}:443`, `${origin}/shop/`, `${origin}/x/..`, `${origin}?`, `${origin}/#home`, 'https://name:password@vision.example.test']) {
    assert.throws(() => resolveSiteOrigin({ SITE_URL: url }), /SITE_URL must be an HTTPS domain origin/);
  }
});

test('production sitemap, robots, canonicals and social tags match the landing pages', async t => {
  const dir = await tempBuild(t);
  assert.deepEqual(await buildSite(dir, { SITE_URL: `${origin}/`, VERCEL_ENV: 'production', VERCEL_TARGET_ENV: 'production' }), {
    origin, count: allRoutes.length, indexableCount: landingRoutes.length,
  });
  const robots = await readFile(join(dir, 'robots.txt'), 'utf8');
  assert.equal(robots, `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`);
  const sitemap = await readFile(join(dir, 'sitemap.xml'), 'utf8');
  assert.match(sitemap, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
  assert.deepEqual([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url), landingRoutes.map(route => `${origin}${route}`));
  assert.deepEqual((await readdir(dir, { recursive: true })).filter(file => file.endsWith('.html')).sort(), allRoutes.map(outputFile).sort());
  const titles = new Set();
  const descriptions = new Set();
  for (const [index, route] of allRoutes.entries()) {
    const html = await htmlFor(dir, route);
    titles.add(html.match(/<title>([^<]+)<\/title>/)[1]);
    descriptions.add(html.match(/<meta name="description" content="([^"]+)">/)[1]);
    assert.equal([...html.matchAll(/<h1\b/g)].length, 1, route);
    assert.doesNotMatch(html, /name="keywords"|aggregateRating|"@type":"Product"/);
    if (index < landingRoutes.length) {
      assert.match(html, /<meta name="robots" content="index, follow, max-image-preview:large">/);
      assert.deepEqual([...html.matchAll(/<link rel="canonical" href="([^"]+)">/g)].map(([, url]) => url), [`${origin}${route}`]);
      assert.ok(html.includes(`<meta property="og:url" content="${origin}${route}">`));
      assert.ok(html.includes(`<meta property="og:image" content="${origin}/images/vision-eye-plus-share.jpg">`));
    } else {
      assert.match(html, /<meta name="robots" content="noindex, follow">/);
      assert.doesNotMatch(html, /rel="canonical"|type="application\/ld\+json"/);
    }
  }
  assert.equal(titles.size, allRoutes.length);
  assert.equal(descriptions.size, allRoutes.length);
  await access(join(dir, 'images/vision-eye-plus-share.jpg'));
});

test('published structured data describes the real shop, eye tests and breadcrumb trails', async t => {
  const dir = await tempBuild(t);
  await buildSite(dir, { SITE_URL: origin });
  const home = await htmlFor(dir, '/');
  const homeGraph = graphFor(home);
  const business = homeGraph.find(node => node['@type'] === 'Optician');
  const site = homeGraph.find(node => node['@type'] === 'WebSite');
  assert.equal(site.url, `${origin}/`);
  assert.equal(site.name, BUSINESS.name);
  assert.deepEqual(site.publisher, { '@id': `${origin}/#optician` });
  assert.equal(business['@id'], site.publisher['@id']);
  assert.equal(business.url, `${origin}/contact/`);
  assert.equal(business.telephone, BUSINESS.phone);
  assert.equal(business.address.addressLocality, 'Kota');
  assert.equal(business.address.postalCode, '324005');
  assert.match(business.address.streetAddress, /UG-05, Bagherwal Four Seasons, Opposite City Mall, Jhalawar Road/);
  assert.equal(business.geo.latitude, BUSINESS.latitude);
  assert.equal(business.geo.longitude, BUSINESS.longitude);
  assert.equal(business.openingHoursSpecification.opens, '10:00:00');
  assert.equal(business.openingHoursSpecification.closes, '21:00:00');
  assert.equal(new Set(business.openingHoursSpecification.dayOfWeek).size, 7);
  assert.deepEqual(business.sameAs, [BUSINESS.maps, INSTAGRAM_URL]);
  const contact = await htmlFor(dir, '/contact/');
  assert.ok(contact.includes(`href="tel:${business.telephone}"`));
  assert.ok(contact.includes(BUSINESS.hours));
  assert.deepEqual(graphFor(contact).find(node => node['@type'] === 'Optician'), business);
  const care = graphFor(await htmlFor(dir, '/eye-tests/'));
  assert.deepEqual(care.find(node => node['@type'] === 'Service').provider, { '@id': business['@id'] });
  assert.deepEqual(care.find(node => node['@type'] === 'Optician'), business);
  const glasses = await htmlFor(dir, '/shop/eyeglasses/');
  const trail = graphFor(glasses).find(node => node['@type'] === 'BreadcrumbList');
  assert.deepEqual(trail.itemListElement.map(({ position, name, item }) => [position, name, item]), [
    [1, 'Home', `${origin}/`], [2, 'Collection', `${origin}/shop/`], [3, 'Eyeglasses', `${origin}/shop/eyeglasses/`],
  ]);
});

test('category pages and their frame links do not depend on JavaScript', async t => {
  const dir = await tempBuild(t);
  await buildSite(dir, {});
  const home = await htmlFor(dir, '/');
  for (const type of ['eyeglasses', 'sunglasses']) {
    assert.ok(home.includes(`<a class="category-card" href="/shop/${type}/">`));
    const html = await htmlFor(dir, `/shop/${type}/`);
    assert.match(html, new RegExp(`<h1[^>]*>${type} in Kota`, 'i'));
    assert.ok(html.includes(`<a class="nav-link" href="/shop/${type}/" aria-current="page">`));
    assert.ok(html.includes(`href="/shop/?type=${type}"`));
    for (const frame of PRODUCTS) {
      assert.equal(html.includes(`class="frame-link" href="${productHref(frame.id)}"`), frame.type === type);
    }
  }
});

test('preview and unconfigured builds do not expose stale production indexing metadata', async t => {
  const dir = await tempBuild(t);
  await buildSite(dir, { SITE_URL: origin });
  await access(join(dir, 'sitemap.xml'));
  for (const env of [{ SITE_URL: origin, VERCEL_ENV: 'preview' }, { VERCEL_ENV: 'production', VERCEL_URL: 'demo.vercel.app' }]) {
    const info = await buildSite(dir, env);
    assert.equal(info.indexableCount, 0);
    assert.equal(info.origin, null);
    await assert.rejects(access(join(dir, 'sitemap.xml')), { code: 'ENOENT' });
    assert.equal(await readFile(join(dir, 'robots.txt'), 'utf8'), 'User-agent: *\nAllow: /\n');
    for (const route of allRoutes) {
      const html = await htmlFor(dir, route);
      assert.match(html, /<meta name="robots" content="noindex, follow">/);
      assert.doesNotMatch(html, /rel="canonical"|application\/ld\+json|og:url|og:image|vercel\.app|vision\.example\.test/);
    }
  }
});
