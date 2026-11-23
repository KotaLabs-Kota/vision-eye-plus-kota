import { APPOINTMENT, AUDIENCES, BUSINESS, CATALOGUE_FILTERS, CATEGORIES, COLORS, PHOTO_SIZE, PRODUCTS, RIMS, SHAPES, categoryHref, collectionHref } from '../public/js/catalog.mjs';
import { escapeHtml, frameCard, icon } from '../public/js/components.mjs';
import { FIT_PREFERENCES, LENS_PREFERENCES, productMessage } from '../public/js/enquiries.mjs';
import { breadcrumbs, productTrail, shopTrail } from './breadcrumbs.mjs';
import { externalAttrs, shopActions } from './layout.mjs';

const selectOptions = (options, first) => `${first ? `<option value="">${first}</option>` : ''}${Object.entries(options).map(([value, label]) => `<option value="${value}">${escapeHtml(label)}</option>`).join('')}`;

export function browseNav(current) {
  const links = [['/shop/', 'All frames'], ...Object.entries(AUDIENCES).map(([key, label]) => [collectionHref(key), label]), [categoryHref('sunglasses'), 'Sunglasses']];
  return `<nav class="browse-nav" aria-label="Shop by collection">${links.map(([href, label]) => `<a href="${href}"${current === href ? ' aria-current="page"' : ''}>${label}</a>`).join('')}</nav>`;
}

export function shop() {
  return `<div class="wrap inner-page">
    ${breadcrumbs(shopTrail)}
    <section class="page-banner shop-banner" aria-labelledby="shop-title">
      <div><p class="eyebrow">THE FRAME EDIT / KOTA</p><h1 id="shop-title">Shop eyewear.</h1><p>Browse our photographed frames by shape, rim style and colour. Open any frame to ask the shop about availability, lenses or ordering.</p></div>
      <span class="banner-motif" aria-hidden="true">${icon('mark')}</span>
      <span class="banner-index">${String(PRODUCTS.length).padStart(2, '0')} <span>FRAME STYLES</span></span>
    </section>
    ${browseNav('/shop/')}
    <section class="catalogue" aria-label="Frame catalogue" data-catalogue>
      <aside class="filters" aria-label="Catalogue filters" data-filters data-open="false" data-js>
        <h2 class="filter-heading">${icon('sliders')} Filter frames</h2>
        <button class="filter-toggle button button--outline" type="button" aria-controls="frame-filters" aria-expanded="false" data-filter-toggle>${icon('sliders')} Filters <span class="filter-count" data-filter-count hidden></span>${icon('down', 'filter-chevron')}</button>
        <form id="frame-filters" class="filter-body" action="/shop/">
          <input type="hidden" name="type" value="">
          <label class="field"><span>Search frames</span><input type="search" name="q" placeholder="Name or style" maxlength="80"></label>
          <label class="field"><span>Shape</span><select name="shape">${selectOptions(SHAPES, 'Any shape')}</select></label>
          <label class="field"><span>Rim style</span><select name="rim">${selectOptions(RIMS, 'Any rim style')}</select></label>
          <label class="field"><span>Colour</span><select name="color">${selectOptions(CATALOGUE_FILTERS.color, 'Any colour')}</select></label>
          <button class="text-link filter-reset" type="button" data-clear-filters>Clear filters</button>
        </form>
      </aside>
      <div class="catalogue-results">
        <div class="results-top"><p role="status" class="result-count" data-frame-count>${PRODUCTS.length} frame styles</p>
          <label class="sort-control" data-js><span>Sort by</span><select name="sort" form="frame-filters">${selectOptions(CATALOGUE_FILTERS.sort)}</select></label>
        </div>
        <div class="filter-tags" data-active-filters hidden></div>
        <p class="catalogue-note">Ask the shop to confirm current stock and pricing.</p>
        <div class="frame-grid catalogue-grid" data-catalogue-grid>${PRODUCTS.map(frameCard).join('')}</div>
        <div class="empty-state catalogue-empty" data-catalogue-empty hidden><span class="trust-icon">${icon('search')}</span><h2>No frames match.</h2><p>Try another colour or shape, or reset the filters to browse the full catalogue.</p><button class="button button--primary" type="button" data-clear-filters>Show all frames ${icon('arrow')}</button></div>
      </div>
    </section>
    <aside class="assist-block"><span class="trust-icon">${icon('glasses')}</span><div><h2>Rather try them on?</h2><p>Bring your shortlist to Vision Eye Plus, opposite City Mall.</p></div><a class="button button--outline" href="/contact/">Plan a visit ${icon('up-right')}</a></aside>
  </div>`;
}

