import { CATEGORIES, PRODUCTS } from '../public/js/catalog.mjs';
import { frameCard, icon } from '../public/js/components.mjs';
import { breadcrumbs, categoryTrail } from './breadcrumbs.mjs';

export const categoryPages = {
  eyeglasses: {
    title: 'Eyeglasses in Kota | Vision Eye Plus',
    description: 'Try on eyeglasses at Vision Eye Plus, opposite City Mall in Kota. Browse frame ideas and bring your prescription to discuss lens options and fit.',
    heading: 'Eyeglasses in Kota.',
    intro: 'Try on everyday frames at Vision Eye Plus, opposite City Mall on Jhalawar Road. Bring your current prescription or ask about an in-store eye test.',
    symbol: 'glasses',
    image: '/images/category-optical.webp',
    alt: 'Translucent optical eyeglasses on lavender display plinths',
    frames: 'Eyeglass frame ideas.',
    guide: 'Before choosing new glasses.',
    tips: [
      ['Bring your prescription', 'Bring your current glasses and prescription if you have one. If your prescription needs updating, ask about a routine vision test at the shop.', 'eye'],
      ['Talk through lens options', 'Tell the team whether you mainly need glasses for reading, distance, or both. Ask which lenses suit your prescription and how much they cost before ordering.', 'chat'],
      ['Check the fit in person', 'Try a few frame widths. The bridge should be comfortable and the sides shouldn’t squeeze or slip when you move.', 'glasses'],
    ],
    assist: ['Need an updated prescription?', 'Find out what to bring to an in-store eye test at the Kota shop.', '/eye-tests/', 'See eye test details'],
  },
  sunglasses: {
    title: 'Sunglasses in Kota | Vision Eye Plus',
    description: 'Compare sunglasses styles at Vision Eye Plus on Jhalawar Road, Kota. Try frames in store and ask about UV protection and prescription sun lenses.',
    heading: 'Sunglasses in Kota.',
    intro: 'Compare sun frames in person at our Kota optical shop. Try different shapes and ask the team about UV protection or prescription sun lenses before deciding.',
    symbol: 'sun',
    image: '/images/category-sun.webp',
    alt: 'Tortoiseshell sunglasses with dark lenses on a yellow display',
    frames: 'Sunglass frame ideas.',
    guide: 'What to look for in sunglasses.',
    tips: [
      ['Check the UV rating', 'A dark tint doesn’t tell you how much UV a lens blocks. Ask the shop to show you the UV protection rating for the pair you’re considering.', 'sun'],
      ['Ask about your prescription', 'If you usually wear glasses, bring your prescription. Ask which sunglass frames can take prescription lenses.', 'eye'],
      ['Compare coverage and comfort', 'Check whether the frames cover the area around your eyes without sitting too close to your cheeks. Try shapes you’d be happy wearing for a while.', 'glasses'],
    ],
    assist: ['Want to compare styles in person?', 'Find us opposite City Mall on Jhalawar Road, Kota. Check current stock before you visit.', '/contact/', 'See hours and directions'],
  },
};

export function collection(type) {
  const page = categoryPages[type];
  const frames = PRODUCTS.filter(frame => frame.type === type);
  const [assistTitle, assistCopy, assistLink, assistLabel] = page.assist;
  return `<div class="wrap inner-page category-page">
    ${breadcrumbs(categoryTrail(type))}
    <section class="split-panel inner-hero collection-hero collection-hero--${type}" aria-labelledby="collection-title">
      <div class="split-copy"><p class="eyebrow">${icon(page.symbol)} EYEWEAR AT VISION EYE PLUS</p><h1 id="collection-title">${page.heading}</h1>
        <p>${page.intro}</p>
        <div class="actions"><a class="button button--primary" href="/contact/">Plan a try-on ${icon('arrow')}</a><a class="text-link" href="#frame-styles">See frame ideas ${icon('down')}</a></div></div>
      <figure class="split-image"><img src="${page.image}" width="1040" height="698" alt="${page.alt}" fetchpriority="high"></figure>
    </section>
    <section id="frame-styles" class="section" aria-labelledby="category-frames-heading">
      <div class="section-heading split-heading"><div><p class="eyebrow">THE FRAME EDIT</p><h2 id="category-frames-heading">${page.frames}</h2>
        <p class="section-lead">Save a shape you like and ask the shop about similar frames. These are style examples, not live stock or prices.</p></div>
        <a class="text-link" href="/shop/?type=${type}" data-js>Filter ${CATEGORIES[type].toLowerCase()} ${icon('up-right')}</a></div>
      <div class="frame-grid${frames.length === 2 ? ' frame-grid--pair' : ''}">${frames.map(frameCard).join('')}</div>
    </section>
    <section class="section" aria-labelledby="category-guide-heading">
      <div class="section-heading"><p class="eyebrow">THE FIT GUIDE</p><h2 id="category-guide-heading">${page.guide}</h2></div>
      <div class="steps-grid">${page.tips.map(([heading, copy, symbol], index) => `<article class="step-card">
        <div class="step-top"><span class="trust-icon">${icon(symbol)}</span><span class="step-index">0${index + 1}</span></div><h3>${heading}</h3><p>${copy}</p>
      </article>`).join('')}</div>
    </section>
    <aside class="assist-block"><span class="trust-icon">${icon('pin')}</span><div><h2>${assistTitle}</h2><p>${assistCopy}</p></div><a class="button button--outline" href="${assistLink}">${assistLabel} ${icon('arrow')}</a></aside>
  </div>`;
}
