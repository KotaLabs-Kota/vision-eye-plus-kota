import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { AUDIENCES, BUSINESS, CATEGORIES, COLORS, INSTAGRAM_DM_URL, PHOTO_SIZE, PRODUCTS, RIMS, SHAPES, featuredFrames, filterFrames, parseFilters, productHref, whatsappLink } from '../public/js/catalog.mjs';
import { contactMessage, formatPreferredDay, productMessage, todayInKota } from '../public/js/enquiries.mjs';
import { home } from '../src/home.mjs';
import { layout } from '../src/layout.mjs';
import { product, shop } from '../src/catalogue.mjs';
import { contact } from '../src/visit.mjs';
import { escapeHtml, frameCard } from '../public/js/components.mjs';

const ids = entries => entries.map(frame => frame.id);

test('catalogue entries have valid, distinct photos, slugs and collection metadata', async () => {
  assert.equal(PRODUCTS.length, 10);
  assert.equal(new Set(ids(PRODUCTS)).size, PRODUCTS.length);
  const assets = [];
  const hashes = new Set();
  for (const frame of PRODUCTS) {
    assert.match(frame.id, /^[a-z0-9-]+$/);
    assert.equal(CATEGORIES[frame.type], 'Eyeglasses');
    assert.ok(SHAPES[frame.shape] && RIMS[frame.rim] && COLORS[frame.color]);
    assert.ok(frame.audiences.length && frame.audiences.every(key => AUDIENCES[key]));
    assert.ok(frame.photos.length);
    assert.equal(productHref(frame.id), `/shop/${frame.id}/`);
    assert.ok(!Object.hasOwn(frame, 'price') && !Object.hasOwn(frame, 'availability'));
    for (const photo of frame.photos) {
      assert.equal(photo.src, `/images/catalog/${frame.id}-${photo.id}.webp`);
      assert.ok(photo.label && photo.alt);
      const image = await readFile(new URL(`../public${photo.src}`, import.meta.url));
      assert.equal(image.toString('ascii', 8, 12), 'WEBP', photo.src);
      hashes.add(createHash('sha256').update(image).digest('hex'));
      assets.push(photo.src.split('/').at(-1));
    }
  }
  assert.equal(assets.length, 15);
  assert.equal(hashes.size, assets.length);
  assert.deepEqual(assets.sort(), (await readdir(new URL('../public/images/catalog/', import.meta.url))).sort());
});