function gallery(frame) {
  const first = frame.photos[0];
  const { width, height } = PHOTO_SIZE;
  return `<div class="product-visual">
    <figure>
      <a class="product-image" href="${first.src}" data-product-image ${externalAttrs}>
        <img src="${first.src}" width="${width}" height="${height}" alt="${escapeHtml(first.alt)}" fetchpriority="high">
        <span class="photo-expand">${icon('expand')}<span class="visually-hidden">Open full-size photo</span></span>
      </a>
      <figcaption class="product-caption"><span data-photo-caption aria-live="polite">${first.label}</span><span data-photo-count>${frame.photos.length > 1 ? `01 / ${String(frame.photos.length).padStart(2, '0')}` : 'PRODUCT PHOTO'}</span></figcaption>
    </figure>
    ${frame.photos.length > 1 ? `<div class="product-photos" role="group" aria-label="Frame photos">${frame.photos.map((photo, index) => `<a class="photo-option" href="${photo.src}" data-product-photo="${photo.id}"${index === 0 ? ' aria-current="true"' : ''}>
      <img src="${photo.src}" width="${width}" height="${height}" alt="" loading="lazy"><span>${photo.label}</span></a>`).join('')}</div>` : ''}
  </div>`;
}

function getRelated(frame) {
  return PRODUCTS.filter(item => item.id !== frame.id && item.type === frame.type)
    .sort((a, b) => Number(b.shape === frame.shape) - Number(a.shape === frame.shape))
    .slice(0, 3);
}

export function product(frame) {
  const colour = COLORS[frame.color];
  return `<div class="wrap inner-page product-page" data-product="${frame.id}">
    ${breadcrumbs(productTrail(frame))}
    <section class="product-layout" aria-labelledby="product-title">
      ${gallery(frame)}
      <div class="product-info">
        <p class="eyebrow">${CATEGORIES[frame.type]} / THE FRAME EDIT</p><h1 id="product-title">${escapeHtml(frame.name)}</h1>
        <p class="product-meta">${SHAPES[frame.shape]} · ${RIMS[frame.rim]}</p><p class="product-description">${escapeHtml(frame.description)}</p>
        <p class="product-colour"><span class="swatch" style="--swatch:${colour.hex}" aria-hidden="true"></span><span>Colour shown: <strong>${escapeHtml(colour.name)}</strong></span></p>
        <div class="product-actions"><a class="button button--primary" href="#ask-about-frame">Ask about this frame ${icon('down')}</a><button class="tool-button product-heart" type="button" aria-label="Save ${escapeHtml(frame.name)}" aria-pressed="false" data-save="${frame.id}" data-js>${icon('heart')}</button></div>
        <div class="details-list product-details">
          <details><summary>Fit and try-on ${icon('plus')}</summary><p>Visit us opposite City Mall in Kota to check the width and bridge fit. If you have a pair that fits well, bring it along to compare.</p></details>
          <details><summary>Prescription and lenses ${icon('plus')}</summary><p>Bring your prescription or ask which lenses suit this frame. Need an update? <a href="${APPOINTMENT}">Request an eye test</a>.</p></details>
        </div>
      </div>
    </section>
    <section id="ask-about-frame" class="product-enquiry" aria-labelledby="product-enquiry-title">
      <div class="enquiry-intro"><p class="eyebrow">TALK TO THE KOTA SHOP</p><h2 id="product-enquiry-title">Interested in this frame?</h2><p>Ask us about stock, current pricing or ordering <strong>${escapeHtml(frame.name)}</strong>. We can help you choose lenses and arrange a try-on.</p></div>
      <div class="enquiry-channels">
        ${shopActions(productMessage(frame), { product: true })}
        <p>${icon('clock')} ${BUSINESS.hours} <span aria-hidden="true">·</span> <a href="/contact/">Hours &amp; directions</a></p>
      </div>
      <details class="enquiry-preferences" data-js>
        <summary>Add fit or lens preferences to WhatsApp ${icon('plus')}</summary>
        <form class="product-options" data-product-options>
          <label class="field"><span>Fit preference</span><select name="fit">${FIT_PREFERENCES.map(label => `<option>${label}</option>`).join('')}</select></label>
          <label class="field"><span>Lens preference</span><select name="lens">${LENS_PREFERENCES[frame.type].map(label => `<option>${label}</option>`).join('')}</select></label>
        </form>
      </details>
    </section>
    <section class="section related" aria-labelledby="related-title"><div class="section-heading split-heading"><div><p class="eyebrow">KEEP EXPLORING</p><h2 id="related-title">More frames to try.</h2></div><a class="text-link" href="/shop/">Browse all frames ${icon('arrow')}</a></div>
      <div class="frame-grid frame-grid--three">${getRelated(frame).map(frameCard).join('')}</div>
    </section>
  </div>`;
}
