import { AUDIENCES, CATEGORIES, categoryHref, collectionHref, productHref } from '../public/js/catalog.mjs';
import { escapeHtml, icon } from '../public/js/components.mjs';

const home = ['Home', '/'];
export const shopTrail = [home, ['Collection', '/shop/']];
export const eyeTestsTrail = [home, ['Eye Tests', '/eye-tests/']];
export const aboutTrail = [home, ['About', '/about/']];
export const contactTrail = [home, ['Visit Us', '/contact/']];
export const categoryTrail = type => [...shopTrail, [CATEGORIES[type], categoryHref(type)]];
export const audienceTrail = audience => [...categoryTrail('eyeglasses'), [AUDIENCES[audience], collectionHref(audience)]];
export const productTrail = frame => [home, [CATEGORIES[frame.type], categoryHref(frame.type)], [frame.name, productHref(frame.id)]];

export function breadcrumbs(trail) {
  const items = trail.map(([label, path], index) => index === trail.length - 1
    ? `<span aria-current="page">${escapeHtml(label)}</span>`
    : `<a href="${escapeHtml(path)}">${escapeHtml(label)}</a>`);
  return `<nav class="breadcrumb" aria-label="Breadcrumb">${items.join(icon('chevron'))}</nav>`;
}
