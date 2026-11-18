import { CATEGORIES, COLORS, MATERIALS, SHAPES, productHref, productImage } from './catalog.mjs';

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

export const icon = (name, className = '') => `<svg class="icon${className ? ` ${className}` : ''}" aria-hidden="true" focusable="false"><use href="/assets/icons.svg#${name}"></use></svg>`;

export function frameCard(frame) {
  const name = escapeHtml(frame.name);
  return `<article class="frame-card">
    <div class="frame-media">
      <div class="frame-image">
        <img src="${productImage(frame.id)}" width="900" height="900" loading="lazy" alt="${escapeHtml(frame.alt)}">
        <span class="frame-tag">${CATEGORIES[frame.type]}</span>
      </div>
      <button class="tool-button frame-heart" type="button" data-save="${frame.id}" aria-label="Save ${name}" aria-pressed="false" data-js>${icon('heart')}</button>
    </div>
    <div class="frame-copy">
      <div><h3><a class="frame-link" href="${productHref(frame.id)}">${name}</a></h3><p>${SHAPES[frame.shape]} · ${MATERIALS[frame.material]}</p></div>
      <span class="mini-arrow">${icon('up-right')}</span>
    </div>
    <div class="swatches" role="group" aria-label="Colour ideas">${frame.colors.map(key => `<span class="swatch" style="--swatch:${COLORS[key].hex}" title="${COLORS[key].name}"><span class="visually-hidden">${COLORS[key].name}</span></span>`).join('')}</div>
  </article>`;
}
