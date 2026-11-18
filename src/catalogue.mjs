import { APPOINTMENT, BUSINESS, CATALOGUE_FILTERS, CATEGORIES, COLORS, MATERIALS, PRODUCTS, SHAPES, categoryHref, productImage, whatsappLink } from '../public/js/catalog.mjs';
import { escapeHtml, frameCard, icon } from '../public/js/components.mjs';
import { breadcrumbs, productTrail, shopTrail } from './breadcrumbs.mjs';
import { externalAttrs } from './layout.mjs';

const selectOptions = (options, first) => `${first ? `<option value="">${first}</option>` : ''}${Object.entries(options).map(([value, label]) => `<option value="${value}">${label}</option>`).join('')}`;

export function shop() {
  return `<div class="wrap inner-page">
    ${breadcrumbs(shopTrail)}
    <section class="page-banner shop-banner" aria-labelledby="shop-title">
      <div><p class="eyebrow">THE FRAME EDIT</p><h1 id="shop-title">Browse eyewear styles.</h1><p>Filter our frame ideas by shape, material and colour, or explore <a href="${categoryHref('eyeglasses')}">eyeglasses</a> and <a href="${categoryHref('sunglasses')}">sunglasses</a> for your next try-on in Kota.</p></div>
      <span class="banner-motif" aria-hidden="true">${icon('mark')}</span>
      <span class="banner-index">01—06 <span>FRAME PREVIEWS</span></span>
    </section>
    <section class="catalogue" aria-label="Frame catalogue" data-catalogue>
      <aside class="filters" aria-label="Catalogue filters" data-filters data-open="false" data-js>
        <h2 class="filter-heading">${icon('sliders')} Filter frames</h2>
        <button class="filter-toggle button button--outline" type="button" aria-controls="frame-filters" aria-expanded="false" data-filter-toggle>${icon('sliders')} Filters <span class="filter-count" data-filter-count hidden></span>${icon('down', 'filter-chevron')}</button>
        <form id="frame-filters" class="filter-body" action="/shop/">
          <label class="field"><span>Search frames</span><input type="search" name="q" placeholder="Name or style" maxlength="80"></label>
          <fieldset class="type-options"><legend>Collection</legend>
            <label><input type="radio" name="type" value="" checked> All frames</label>
            ${Object.entries(CATEGORIES).map(([value, label]) => `<label><input type="radio" name="type" value="${value}"> ${label}</label>`).join('')}
          </fieldset>
          <label class="field"><span>Shape</span><select name="shape">${selectOptions(SHAPES, 'Any shape')}</select></label>
          <label class="field"><span>Material</span><select name="material">${selectOptions(MATERIALS, 'Any material')}</select></label>
          <label class="field"><span>Colour</span><select name="color">${selectOptions(CATALOGUE_FILTERS.color, 'Any colour')}</select></label>
          <button class="text-link filter-reset" type="button" data-clear-filters>Clear filters</button>
        </form>
      </aside>
      <div class="catalogue-results">
        <div class="results-top"><p role="status" class="result-count" data-frame-count>${PRODUCTS.length} frame styles</p>
          <label class="sort-control" data-js><span>Sort by</span><select name="sort" form="frame-filters">${selectOptions(CATALOGUE_FILTERS.sort)}</select></label>
        </div>
        <div class="filter-tags" data-active-filters hidden></div>
        <p class="catalogue-note">Illustrative styles, not live inventory. Ask the shop for prices and availability.</p>
        <div class="frame-grid catalogue-grid" data-catalogue-grid>${PRODUCTS.map(frameCard).join('')}</div>
        <div class="empty-state catalogue-empty" data-catalogue-empty hidden><span class="trust-icon">${icon('search')}</span><h2>No frames match.</h2><p>Try a different colour or shape, or reset the filters to browse all six styles.</p><button class="button button--primary" type="button" data-clear-filters>Show all frames ${icon('arrow')}</button></div>
      </div>
    </section>
    <aside class="assist-block"><span class="trust-icon">${icon('glasses')}</span><div><h2>Rather try them on?</h2><p>Bring your shortlist to Vision Eye Plus, opposite City Mall.</p></div><a class="button button--outline" href="/contact/">Plan a visit ${icon('up-right')}</a></aside>
  </div>`;
}

const optionsByType = {
  eyeglasses: ['Help me choose', 'Single vision', 'Progressive', 'Non-prescription'],
  sunglasses: ['Help me choose', 'Sun lenses', 'Prescription sun lenses'],
};

