import { APPOINTMENT, BUSINESS, INSTAGRAM_URL, whatsappLink } from '../public/js/catalog.mjs';
import { escapeHtml, icon } from '../public/js/components.mjs';

export const externalAttrs = 'target="_blank" rel="noopener noreferrer"';
const studioUrl = 'https://kotalabs.in/';
const nav = [
  ['home', '/', 'Home'], ['eyeglasses', '/shop/?type=eyeglasses', 'Eyeglasses'],
  ['sunglasses', '/shop/?type=sunglasses', 'Sunglasses'], ['eye-tests', '/eye-tests/', 'Eye Tests'], ['contact', '/contact/', 'Visit Us'],
];

export const brand = () => `<a class="brand" href="/">
  <span class="brand-mark">${icon('mark')}</span>
  <span class="brand-wordmark"><span>Vision Eye Plus</span><small>OPTICAL STUDIO · KOTA</small></span>
</a>`;

export const storeAddress = () => `<address>${BUSINESS.address}<br>${BUSINESS.landmark}<br>${BUSINESS.cityLine}</address>`;

function navLinks(active) {
  return nav.map(([key, href, label]) => `<a class="nav-link" data-nav="${key}" href="${href}"${active === key ? ' aria-current="page"' : ''}>${label}</a>`).join('');
}

function header(active) {
  return `<a class="skip-link" href="#content">Skip to content</a>
    <div class="notice" role="region" aria-label="Store location"><a href="${BUSINESS.directions}" ${externalAttrs}>${icon('pin')}<span>Opposite City Mall, Jhalawar Road, Kota</span>${icon('up-right')}</a></div>
    <header class="site-header">
      <div class="wrap header-inner">
        ${brand()}
        <nav class="desktop-nav" aria-label="Main navigation">${navLinks(active)}</nav>
        <div class="header-actions">
          <a class="tool-button" href="${INSTAGRAM_URL}" ${externalAttrs} aria-label="Vision Eye Plus on Instagram (@${BUSINESS.instagramHandle})" title="@${BUSINESS.instagramHandle}">${icon('instagram')}</a>
          <button class="tool-button" type="button" aria-label="Search" aria-haspopup="dialog" data-open="search" data-js>${icon('search')}</button>
          <button class="tool-button wish-trigger" type="button" aria-label="Saved frames" aria-haspopup="dialog" data-open="wishlist" data-js>${icon('heart')}<span class="wish-count" data-wish-count hidden>0</span></button>
          <a class="button button--outline button--header" href="${APPOINTMENT}">Book an eye test</a>
          <button class="tool-button mobile-trigger" type="button" aria-label="Open menu" aria-haspopup="dialog" data-open="menu" data-js>${icon('menu')}</button>
          <noscript><a class="mobile-fallback" href="/shop/">Shop</a></noscript>
        </div>
      </div>
    </header>`;
}

function footer() {
  return `<footer class="site-footer">
    <div class="wrap footer-grid">
      <div class="footer-intro">${brand()}<p>Eyewear, eye tests and a fit that feels right. Find us opposite City Mall in Kota.</p></div>
      <div class="footer-links"><h2>Explore</h2><a href="/shop/">All frames</a><a href="/shop/?type=eyeglasses">Eyeglasses</a><a href="/shop/?type=sunglasses">Sunglasses</a><a href="/#fit-finder">Frame fit guide</a></div>
      <div class="footer-links"><h2>The studio</h2><a href="/eye-tests/">Eye tests</a><a href="/about/">About us</a><a href="/contact/">Visit us</a><a href="/contact/#faq">FAQs</a></div>
      <div class="footer-links footer-location"><h2>Find us in Kota</h2>${storeAddress()}<a href="tel:${BUSINESS.phone}">${BUSINESS.phoneDisplay}</a><a class="footer-map" href="${BUSINESS.directions}" ${externalAttrs}>Get directions ${icon('up-right')}</a></div>
    </div>
    <div class="wrap kotalabs-credit">
      <span class="credit-mark" aria-hidden="true">K<span>L</span></span>
      <div class="credit-copy">
        <p class="credit-kicker"><span class="credit-dot" aria-hidden="true"></span>Designed &amp; engineered by</p>
        <p class="credit-identity"><strong>KotaLabs</strong><span class="credit-detail">Next-gen 3D web, AR experiences &amp; digital flagships</span></p>
      </div>
      <a class="button credit-cta" href="${studioUrl}" ${externalAttrs}>Explore KotaLabs ${icon('arrow')}</a>
    </div>
    <div class="wrap footer-bottom"><span>© ${new Date().getUTCFullYear()} Vision Eye Plus, Kota.</span><a href="${studioUrl}" ${externalAttrs}>Crafted by KotaLabs ${icon('up-right')}</a></div>
  </footer>`;
}

