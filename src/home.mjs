import { APPOINTMENT, BUSINESS, CATEGORIES, FIT_GUIDE, PRODUCTS, REVIEWS, SHAPES } from '../public/js/catalog.mjs';
import { frameCard, icon } from '../public/js/components.mjs';
import { externalAttrs, storeAddress } from './layout.mjs';

const categories = [
  { title: 'Eyeglasses', subtitle: 'Everyday frames, from quiet to bold.', image: 'category-optical', alt: 'Translucent optical glasses on lavender display plinths', link: '/shop/?type=eyeglasses', number: '01' },
  { title: 'Sunglasses', subtitle: 'A little shade goes a long way.', image: 'category-sun', alt: 'Tortoiseshell sunglasses on a sunny yellow display', link: '/shop/?type=sunglasses', number: '02' },
  { title: 'Eye tests', subtitle: 'Make time for clearer vision.', image: 'eye-care', alt: 'Illustration of an in-store eye test with an optometrist', link: '/eye-tests/', number: '03' },
];

function trustItem(symbol, title, description, href, extra = '') {
  return `<a class="trust-item" href="${href}" ${extra}>
    <span class="trust-icon">${icon(symbol)}</span><span><strong>${title}</strong><small>${description}</small></span>${icon('chevron', 'trust-chevron')}
  </a>`;
}

export function mapCard() {
  return `<a class="map-card" href="${BUSINESS.directions}" ${externalAttrs}>
    <img src="/assets/neighborhood.svg" width="640" height="400" alt="" loading="lazy">
    <span class="visually-hidden">Open directions to Vision Eye Plus in Google Maps.</span><span class="map-caption">Illustrated map · not to scale</span><span class="map-launch">${icon('up-right')}</span>
  </a>`;
}

function hero() {
  return `<div class="wrap home-top">
    <section class="hero" aria-labelledby="home-heading">
      <div class="hero-copy">
        <p class="eyebrow hero-eyebrow">${icon('spark')} KOTA’S EYEWEAR STUDIO</p>
        <h1 id="home-heading">See better.<br><em>Look sharper.</em></h1>
        <p class="hero-lead">Find frames that feel like you and get your eyes tested, right here in Kota.</p>
        <div class="actions hero-actions">
          <a class="button button--primary" href="/shop/">Explore frames ${icon('arrow')}</a>
          <a class="button button--outline" href="${APPOINTMENT}">${icon('calendar')} Book an eye test</a>
        </div>
      </div>
      <figure class="hero-image">
        <img src="/images/campaign.webp" srcset="/images/campaign-small.webp 680w, /images/campaign.webp 1200w" sizes="(max-width: 760px) 100vw, (max-width: 1360px) 53vw, 680px" width="1200" height="896" alt="Woman in bold black optical frames and a lilac blazer" fetchpriority="high">
        <figcaption class="edit-label"><span class="edit-dot"></span> THE VISION EDIT <span class="edit-index">01</span></figcaption>
      </figure>
    </section>
    <div class="trust-bar" role="group" aria-label="Why visit Vision Eye Plus">
      ${trustItem('star', `${BUSINESS.rating} on Google`, `From ${BUSINESS.reviewCount} Google reviews`, BUSINESS.maps, externalAttrs)}
      ${trustItem('eye', 'In-store eye tests', 'Get help with your prescription', '/eye-tests/')}
      ${trustItem('pin', 'Visit us in Kota', 'Opposite City Mall, Jhalawar Road', '/contact/')}
    </div>
  </div>`;
}

