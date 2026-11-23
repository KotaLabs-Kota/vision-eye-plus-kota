import { AUDIENCES, PHOTO_SIZE, PRODUCTS, categoryHref, collectionHref } from '../public/js/catalog.mjs';
import { escapeHtml, frameCard, icon } from '../public/js/components.mjs';
import { audienceTrail, breadcrumbs, categoryTrail } from './breadcrumbs.mjs';
import { browseNav } from './catalogue.mjs';

const photoFor = id => PRODUCTS.find(frame => frame.id === id).photos[0];

export const eyeglassesPage = {
  title: 'Eyeglasses in Kota | Vision Eye Plus',
  description: 'Browse eyeglasses at Vision Eye Plus, opposite City Mall in Kota. See frame photos and ask the shop about availability, lenses and fitting.',
  heading: 'Eyeglasses in Kota.',
  intro: 'Browse the frame catalogue, then call or message us to check availability. Bring your prescription along when you visit us opposite City Mall in Kota.',
  photo: photoFor('smoke-square'),
  frames: 'Explore the frames.',
  guide: 'Before choosing new glasses.',
  tips: [
    ['Bring your prescription', 'Bring your current glasses and prescription if you have one. If your prescription needs updating, ask about a routine vision test at the shop.', 'eye'],
    ['Talk through lens options', 'Tell the team whether you mainly need glasses for reading, distance, or both. Ask which lenses suit your prescription before ordering.', 'chat'],
    ['Check the fit in person', 'Try a few frame widths. The bridge should be comfortable and the sides shouldn’t squeeze or slip when you move.', 'glasses'],
  ],
  assist: ['Need an updated prescription?', 'Find out what to bring to an in-store eye test at the Kota shop.', '/eye-tests/', 'See eye test details'],
};

export const audiencePages = {
  men: {
    title: 'Men’s Eyeglasses | Vision Eye Plus Kota',
    heading: 'Men’s eyeglasses.',
    description: 'Explore slim aviators, clean rectangles and bold square frames in the men’s edit at Vision Eye Plus, Kota.',
    intro: 'Compare slim aviators, clean rectangles and bold square frames. These are style suggestions, not fit restrictions.',
    photo: photoFor('bold-black-square'),
  },
  women: {
    title: 'Women’s Eyeglasses | Vision Eye Plus Kota',
    heading: 'Women’s eyeglasses.',
    description: 'Explore clear frames, colour accents and rimless shapes in the women’s edit at Vision Eye Plus, Kota.',
    intro: 'Compare clear frames, red accents and pared-back rimless styles. These are style suggestions, not fit restrictions.',
    photo: photoFor('crystal-curve'),
  },
};

export function collection(audience) {
  const page = eyeglassesPage;
  const edit = audience && audiencePages[audience];
  const frames = audience ? PRODUCTS.filter(frame => frame.audiences.includes(audience)) : PRODUCTS;
  const route = edit ? collectionHref(audience) : categoryHref('eyeglasses');
  const photo = edit ? edit.photo : page.photo;
  const [assistTitle, assistCopy, assistLink, assistLabel] = page.assist;
  return `<div class="wrap inner-page category-page">
    ${breadcrumbs(edit ? audienceTrail(audience) : categoryTrail('eyeglasses'))}
    <section class="split-panel inner-hero collection-hero${audience ? ` edit--${audience}` : ''}" aria-labelledby="collection-title">
      <div class="split-copy"><p class="eyebrow">${icon('glasses')} ${edit ? `THE ${AUDIENCES[audience].toUpperCase()}’S EDIT` : 'EYEWEAR AT VISION EYE PLUS'}</p><h1 id="collection-title">${edit ? edit.heading : page.heading}</h1>
        <p>${edit ? edit.intro : page.intro}</p>
        <div class="actions"><a class="button button--primary" href="#frame-styles">See frames ${icon('down')}</a><a class="text-link" href="/contact/">Plan a try-on ${icon('up-right')}</a></div></div>
      <div class="collection-plate eyewear-plate"><img src="${photo.src}" width="${PHOTO_SIZE.width}" height="${PHOTO_SIZE.height}" alt="${escapeHtml(photo.alt)}" fetchpriority="high"><span class="plate-index" aria-hidden="true">THE FRAME EDIT</span></div>
    </section>
    ${browseNav(route)}
    <section id="frame-styles" class="section collection-frames" aria-labelledby="category-frames-heading">
      <div class="section-heading split-heading"><div><p class="eyebrow">${frames.length} FRAME STYLES</p><h2 id="category-frames-heading">${page.frames}</h2>
        <p class="section-lead">Open a frame to see its photos and get in touch. Confirm stock and pricing with the shop.</p></div>
        <a class="text-link" href="/shop/" data-js>Filter all eyeglasses ${icon('up-right')}</a></div>
      <div class="frame-grid">${frames.map(frameCard).join('')}</div>
    </section>
    ${edit ? '' : `<section class="section" aria-labelledby="category-guide-heading">
      <div class="section-heading"><p class="eyebrow">THE FIT GUIDE</p><h2 id="category-guide-heading">${page.guide}</h2></div>
      <div class="steps-grid">${page.tips.map(([heading, copy, symbol], index) => `<article class="step-card">
        <div class="step-top"><span class="trust-icon">${icon(symbol)}</span><span class="step-index">0${index + 1}</span></div><h3>${heading}</h3><p>${copy}</p>
      </article>`).join('')}</div>
    </section>`}
    <aside class="assist-block"><span class="trust-icon">${icon('pin')}</span><div><h2>${assistTitle}</h2><p>${assistCopy}</p></div><a class="button button--outline" href="${assistLink}">${assistLabel} ${icon('arrow')}</a></aside>
  </div>`;
}
