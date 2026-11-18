import {
  CATALOGUE_FILTERS, CATEGORIES, COLORS, FIT_GUIDE, PRODUCTS, REVIEWS, SHAPES,
  categoryHref, filterFrames, parseFilters, productHref, productImage, whatsappLink,
} from './catalog.mjs';
import { escapeHtml, frameCard, icon } from './components.mjs';
import { contactMessage, productMessage, todayInKota } from './enquiries.mjs';
import { setupReels } from './reels.mjs';

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const FRAMES = new Map(PRODUCTS.map(frame => [frame.id, frame]));
const STORAGE_KEY = 'vision-eye-plus.saved.v1';
let saved = loadSaved();
let toastTimer;

function loadSaved() {
  try {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return new Set(Array.isArray(list) ? list.filter(id => FRAMES.has(id)) : []);
  } catch {
    return new Set();
  }
}

function toast(message) {
  const node = $('[data-toast]');
  node.textContent = message;
  node.dataset.visible = 'true';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    node.dataset.visible = 'false';
    node.textContent = '';
  }, 2450);
}

function syncSavedButtons() {
  for (const button of $$('button[data-save]')) {
    button.setAttribute('aria-pressed', String(saved.has(button.dataset.save)));
  }
  for (const count of $$('[data-wish-count]')) {
    count.textContent = saved.size;
    count.hidden = saved.size === 0;
    count.setAttribute('aria-hidden', 'true');
  }
  const trigger = $('[data-open="wishlist"]');
  trigger?.setAttribute('aria-label', saved.size ? `Saved frames (${saved.size})` : 'Saved frames');
}

function renderWishlist() {
  const section = $('[data-wishlist]');
  if (!saved.size) {
    section.innerHTML = `<div class="empty-state"><span class="trust-icon">${icon('heart')}</span><h3>Nothing saved yet.</h3><p>Tap the heart on a frame to keep it handy for your next visit.</p><a class="button button--primary" href="/shop/">Explore frames ${icon('arrow')}</a></div>`;
    return;
  }
  section.innerHTML = `<p class="overlay-subtitle">${saved.size} saved ${saved.size === 1 ? 'style' : 'styles'}</p><div class="overlay-list">${[...saved].reverse().map(id => {
    const frame = FRAMES.get(id);
    const name = escapeHtml(frame.name);
    return `<div class="saved-item"><a href="${productHref(id)}"><img src="${productImage(id)}" width="47" height="42" alt=""><span><strong>${name}</strong><small>${CATEGORIES[frame.type]} · ${SHAPES[frame.shape]}</small></span></a><button class="tool-button" type="button" data-remove-saved="${id}" aria-label="Remove ${name}">${icon('close')}</button></div>`;
  }).join('')}</div><p class="overlay-footer">Saved in this browser. Bring your shortlist when you visit the shop.</p>`;
}

function toggleSaved(id, removeButton) {
  if (!FRAMES.has(id)) return;
  const alreadySaved = saved.has(id);
  if (alreadySaved) saved.delete(id);
  else saved.add(id);
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...saved])); } catch { /* Still works in this tab. */ }
  syncSavedButtons();
  if (removeButton) {
    const previousIndex = $$('[data-remove-saved]').indexOf(removeButton);
    renderWishlist();
    const remaining = $$('[data-remove-saved]');
    (remaining[Math.min(previousIndex, remaining.length - 1)] || $('#wishlist-dialog [data-close]'))?.focus();
  } else {
    toast(`${FRAMES.get(id).name} ${alreadySaved ? 'removed from' : 'added to'} your shortlist.`);
  }
}

window.addEventListener('storage', event => {
  if (event.key !== STORAGE_KEY && event.key !== null) return;
  saved = loadSaved();
  syncSavedButtons();
  const active = document.activeElement;
  if ($('#wishlist-dialog').open) {
    renderWishlist();
    if (active?.matches?.('[data-remove-saved]')) {
      ($(`[data-remove-saved="${active.dataset.removeSaved}"]`) || $('#wishlist-dialog [data-close]'))?.focus();
    }
  }
});