function categorySection() {
  return `<section class="wrap section section-categories" aria-labelledby="category-heading">
    <div class="section-heading split-heading"><div><p class="eyebrow">THE COLLECTION</p><h2 id="category-heading">Find your kind of frame.</h2></div>
    <a class="text-link" href="/shop/">Browse the collection ${icon('up-right')}</a></div>
    <div class="category-grid">${categories.map(category => `<a class="category-card" href="${category.link}">
      <div class="category-image category-image--${category.number}">
        <img src="/images/${category.image}.webp" width="1040" height="698" alt="${category.alt}" loading="lazy"><span class="category-index">${category.number} / 03</span>
      </div>
      <div class="category-copy"><div><h3>${category.title}</h3><p>${category.subtitle}</p></div><span class="circle-arrow">${icon('arrow')}</span></div>
    </a>`).join('')}</div>
  </section>`;
}

function featured() {
  return `<section class="wrap section featured" aria-labelledby="featured-heading" data-featured>
    <div class="section-heading split-heading"><div><p class="eyebrow">THE FRAME EDIT</p><h2 id="featured-heading">Take a closer look.</h2><p class="section-lead">Six style ideas for your next in-store try-on.</p></div>
      <div class="segmented" role="group" aria-label="Filter featured frames" data-js>
        <button type="button" aria-pressed="true" data-feature="all">All frames</button>
        ${Object.entries(CATEGORIES).map(([key, label]) => `<button type="button" aria-pressed="false" data-feature="${key}">${label}</button>`).join('')}
      </div>
    </div>
    <p class="visually-hidden" role="status" data-feature-status></p>
    <div class="frame-grid" data-feature-grid>${PRODUCTS.slice(0, 4).map(frameCard).join('')}</div>
    <div class="feature-bottom"><p>Shown for inspiration. Check with the shop for current stock and prices.</p><a class="text-link" href="/shop/">View all frames ${icon('arrow')}</a></div>
  </section>`;
}

function eyeCare() {
  return `<section class="wrap section" aria-labelledby="eye-heading">
    <div class="split-panel split-panel--care">
      <figure class="split-image"><img src="/images/eye-care.webp" width="1040" height="698" loading="lazy" alt="Illustration of an optometrist setting up a routine vision test"></figure>
      <div class="split-copy"><p class="eyebrow">${icon('eye')} EYE CARE IN KOTA</p><h2 id="eye-heading">When did you last<br class="desktop-break"> check your vision?</h2>
      <p>Whether things look a little blurry or it’s time to update your prescription, ask us about an in-store eye test.</p>
      <div class="actions"><a class="button button--primary" href="${APPOINTMENT}">Request an eye test ${icon('arrow')}</a><a class="text-link" href="/eye-tests/">What to expect ${icon('up-right')}</a></div></div>
    </div>
  </section>`;
}

function fitFinder() {
  const choice = FIT_GUIDE.round;
  return `<section id="fit-finder" class="wrap section fit-section" aria-labelledby="fit-heading" data-fit>
    <div class="fit-intro"><p class="eyebrow">THE FIT GUIDE</p><h2 id="fit-heading">A frame that<br> feels like you.</h2><p>Choose the face shape closest to yours for a starting point. The best test is still how the frames feel when you try them on.</p></div>
    <div class="fit-widget">
      <div class="fit-choices" role="group" aria-label="Choose a face shape" data-js>${Object.entries(FIT_GUIDE).map(([key, value]) => `<button type="button" class="fit-choice" data-fit-choice="${key}" aria-pressed="${key === 'round'}">${icon(value.icon)} ${value.label}</button>`).join('')}</div>
      <div class="fit-result" aria-live="polite"><h3 data-fit-title>${choice.title}</h3><p data-fit-description>${choice.description}</p><a class="text-link" data-fit-link href="/shop/?shape=${choice.shape}">See ${SHAPES[choice.shape].toLowerCase()} frames ${icon('arrow')}</a></div>
    </div>
  </section>`;
}