test('product links, galleries and enquiry actions are useful without JavaScript', () => {
  const { width, height } = PHOTO_SIZE;
  for (const frame of PRODUCTS) {
    const first = frame.photos[0];
    const html = product(frame);
    assert.ok(frameCard(frame).includes(`class="frame-link" href="${productHref(frame.id)}"`));
    assert.ok(frameCard(frame).includes(`<img src="${first.src}" width="${width}" height="${height}"`));
    assert.ok(html.includes(`<img src="${first.src}" width="${width}" height="${height}" alt="${escapeHtml(first.alt)}"`));
    assert.ok(html.includes(`href="${first.src}" data-product-image target="_blank" rel="noopener noreferrer"`));
    assert.ok(html.includes(`<span data-photo-caption aria-live="polite">${first.label}</span>`));
    assert.equal([...html.matchAll(/data-product-photo="/g)].length, frame.photos.length > 1 ? frame.photos.length : 0);
    if (frame.photos.length > 1) {
      assert.ok(html.includes(`data-product-photo="${first.id}" aria-current="true"`));
      for (const photo of frame.photos) assert.ok(html.includes(`href="${photo.src}" data-product-photo="${photo.id}"`));
    }
    const panel = html.match(/<section id="ask-about-frame"[\s\S]*?<\/section>/)?.[0];
    assert.ok(panel);
    assert.ok(panel.includes(`href="tel:${BUSINESS.phone}"`));
    assert.ok(panel.includes(`href="${INSTAGRAM_DM_URL}" target="_blank" rel="noopener noreferrer"`));
    const message = new URL(panel.match(/data-product-enquire href="([^"]+)"/)[1]);
    assert.equal(message.hostname, 'wa.me');
    assert.equal(message.pathname, `/${BUSINESS.whatsapp}`);
    assert.ok(message.searchParams.get('text').includes(frame.name));
    assert.ok(message.searchParams.get('text').includes(COLORS[frame.color].name));
    assert.doesNotMatch(html, /(?:₹|Rs\.?\s+|INR\s+)\d|priceCurrency|InStock|Buy now/i);
  }
});

test('catalogue filters combine choices and featured frames follow the collection', () => {
  assert.deepEqual(ids(filterFrames(PRODUCTS, { type: 'eyeglasses', rim: 'rimless', color: 'gold' })), ['champagne-rimless']);
  assert.deepEqual(ids(filterFrames(PRODUCTS, { q: ' midnight   SQUARE ' })), ['midnight-square']);
  assert.deepEqual(filterFrames(PRODUCTS, { color: 'red', shape: 'aviator' }), []);
  assert.equal(ids(filterFrames(PRODUCTS, { sort: 'name-asc' }))[0], 'bold-black-square');
  assert.equal(ids(filterFrames(PRODUCTS, { sort: 'name-desc' }))[0], 'studio-square');
  for (const audience of Object.keys(AUDIENCES)) {
    const frames = PRODUCTS.filter(frame => frame.audiences.includes(audience));
    assert.deepEqual(filterFrames(PRODUCTS, { q: audience }), frames);
    assert.deepEqual(featuredFrames(audience), frames.slice(0, 4));
  }
});

test('filter URLs ignore unknown values and constrain free text', () => {
  const state = parseFilters(new URLSearchParams('type=eyeglasses&color=constructor&shape=square&rim=bad&sort=name-desc&q=%20foil%20'));
  assert.deepEqual(state, { q: 'foil', type: 'eyeglasses', shape: 'square', color: '', rim: '', sort: 'name-desc' });
  assert.equal(parseFilters(new URLSearchParams({ q: 'q'.repeat(100), sort: 'bad' })).q.length, 80);
  assert.equal(parseFilters(new URLSearchParams('sort=bad')).sort, 'featured');
  assert.equal(parseFilters(new URLSearchParams('type=sunglasses')).type, '');
  assert.equal(escapeHtml('"<&>'), '&quot;&lt;&amp;&gt;');
});

test('appointment dates are based on Kota time and checked before formatting', () => {
  assert.equal(todayInKota(new Date('2026-11-18T20:05:00Z')), '2026-11-19');
  assert.equal(todayInKota(new Date('2026-11-18T17:05:00Z')), '2026-11-18');
  assert.equal(formatPreferredDay('2026-11-21'), '21 November 2026');
  assert.equal(formatPreferredDay('2026-02-31'), '');
});

test('enquiries preserve user selections in a prefilled message, without confirming an appointment', () => {
  const message = contactMessage({ name: '  Anu ', topic: 'eye-test', date: '2026-11-21', time: 'Morning', message: ' Please confirm. ' });
  const link = new URL(whatsappLink(message));
  assert.equal(link.hostname, 'wa.me');
  assert.equal(link.pathname, `/${BUSINESS.whatsapp}`);
  assert.match(link.searchParams.get('text'), /name is Anu\.[\s\S]*21 November 2026[\s\S]*Preferred time: Morning[\s\S]*Could you confirm/);
  assert.doesNotMatch(contactMessage({ name: 'Anu', topic: 'wholesale', date: '2026-11-21', time: 'Morning' }), /Preferred/);
  const frame = PRODUCTS[0];
  const text = productMessage(frame, { fit: 'Wide', lens: 'Progressive' }, 'https://example.test/shop/silver-aviator/');
  assert.match(text, /Silver Aviator[\s\S]*Colour shown: Silver[\s\S]*Wide[\s\S]*Progressive[\s\S]*shop\/silver-aviator\//);
  assert.doesNotMatch(productMessage(frame, { fit: 'Not sure', lens: 'Other' }), /preference/);
});

test('static templates expose working contact details and do not advertise live inventory', () => {
  assert.match(home(), /239 Google reviews/);
  assert.match(home(), /href="\/shop\/"/);
  assert.match(contact(), /Shop No. UG-05, Bagherwal Four Seasons/);
  assert.match(contact(), /tel:\+919929594560/);
  assert.match(shop(), /confirm current stock and pricing/i);
  assert.match(product(PRODUCTS[0]), /Ask us about stock, current pricing or ordering/i);
});

test('the shared header places the Instagram profile link immediately before Search', () => {
  const html = layout({ title: 'Vision Eye Plus', description: 'Storefront', page: 'home', content: '' });
  const instagram = html.match(/<a\b[^>]*href="https:\/\/www\.instagram\.com\/vision_eye_plus_kota\/"[^>]*>[\s\S]*?<\/a>\s*<button\b[^>]*aria-label="Search"/);
  assert.ok(instagram);
  assert.match(instagram[0], /target="_blank" rel="noopener noreferrer"/);
  assert.match(instagram[0], /icons\.svg#instagram/);
});

test('the shared footer credits KotaLabs and links to the studio website', () => {
  const html = layout({ title: 'Vision Eye Plus', description: 'Storefront', page: 'home', content: '' });
  const footer = html.match(/<footer\b[\s\S]*?<\/footer>/)?.[0] || '';
  assert.match(footer, /Designed &amp; engineered by[\s\S]*?<strong>KotaLabs<\/strong>/);
  assert.match(footer, /href="https:\/\/kotalabs\.in\/" target="_blank" rel="noopener noreferrer">Explore KotaLabs/);
  assert.match(footer, /Explore KotaLabs[\s\S]*?© \d{4} Vision Eye Plus, Kota\./);
});