function getRelated(frame) {
  return [...PRODUCTS.filter(item => item.id !== frame.id && item.type === frame.type), ...PRODUCTS.filter(item => item.type !== frame.type)].slice(0, 3);
}

export function product(frame) {
  const primary = COLORS[frame.colors[0]].name;
  const initialMessage = `Hi Vision Eye Plus! I’m interested in a frame like ${frame.name} (${CATEGORIES[frame.type]}). Could you share similar styles and prices?`;
  return `<div class="wrap inner-page product-page" data-product="${frame.id}">
    ${breadcrumbs(productTrail(frame))}
    <section class="product-layout" aria-labelledby="product-title">
      <div class="product-visual">
        <figure class="product-image" data-product-image data-view="full">
          <img src="${productImage(frame.id)}" width="900" height="900" alt="${frame.alt}" fetchpriority="high"><span class="frame-tag">STYLE PREVIEW</span>
        </figure>
        <div class="product-views" role="group" aria-label="Image view" data-js>
          <button class="button button--outline" type="button" data-gallery="full" aria-pressed="true">${icon('glasses')} Full frame</button>
          <button class="button button--outline" type="button" data-gallery="detail" aria-pressed="false">${icon('expand')} Detail crop</button>
        </div>
        <p class="product-caption">Example shown in ${primary}. Images are illustrative.</p>
      </div>
      <div class="product-info">
        <p class="eyebrow">${CATEGORIES[frame.type]} / THE FRAME EDIT</p><h1 id="product-title">${frame.name}</h1>
        <p class="product-meta">${SHAPES[frame.shape]} · ${MATERIALS[frame.material]}</p><p class="product-description">${frame.description}</p>
        <form class="product-options" data-product-options data-js>
          <fieldset><legend>Colour preference <span class="choice-name" data-color-name>– ${primary}</span></legend><div class="colour-options">
            ${frame.colors.map((key, index) => `<label class="colour-choice" title="${COLORS[key].name}"><input type="radio" name="color" value="${key}" ${index === 0 ? 'checked' : ''}><span class="swatch" style="--swatch:${COLORS[key].hex}"></span><span class="visually-hidden">${COLORS[key].name}</span></label>`).join('')}
          </div></fieldset>
          <fieldset><legend>Fit preference</legend><div class="fit-options">
            ${['Not sure', 'Narrow', 'Regular', 'Wide'].map((fit, index) => `<label><input type="radio" name="fit" value="${fit}" ${index === 0 ? 'checked' : ''}><span>${fit}</span></label>`).join('')}
          </div></fieldset>
          <label class="field lens-select"><span>Lens preference</span><select name="lens">${optionsByType[frame.type].map(label => `<option>${label}</option>`).join('')}</select></label>
        </form>
        <div class="product-actions"><a class="button button--primary" data-product-enquire href="${escapeHtml(whatsappLink(initialMessage))}" ${externalAttrs}>${icon('chat')} Ask on WhatsApp ${icon('up-right')}</a><button class="tool-button product-heart" type="button" aria-label="Save ${frame.name}" aria-pressed="false" data-save="${frame.id}" data-js>${icon('heart')}</button></div>
        <p class="product-note">This is a style reference, not a live product listing. The shop can confirm similar frames, prices, and lens options. <a href="tel:${BUSINESS.phone}">Call the shop</a>.</p>
        <div class="details-list product-details">
          <details><summary>Fit tips ${icon('plus')}</summary><p>The frame should sit comfortably at the bridge, with the temples resting gently behind your ears. Bring a pair that fits well so the shop can help you compare.</p></details>
          <details><summary>Prescription and lenses ${icon('plus')}</summary><p>Bring your current prescription and ask which lenses work for your chosen frame. Need an update? <a href="${APPOINTMENT}">Request an eye test</a>.</p></details>
          <details><summary>Trying frames in store ${icon('plus')}</summary><p>Visit Shop No. UG-05 at Bagherwal Four Seasons, opposite City Mall, Kota. <a href="/contact/">See hours and directions</a>.</p></details>
        </div>
      </div>
    </section>
    <section class="section related" aria-labelledby="related-title"><div class="section-heading split-heading"><div><p class="eyebrow">KEEP EXPLORING</p><h2 id="related-title">More frame ideas.</h2></div><a class="text-link" href="/shop/">Browse all frames ${icon('arrow')}</a></div>
      <div class="frame-grid frame-grid--three">${getRelated(frame).map(frameCard).join('')}</div>
    </section>
  </div>`;
}