const quickSearch = [
  { title: 'Eyeglasses', desc: 'Explore everyday frames', href: categoryHref('eyeglasses'), icon: 'glasses', terms: 'eyeglasses eyewear glasses prescription frames optical spectacles' },
  { title: 'Sunglasses', desc: 'Explore sun frames', href: categoryHref('sunglasses'), icon: 'sun', terms: 'sunglasses sun shades' },
  { title: 'In-store eye tests', desc: 'What to expect in Kota', href: '/eye-tests/', icon: 'eye', terms: 'eye tests testing optometrist prescription exam vision check' },
  { title: 'Visit the shop', desc: 'Address, hours and directions', href: '/contact/', icon: 'pin', terms: 'visit shop store contact directions hours location phone kota jhalawar city mall wholesale' },
];

function searchRow(item) {
  return `<a class="overlay-row" href="${escapeHtml(item.href)}">${item.image ? `<img src="${item.image}" width="47" height="42" alt="">` : `<span class="trust-icon">${icon(item.icon)}</span>`}<span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.desc)}</small></span>${icon('chevron')}</a>`;
}

function renderSearch() {
  const query = $('[data-search]').value.trim();
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const matches = query ? filterFrames(PRODUCTS, { q: query }).map(frame => ({
    title: frame.name, desc: `${CATEGORIES[frame.type]} · ${SHAPES[frame.shape]}`, href: productHref(frame.id), image: productImage(frame.id),
  })) : [];
  const shortcuts = query ? quickSearch.filter(item => terms.every(term => item.terms.includes(term))) : quickSearch;
  const list = (title, items) => items.length ? `<p class="overlay-subtitle">${title}</p><div class="overlay-list">${items.map(searchRow).join('')}</div>` : '';
  const total = matches.length + shortcuts.length;
  $('[data-search-results]').innerHTML = list('Frame styles', matches) + list(query ? 'Pages' : 'Quick links', shortcuts) + (query && !total ? '<p class="overlay-footer">No matches. Try a shape like “round” or a service like “eye test”.</p>' : '');
  $('[data-search-status]').textContent = query ? `${total} search ${total === 1 ? 'result' : 'results'}` : '';
}

function setupDialogs() {
  const search = $('[data-search]');
  search.addEventListener('input', renderSearch);
  // Type=search otherwise consumes Escape to clear the field instead of closing the dialog.
  search.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || event.isComposing) return;
    event.preventDefault();
    search.closest('dialog').close();
  });
  $('.search-form').addEventListener('submit', event => {
    const query = search.value.trim();
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length || filterFrames(PRODUCTS, { q: query }).length) return;
    const matches = quickSearch.filter(item => terms.every(term => item.terms.includes(term)));
    if (matches.length === 1) {
      event.preventDefault();
      location.assign(matches[0].href);
    }
  });
  for (const dialog of $$('[data-dialog]')) {
    let downOnBackdrop = false;
    const outside = event => {
      const bounds = dialog.getBoundingClientRect();
      return event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
    };
    dialog.addEventListener('pointerdown', event => { downOnBackdrop = event.target === dialog && outside(event); });
    dialog.addEventListener('click', event => {
      if (downOnBackdrop && event.target === dialog && outside(event)) dialog.close();
      downOnBackdrop = false;
    });
  }

  document.addEventListener('click', event => {
    const opener = event.target.closest('button[data-open]');
    if (opener) {
      const name = opener.dataset.open;
      const dialog = $(`#${name}-dialog`);
      if (name === 'search') renderSearch();
      if (name === 'wishlist') renderWishlist();
      dialog?.showModal();
      return;
    }
    const closer = event.target.closest('[data-close]');
    if (closer) { closer.closest('dialog')?.close(); return; }
    const button = event.target.closest('button[data-save]');
    if (button) { toggleSaved(button.dataset.save); return; }
    const remove = event.target.closest('[data-remove-saved]');
    if (remove) toggleSaved(remove.dataset.removeSaved, remove);
  });
}

