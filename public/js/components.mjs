import { COLORS, PHOTO_SIZE, RIMS, SHAPES, productHref } from './catalog.mjs';

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

export const icon = (name, className = '') => `<svg class="icon${className ? ` ${className}` : ''}" aria-hidden="true" focusable="false"><use href="/assets/icons.svg#${name}"></use></svg>`;

export function frameCard(frame) {
  const name = escapeHtml(frame.name);
  const photo = frame.photos[0];
  const colour = COLORS[frame.color];
  return `<article class="frame-card">
    <div class="frame-media">
      <div class="frame-image">
        <img src="${photo.src}" width="${PHOTO_SIZE.width}" height="${PHOTO_SIZE.height}" loading="lazy" alt="${escapeHtml(photo.alt)}">
        <span class="frame-tag">${RIMS[frame.rim]}</span>
      </div>
      <button class="tool-button frame-heart" type="button" data-save="${frame.id}" aria-label="Save ${name}" aria-pressed="false" data-js>${icon('heart')}</button>
    </div>
    <div class="frame-copy">
      <div><h3><a class="frame-link" href="${productHref(frame.id)}">${name}</a></h3><p>${SHAPES[frame.shape]}</p></div>
      <span class="mini-arrow">${icon('up-right')}</span>
    </div>
    <p class="frame-colour"><span class="swatch" style="--swatch:${colour.hex}" aria-hidden="true"></span>${escapeHtml(colour.name)}</p>
  </article>`;
}