function googleReviews() {
  return `<section class="wrap section" aria-labelledby="reviews-heading" data-reviews>
    <div class="review-panel">
      <div class="review-intro"><p class="eyebrow">KIND WORDS FROM KOTA</p><h2 id="reviews-heading">Rated by our neighbours.</h2>
        <a class="rating-link" href="${BUSINESS.maps}" ${externalAttrs}><span class="rating-number">${BUSINESS.rating}</span><span class="visually-hidden"> out of 5 from </span><span><span class="stars" aria-hidden="true">${Array.from({ length: 5 }, () => icon('star')).join('')}</span><span class="rating-caption">${BUSINESS.reviewCount} Google reviews ${icon('up-right')}</span></span></a>
      </div>
      <div class="quote-card"><span class="quote-mark" aria-hidden="true">“</span>
        <div aria-live="polite"><blockquote data-review-quote>${REVIEWS[0].quote}</blockquote><p class="quote-credit" data-review-credit>${REVIEWS[0].credit}</p></div>
        <div class="quote-controls" data-js><span class="quote-position" data-review-position>01 / ${String(REVIEWS.length).padStart(2, '0')}</span><button class="tool-button" type="button" aria-label="Previous review" data-review-step="-1">${icon('back')}</button><button class="tool-button" type="button" aria-label="Next review" data-review-step="1">${icon('arrow')}</button></div>
      </div>
    </div>
  </section>`;
}

function visit() {
  return `<section class="wrap section visit-teaser" aria-labelledby="visit-heading">
    <div class="visit-copy"><p class="eyebrow">COME SAY HELLO</p><h2 id="visit-heading">See you in Kota.</h2><p>Bring your prescription, your old glasses, or simply an idea of what you’d like to try.</p>
      <div class="visit-info"><span class="trust-icon">${icon('pin')}</span>${storeAddress()}</div>
      <div class="visit-info"><span class="trust-icon">${icon('clock')}</span><span>${BUSINESS.hours}</span></div>
      <div class="actions"><a class="button button--primary" href="${BUSINESS.directions}" ${externalAttrs}>Get directions ${icon('up-right')}</a><a class="text-link" href="/about/">About the studio ${icon('arrow')}</a></div>
    </div>
    ${mapCard()}
  </section>`;
}

function reels() {
  const videos = [
    { src: '/videos/reel-1.mp4', label: 'Buy one get one free offer' },
    { src: '/videos/reel-2.mp4', label: 'Store visit and eye care' },
    { src: '/videos/reel-3.mp4', label: 'Frame try-on and styles' },
    { src: '/videos/reel-4.mp4', label: 'Anniversary month specials' },
  ];
  return `<section class="wrap section reels-section" aria-labelledby="reels-heading" data-reels>
    <div class="section-heading split-heading">
      <div>
        <p class="eyebrow">${icon('spark')} FROM THE STUDIO</p>
        <h2 id="reels-heading">Watch the latest reels.</h2>
        <p class="section-lead">Offers, eye tests and frame moments from Vision Eye Plus in Kota.</p>
      </div>
      <a class="text-link" href="${BUSINESS.instagram}" ${externalAttrs}>${BUSINESS.instagramHandle} ${icon('up-right')}</a>
    </div>
    <div class="reels-track" data-reels-track>
      ${videos.map((video, i) => `
        <article class="reel-card" data-reel-index="${i}">
          <div class="reel-media">
            <video src="${video.src}" playsinline muted loop preload="metadata" aria-label="${video.label}"></video>
            <button type="button" class="reel-play" aria-label="Play reel ${i + 1}" data-reel-play>
              <span class="reel-play-icon" aria-hidden="true"></span>
            </button>
          </div>
          <p class="reel-caption">${video.label}</p>
        </article>`).join('')}
    </div>
    <div class="reels-controls" data-js>
      <button class="tool-button" type="button" aria-label="Previous reel" data-reel-step="-1">${icon('back')}</button>
      <span class="reels-position" data-reel-position>01 / 04</span>
      <button class="tool-button" type="button" aria-label="Next reel" data-reel-step="1">${icon('arrow')}</button>
    </div>
  </section>`;
}

export function home() {
  return hero() + categorySection() + featured() + eyeCare() + fitFinder() + googleReviews() + visit() + reels();
}
