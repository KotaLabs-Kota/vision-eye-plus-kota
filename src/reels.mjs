import { BUSINESS, INSTAGRAM_URL } from '../public/js/catalog.mjs';
import { escapeHtml, icon } from '../public/js/components.mjs';
import { externalAttrs } from './layout.mjs';

// The order matches the numbered filenames supplied by the shop.
export const REELS = [
  { file: 'video 1.mp4', poster: 'reel-1.webp', title: 'A look inside the shop', duration: '0:42' },
  { file: 'video 2.mp4', poster: 'reel-2.webp', title: 'A frame try-on', duration: '0:29' },
  { file: 'video 3.mp4', poster: 'reel-3.webp', title: 'Frames up close', duration: '0:35' },
  { file: 'video 4.mp4', poster: 'reel-4.webp', title: 'Clear-frame spotlight', duration: '0:49' },
];

const displayNumber = number => String(number).padStart(2, '0');

export function reels() {
  return `<section id="reels" class="wrap section reels-section" aria-labelledby="reels-heading" data-reels>
    <div class="reels-panel">
      <div class="reels-intro">
        <p class="eyebrow">${icon('instagram')} THE VISION REELS</p>
        <h2 id="reels-heading">Inside Vision Eye Plus.</h2>
        <p>See what a visit to our Kota shop looks like, from trying on frames to getting your eyes tested.</p>
      </div>
      <div class="reels-stage">
        <div class="reel-player">
          <div id="reel-track" class="reel-track" role="group" aria-label="Reel player" tabindex="0" data-reel-track>
            ${REELS.map(({ file, poster, title }, index) => `<div class="reel-slide" role="group" aria-label="Reel ${index + 1} of ${REELS.length}" data-reel-slide data-reel-title="${escapeHtml(title)}">
              <video aria-label="${escapeHtml(title)}" width="720" height="1280" poster="/images/${poster}" src="/${encodeURIComponent(file)}" controls playsinline muted preload="none">
                <a href="/${encodeURIComponent(file)}">Open reel ${index + 1}: ${escapeHtml(title)}</a>
              </video>
            </div>`).join('')}
          </div>
          <div class="reel-navigation" role="group" aria-label="Reel navigation" data-js>
            <button class="tool-button" type="button" aria-label="Previous reel" aria-controls="reel-track" aria-disabled="true" data-reel-step="-1">${icon('back')}</button>
            <span class="reel-counter" aria-hidden="true"><span data-reel-number>01</span> / ${displayNumber(REELS.length)}</span>
            <button class="tool-button" type="button" aria-label="Next reel" aria-controls="reel-track" aria-disabled="false" data-reel-step="1">${icon('arrow')}</button>
          </div>
          <p class="reel-swipe" data-js>Swipe or use the arrows</p>
          <noscript><p class="reel-swipe">Scroll sideways to see all four reels</p></noscript>
        </div>
      </div>
      <div class="reels-selector" data-js>
        <div class="reels-selector-heading"><span>Choose a reel</span><span>${displayNumber(REELS.length)} clips</span></div>
        <div class="reel-list" role="group" aria-label="Choose a reel">
          ${REELS.map(({ poster, title, duration }, index) => `<button class="reel-choice" type="button" aria-pressed="${index === 0}" aria-controls="reel-track" data-reel-select="${index}">
            <img src="/images/${poster}" width="36" height="42" loading="lazy" alt="">
            <span class="reel-choice-name"><small>Reel ${displayNumber(index + 1)}</small><strong>${escapeHtml(title)}</strong></span>
            <span class="reel-duration">${duration}</span>
            <span class="reel-choice-icon">${icon('play')}</span>
          </button>`).join('')}
        </div>
        <p class="reels-note">Sound is off by default. Turn it on using the video controls.</p>
      </div>
      <p class="visually-hidden" role="status" data-reel-status>Reel 1 of ${REELS.length}: ${escapeHtml(REELS[0].title)}</p>
    </div>
    <div class="reels-more">
      <p><span class="trust-icon">${icon('instagram')}</span><strong>For more reels, visit us on Instagram.</strong></p>
      <a class="button button--outline" href="${INSTAGRAM_URL}" ${externalAttrs}>@${BUSINESS.instagramHandle} ${icon('up-right')}</a>
    </div>
  </section>`;
}