function dialogs(active) {
  return `<dialog class="sheet search-sheet" id="search-dialog" aria-labelledby="search-title" data-dialog="search">
    <div class="sheet-inner">
      <div class="sheet-heading"><div><p class="eyebrow">FIND IT FAST</p><h2 id="search-title">Search Vision Eye Plus</h2></div><button class="tool-button" type="button" aria-label="Close search" data-close>${icon('close')}</button></div>
      <form class="search-form" action="/shop/" role="search">
        <label for="site-search" class="visually-hidden">Search frames and services</label>${icon('search')}
        <input type="search" id="site-search" name="q" placeholder="Try ‘round’, ‘tortoise’ or ‘eye test’" autocomplete="off" maxlength="80" autofocus data-search>
        <button class="tool-button" type="submit" aria-label="Search catalogue">${icon('arrow')}</button>
      </form>
      <p class="visually-hidden" role="status" data-search-status></p>
      <div data-search-results></div>
    </div>
  </dialog>
  <dialog class="sheet drawer" id="wishlist-dialog" aria-labelledby="wishlist-title" data-dialog="wishlist">
    <div class="sheet-inner">
      <div class="sheet-heading"><div><p class="eyebrow">YOUR SHORTLIST</p><h2 id="wishlist-title">Saved frames</h2></div><button class="tool-button" type="button" aria-label="Close saved frames" data-close autofocus>${icon('close')}</button></div>
      <div data-wishlist></div>
    </div>
  </dialog>
  <dialog class="sheet drawer menu-sheet" id="menu-dialog" aria-labelledby="menu-title" data-dialog="menu">
    <div class="sheet-inner">
      <div class="sheet-heading"><h2 id="menu-title">Explore</h2><button class="tool-button" type="button" aria-label="Close menu" data-close autofocus>${icon('close')}</button></div>
      <nav class="mobile-nav" aria-label="Mobile navigation">${navLinks(active)}<a class="nav-link" href="/about/">About us</a></nav>
      <a class="button button--primary" href="${APPOINTMENT}">Book an eye test ${icon('arrow')}</a>
      <div class="menu-contacts"><a href="tel:${BUSINESS.phone}">${icon('phone')} ${BUSINESS.phoneDisplay}</a><a href="${escapeHtml(whatsappLink('Hello Vision Eye Plus, I have a question about your Kota store.'))}" ${externalAttrs}>${icon('chat')} WhatsApp</a></div>
    </div>
  </dialog>
  <div class="toast" role="status" data-toast></div>`;
}

const localBusiness = {
  '@context': 'https://schema.org',
  '@type': 'Optician',
  name: BUSINESS.name,
  telephone: BUSINESS.phone,
  address: { '@type': 'PostalAddress', streetAddress: `${BUSINESS.address}, ${BUSINESS.landmark}`, addressLocality: 'Kota', addressRegion: 'Rajasthan', postalCode: '324005', addressCountry: 'IN' },
  geo: { '@type': 'GeoCoordinates', latitude: BUSINESS.latitude, longitude: BUSINESS.longitude },
  openingHours: 'Mo-Su 10:00-21:00',
  hasMap: BUSINESS.maps,
};

export function layout({ title, description, active, page, content, image, preload = false }) {
  return `<!doctype html>
<html lang="en-IN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#faf9f7">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:locale" content="en_IN">
  <meta property="og:type" content="website">
  ${image ? `<meta property="og:image" content="${escapeHtml(image)}">` : ''}
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  ${preload ? '<link rel="preload" href="/assets/fonts/dm-serif-display-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>' : ''}
  <link rel="stylesheet" href="/css/styles.css">
  ${page === 'home' || page === 'contact' ? `<script type="application/ld+json">${JSON.stringify(localBusiness)}</script>` : ''}
  <script type="module" src="/js/main.mjs"></script>
</head>
<body data-page="${page}">
  ${header(active)}
  <main id="content" tabindex="-1">${content}</main>
  ${footer()}
  ${dialogs(active)}
</body>
</html>\n`;
}