function setupFeatured() {
  const section = $('[data-featured]');
  if (!section) return;
  const buttons = $$('[data-feature]', section);
  for (const button of buttons) {
    button.addEventListener('click', () => {
      const type = button.dataset.feature;
      const frames = type === 'all' ? PRODUCTS.slice(0, 4) : PRODUCTS.filter(frame => frame.type === type);
      buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      $('[data-feature-grid]', section).innerHTML = frames.map(frameCard).join('');
      $('[data-feature-status]', section).textContent = `${frames.length} ${type === 'all' ? 'featured frame styles' : CATEGORIES[type].toLowerCase() + ' styles'}`;
      syncSavedButtons();
    });
  }
}

function setupFitGuide() {
  const section = $('[data-fit]');
  if (!section) return;
  const buttons = $$('[data-fit-choice]', section);
  for (const button of buttons) {
    button.addEventListener('click', () => {
      const choice = FIT_GUIDE[button.dataset.fitChoice];
      if (!choice) return;
      buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      $('[data-fit-title]', section).textContent = choice.title;
      $('[data-fit-description]', section).textContent = choice.description;
      const link = $('[data-fit-link]', section);
      link.href = `/shop/?shape=${choice.shape}`;
      link.innerHTML = `See ${SHAPES[choice.shape].toLowerCase()} frames ${icon('arrow')}`;
    });
  }
}

function setupReviews() {
  const section = $('[data-reviews]');
  if (!section) return;
  let current = 0;
  for (const button of $$('[data-review-step]', section)) {
    button.addEventListener('click', () => {
      current = (current + Number(button.dataset.reviewStep) + REVIEWS.length) % REVIEWS.length;
      $('[data-review-quote]', section).textContent = REVIEWS[current].quote;
      $('[data-review-credit]', section).textContent = REVIEWS[current].credit;
      $('[data-review-position]', section).textContent = `${String(current + 1).padStart(2, '0')} / ${String(REVIEWS.length).padStart(2, '0')}`;
    });
  }
}

function setupCatalogue() {
  const catalogue = $('[data-catalogue]');
  if (!catalogue) return;
  const form = $('#frame-filters', catalogue);
  const count = $('[data-frame-count]', catalogue);
  const grid = $('[data-catalogue-grid]', catalogue);
  const empty = $('[data-catalogue-empty]', catalogue);
  const tagList = $('[data-active-filters]', catalogue);
  const filterIconCount = $('[data-filter-count]', catalogue);
  const toggle = $('[data-filter-toggle]', catalogue);
  const find = name => form.elements.namedItem(name);
  const keys = ['type', 'shape', 'material', 'color', 'q'];
  let inputTimer;

  const readLocation = () => parseFilters(new URLSearchParams(location.search));
  const setFilterValue = (key, value) => {
    const control = find(key);
    if (key === 'type') {
      for (const radio of control) radio.checked = radio.value === value;
    } else {
      control.value = value;
    }
  };
  const syncForm = filters => {
    for (const key of [...keys, 'sort']) setFilterValue(key, filters[key]);
  };
  const readForm = () => parseFilters(new URLSearchParams(new FormData(form)));
  const writeLocation = filters => {
    const url = new URL(location.href);
    for (const [key, value] of Object.entries(filters)) {
      if (!value || (key === 'sort' && value === 'featured')) url.searchParams.delete(key);
      else url.searchParams.set(key, value);
    }
    if (url.href !== location.href) history.replaceState(null, '', url);
  };

  function render(filters) {
    const frames = filterFrames(PRODUCTS, filters);
    count.textContent = `${frames.length} frame ${frames.length === 1 ? 'style' : 'styles'}`;
    grid.innerHTML = frames.map(frameCard).join('');
    grid.hidden = !frames.length;
    empty.hidden = Boolean(frames.length);
    const active = keys.filter(key => filters[key]);
    tagList.innerHTML = active.map(key => {
      const label = key === 'q' ? `“${filters[key]}”` : CATALOGUE_FILTERS[key][filters[key]];
      return `<button class="filter-tag" type="button" data-remove-filter="${key}" aria-label="Remove filter ${escapeHtml(label)}"><span>${escapeHtml(label)}</span>${icon('close')}</button>`;
    }).join('');
    tagList.hidden = !active.length;
    filterIconCount.textContent = active.length;
    filterIconCount.hidden = !active.length;
    syncSavedButtons();
  }

  function update() {
    clearTimeout(inputTimer);
    const filters = readForm();
    writeLocation(filters);
    render(filters);
  }

  function setFromLocation() {
    clearTimeout(inputTimer);
    const filters = readLocation();
    syncForm(filters);
    render(filters);
  }

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    $('[data-filters]', catalogue).dataset.open = String(!expanded);
  });
  catalogue.addEventListener('change', event => { if (event.target.form === form && event.target.name !== 'q') update(); });
  find('q').addEventListener('input', () => { clearTimeout(inputTimer); inputTimer = setTimeout(update, 100); });
  form.addEventListener('submit', event => { event.preventDefault(); update(); });
  catalogue.addEventListener('click', event => {
    if (event.target.closest('[data-clear-filters]')) {
      const fromEmpty = event.target.closest('[data-catalogue-empty]');
      syncForm(parseFilters(new URLSearchParams()));
      update();
      if (fromEmpty) find('sort').focus();
    }
    const tag = event.target.closest('[data-remove-filter]');
    if (tag) {
      const index = $$('[data-remove-filter]', tagList).indexOf(tag);
      setFilterValue(tag.dataset.removeFilter, '');
      update();
      const remaining = $$('[data-remove-filter]', tagList);
      (remaining[Math.min(index, remaining.length - 1)] || find('sort')).focus();
    }
  });
  window.addEventListener('popstate', setFromLocation);
  setFromLocation();
}

