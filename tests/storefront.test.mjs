import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { access, readFile } from 'node:fs/promises';
import { BUSINESS, PRODUCTS, CATEGORIES, SHAPES, MATERIALS, COLORS, filterFrames, parseFilters, productHref, productImage, productPreview, whatsappLink } from '../public/js/catalog.mjs';
import { contactMessage, formatPreferredDay, productMessage, todayInKota } from '../public/js/enquiries.mjs';
import { home } from '../src/home.mjs';
import { layout } from '../src/layout.mjs';
import { product, shop } from '../src/catalogue.mjs';
import { contact } from '../src/visit.mjs';
import { escapeHtml } from '../public/js/components.mjs';

const ids = entries => entries.map(frame => frame.id);

test('the catalogue has unique slugs and valid style metadata and image assets', async () => {
  assert.equal(PRODUCTS.length, 6);
  assert.equal(new Set(ids(PRODUCTS)).size, PRODUCTS.length);
  for (const frame of PRODUCTS) {
    assert.match(frame.id, /^[a-z0-9-]+$/);
    assert.ok(CATEGORIES[frame.type] && SHAPES[frame.shape] && MATERIALS[frame.material]);
    assert.ok(frame.colors.length && frame.colors.every(key => COLORS[key]));
    assert.equal(productHref(frame.id), `/shop/${frame.id}/`);
    await access(new URL(`../public${productImage(frame.id)}`, import.meta.url));
  }
});

test('every selectable colour links to its own WebP frame preview', async () => {
  for (const frame of PRODUCTS) {
    const previews = frame.colors.map(color => productPreview(frame, color));
    const hashes = new Set();
    for (const [index, preview] of previews.entries()) {
      const color = frame.colors[index];
      assert.equal(preview.color, color);
      assert.equal(preview.name, COLORS[color].name);
      if (index) assert.ok(preview.alt.includes(preview.name));
      const image = await readFile(new URL(`../public${preview.src}`, import.meta.url));
      assert.equal(image.toString('ascii', 8, 12), 'WEBP', preview.src);
      hashes.add(createHash('sha256').update(image).digest('hex'));
    }
    assert.equal(new Set(previews.map(({ src }) => src)).size, frame.colors.length, frame.id);
    assert.equal(hashes.size, frame.colors.length, frame.id);
    assert.equal(previews[0].src, productImage(frame.id));
    assert.deepEqual(productPreview(frame, 'constructor'), previews[0]);
  }
});

test('the initial frame preview, caption and checked swatch agree without JavaScript', () => {
  for (const frame of PRODUCTS) {
    const preview = productPreview(frame);
    const html = product(frame);
    assert.ok(html.includes(`<img src="${preview.src}" width="900" height="900" alt="${escapeHtml(preview.alt)}"`));
    assert.ok(html.includes(`name="color" value="${preview.color}" checked`));
    assert.ok(html.includes(`<span data-preview-color>${preview.name}</span>. Illustrative colour preview.`));
  }
});

test('catalogue filters combine selections and keep a meaningful empty state', () => {
  assert.deepEqual(ids(filterFrames(PRODUCTS, { type: 'sunglasses', material: 'metal', color: 'gold' })), ['afterlight']);
  assert.deepEqual(ids(filterFrames(PRODUCTS, { q: ' champagne   ROUND ', type: 'eyeglasses' })), ['boulevard']);
  assert.deepEqual(filterFrames(PRODUCTS, { type: 'sunglasses', shape: 'square' }), []);
  assert.deepEqual(ids(filterFrames(PRODUCTS, { sort: 'name-asc' })), ['afterlight', 'arcade', 'boulevard', 'meridian', 'regent', 'solstice']);
  assert.equal(ids(filterFrames(PRODUCTS, { sort: 'name-desc' }))[0], 'solstice');
  assert.equal(PRODUCTS[0].id, 'regent');
});

test('filter URLs ignore unknown values and constrain free text', () => {
  const state = parseFilters(new URLSearchParams('type=eyeglasses&color=constructor&shape=round&sort=name-desc&q=%20foil%20'));
  assert.deepEqual(state, { q: 'foil', type: 'eyeglasses', shape: 'round', color: '', material: '', sort: 'name-desc' });
  assert.equal(parseFilters(new URLSearchParams({ q: 'q'.repeat(100), sort: 'bad' })).q.length, 80);
  assert.equal(parseFilters(new URLSearchParams('sort=bad')).sort, 'featured');
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
  const text = productMessage(frame, { color: 'tortoise', fit: 'Wide', lens: 'Progressive' }, 'https://example.test/shop/regent/');
  assert.match(text, /The Regent[\s\S]*Honey Tortoise[\s\S]*Wide[\s\S]*Progressive[\s\S]*shop\/regent\//);
});

test('static templates expose working contact details and do not advertise live inventory', () => {
  assert.match(home(), /239 Google reviews/);
  assert.match(home(), /href="\/shop\/"/);
  assert.match(contact(), /Shop No. UG-05, Bagherwal Four Seasons/);
  assert.match(contact(), /tel:\+919929594560/);
  assert.match(shop(), /not live inventory/i);
  assert.match(product(PRODUCTS[0]), /not a live product listing/i);
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
