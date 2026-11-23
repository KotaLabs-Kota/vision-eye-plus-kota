import { AUDIENCES, PHOTO_SIZE, PRODUCTS, categoryHref, collectionHref } from '../public/js/catalog.mjs';
import { escapeHtml, frameCard, icon } from '../public/js/components.mjs';
import { audienceTrail, breadcrumbs, categoryTrail } from './breadcrumbs.mjs';
import { browseNav } from './catalogue.mjs';
import { shopActions } from './layout.mjs';

const photoFor = id => PRODUCTS.find(frame => frame.id === id).photos[0];

export const categoryPages = {
  eyeglasses: {
    title: 'Eyeglasses in Kota | Vision Eye Plus',
    description: 'Browse eyeglasses at Vision Eye Plus, opposite City Mall in Kota. See frame photos and ask the shop about availability, lenses and fitting.',
    heading: 'Eyeglasses in Kota.',
    intro: 'Browse the frame catalogue, then call or message us to check availability. Bring your prescription along when you visit us opposite City Mall in Kota.',
    symbol: 'glasses',
    photo: photoFor('smoke-square'),
    frames: 'Explore the frames.',
    guide: 'Before choosing new glasses.',
    tips: [
      ['Bring your prescription', 'Bring your current glasses and prescription if you have one. If your prescription needs updating, ask about a routine vision test at the shop.', 'eye'],
      ['Talk through lens options', 'Tell the team whether you mainly need glasses for reading, distance, or both. Ask which lenses suit your prescription before ordering.', 'chat'],
      ['Check the fit in person', 'Try a few frame widths. The bridge should be comfortable and the sides shouldn’t squeeze or slip when you move.', 'glasses'],
    ],
    assist: ['Need an updated prescription?', 'Find out what to bring to an in-store eye test at the Kota shop.', '/eye-tests/', 'See eye test details'],
  },
  sunglasses: {
    title: 'Sunglasses in Kota | Vision Eye Plus',
    description: 'Ask Vision Eye Plus on Jhalawar Road, Kota, about current sunglasses styles, UV protection and prescription sun lenses.',
    heading: 'Sunglasses in Kota.',
    intro: 'Looking for sunglasses? Contact the shop for current styles and photos, or visit us opposite City Mall to compare frames in person.',
    symbol: 'sun',
    guide: 'What to look for in sunglasses.',
    tips: [
      ['Check the UV rating', 'A dark tint doesn’t tell you how much UV a lens blocks. Ask the shop to show you the UV protection rating for the pair you’re considering.', 'sun'],
      ['Ask about your prescription', 'If you usually wear glasses, bring your prescription. Ask which sunglass frames can take prescription lenses.', 'eye'],
      ['Compare coverage and comfort', 'Check whether the frames cover the area around your eyes without sitting too close to your cheeks. Try shapes you’d be happy wearing for a while.', 'glasses'],
    ],
    assist: ['Want to compare styles in person?', 'Find us opposite City Mall on Jhalawar Road, Kota.', '/contact/', 'See hours and directions'],
  },
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

export function collection(type, audience) {
  const page = categoryPages[type];
  const edit = audience && audiencePages[audience];
  const frames = PRODUCTS.filter(frame => frame.type === type && (!audience || frame.audiences.includes(audience)));
  const route = edit ? collectionHref(audience) : categoryHref(type);
  const photo = edit ? edit.photo : page.photo;
  const [assistTitle, assistCopy, assistLink, assistLabel] = page.assist;
  return `<div class="wrap inner-page category-page">
    ${breadcrumbs(edit ? audienceTrail(audience) : categoryTrail(type))}
    <section class="split-panel inner-hero collection-hero collection-hero--${type}${audience ? ` edit--${audience}` : ''}" aria-labelledby="collection-title">
      <div class="split-copy"><p class="eyebrow">${icon(page.symbol)} ${edit ? `THE ${AUDIENCES[audience].toUpperCase()}’S EDIT` : 'EYEWEAR AT VISION EYE PLUS'}</p><h1 id="collection-title">${edit ? edit.heading : page.heading}</h1>
        <p>${edit ? edit.intro : page.intro}</p>
        <div class="actions"><a class="button button--primary" href="#${frames.length ? 'frame-styles' : 'ask-about-sunglasses'}">${frames.length ? 'See frames' : 'Ask about sunglasses'} ${icon('down')}</a><a class="text-link" href="/contact/">Plan a try-on ${icon('up-right')}</a></div></div>
      <div class="collection-plate eyewear-plate${photo ? '' : ' eyewear-plate--sun'}">${photo ? `<img src="${photo.src}" width="${PHOTO_SIZE.width}" height="${PHOTO_SIZE.height}" alt="${escapeHtml(photo.alt)}" fetchpriority="high">` : icon('sun')}<span class="plate-index" aria-hidden="true">${photo ? 'THE FRAME EDIT' : 'SUNWEAR / KOTA'}</span></div>
    </section>
    ${browseNav(route)}
    ${frames.length ? `<section id="frame-styles" class="section collection-frames" aria-labelledby="category-frames-heading">
      <div class="section-heading split-heading"><div><p class="eyebrow">${frames.length} FRAME STYLES</p><h2 id="category-frames-heading">${page.frames}</h2>
        <p class="section-lead">Open a frame to see its photos and get in touch. Confirm stock and pricing with the shop.</p></div>
        <a class="text-link" href="/shop/?type=${type}" data-js>Filter all ${type} ${icon('up-right')}</a></div>
      <div class="frame-grid">${frames.map(frameCard).join('')}</div>
    </section>` : `<section id="ask-about-sunglasses" class="product-enquiry" aria-labelledby="sunglass-enquiry-title">
      <div class="enquiry-intro"><p class="eyebrow">SUNWEAR ENQUIRIES</p><h2 id="sunglass-enquiry-title">Ask what’s in store.</h2><p>Our online photos show eyeglasses. Call or message us for the current sunglasses selection.</p></div>
      <div class="enquiry-channels">${shopActions('Hi Vision Eye Plus! Could you share photos and availability of your sunglasses?')}</div>
    </section>`}
    ${edit ? '' : `<section class="section" aria-labelledby="category-guide-heading">
      <div class="section-heading"><p class="eyebrow">THE FIT GUIDE</p><h2 id="category-guide-heading">${page.guide}</h2></div>
      <div class="steps-grid">${page.tips.map(([heading, copy, symbol], index) => `<article class="step-card">
        <div class="step-top"><span class="trust-icon">${icon(symbol)}</span><span class="step-index">0${index + 1}</span></div><h3>${heading}</h3><p>${copy}</p>
      </article>`).join('')}</div>
    </section>`}
    <aside class="assist-block"><span class="trust-icon">${icon('pin')}</span><div><h2>${assistTitle}</h2><p>${assistCopy}</p></div><a class="button button--outline" href="${assistLink}">${assistLabel} ${icon('arrow')}</a></aside>
  </div>`;
}