function setupProduct() {
  const product = $('[data-product]');
  if (!product) return;
  const frame = FRAMES.get(product.dataset.product);
  if (!frame) return;
  const options = $('[data-product-options]', product);
  const enquiry = $('[data-product-enquire]', product);
  const views = $$('[data-gallery]', product);
  for (const view of views) {
    view.addEventListener('click', () => {
      views.forEach(button => button.setAttribute('aria-pressed', String(button === view)));
      $('[data-product-image]', product).dataset.view = view.dataset.gallery;
    });
  }
  function updateMessage() {
    const values = Object.fromEntries(new FormData(options));
    $('[data-color-name]', product).textContent = `– ${COLORS[values.color]?.name || COLORS[frame.colors[0]].name}`;
    const link = new URL(productHref(frame.id), location.origin).href;
    enquiry.href = whatsappLink(productMessage(frame, values, link));
  }
  options.addEventListener('change', updateMessage);
  options.addEventListener('submit', event => event.preventDefault());
  updateMessage();
}

function setupEnquiryForm() {
  const form = $('[data-enquiry-form]');
  if (!form) return;
  const name = form.elements.namedItem('name');
  const date = form.elements.namedItem('date');
  const time = form.elements.namedItem('time');
  const topic = form.elements.namedItem('topic');
  const fields = $('[data-appointment-fields]', form);
  const result = $('[data-form-result]', form);
  const fallback = $('[data-whatsapp-fallback]', form);
  const status = $('[data-form-status]', form);
  const preselection = new URLSearchParams(location.search).get('topic');
  if ([...topic.options].some(option => option.value === preselection)) topic.value = preselection;
  date.min = todayInKota();

  function toggleDateFields() {
    const hasAppointment = topic.value === 'eye-test';
    fields.hidden = !hasAppointment;
    date.disabled = time.disabled = !hasAppointment;
  }
  form.addEventListener('input', () => {
    name.setCustomValidity('');
    result.hidden = true;
  });
  topic.addEventListener('change', toggleDateFields);
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!name.value.trim()) {
      name.setCustomValidity('Please enter your name.');
      name.reportValidity();
      return;
    }
    const values = Object.fromEntries(new FormData(form));
    const url = whatsappLink(contactMessage(values));
    fallback.href = url;
    result.hidden = false;
    status.textContent = 'Your message is ready. Send it in WhatsApp to reach the shop; nothing has been sent yet.';
    window.open(url, '_blank', 'noopener,noreferrer');
  });
  toggleDateFields();
}

setupDialogs();
setupFeatured();
setupFitGuide();
setupReviews();
setupReels($('[data-reels]'));
setupCatalogue();
setupProduct();
setupEnquiryForm();
syncSavedButtons();
document.documentElement.classList.add('js');
