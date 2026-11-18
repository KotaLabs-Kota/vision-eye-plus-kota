import { APPOINTMENT, BUSINESS, CONTACT_FAQS, EYE_FAQS, categoryHref, whatsappLink } from '../public/js/catalog.mjs';
import { escapeHtml, icon } from '../public/js/components.mjs';
import { aboutTrail, breadcrumbs, contactTrail, eyeTestsTrail } from './breadcrumbs.mjs';
import { mapCard } from './home.mjs';
import { externalAttrs, storeAddress } from './layout.mjs';

function faq(questions, kicker = 'GOOD TO KNOW') {
  return `<section id="faq" class="section faq-section" aria-labelledby="faq-heading">
    <div class="section-heading"><p class="eyebrow">${kicker}</p><h2 id="faq-heading">A few common questions.</h2></div>
    <div class="details-list">${questions.map(([question, answer]) => `<details><summary>${question} ${icon('plus')}</summary><p>${answer}</p></details>`).join('')}</div>
  </section>`;
}

function steps(items, sectionTitle, heading, eyebrow) {
  return `<section class="section" aria-labelledby="${sectionTitle}"><div class="section-heading"><p class="eyebrow">${eyebrow}</p><h2 id="${sectionTitle}">${heading}</h2></div>
    <div class="steps-grid">${items.map(([heading, text, symbol], index) => `<article class="step-card">
      <div class="step-top"><span class="trust-icon">${icon(symbol)}</span><span class="step-index">0${index + 1}</span></div><h3>${heading}</h3><p>${text}</p>
    </article>`).join('')}</div></section>`;
}

function contactActions() {
  return `<a class="button button--outline" href="tel:${BUSINESS.phone}">${icon('phone')} ${BUSINESS.phoneDisplay}</a>`;
}

export function eyeTests() {
  return `<div class="wrap inner-page">
    ${breadcrumbs(eyeTestsTrail)}
    <section class="split-panel inner-hero split-panel--care" aria-labelledby="eye-title">
      <div class="split-copy"><p class="eyebrow">${icon('eye')} EYE CARE IN KOTA</p><h1 id="eye-title">Eye tests<br class="desktop-break"> in Kota.</h1>
      <p>Ask about a routine vision test at Vision Eye Plus, opposite City Mall. Bring your current glasses if you have them, and talk through your prescription and lens options with the team.</p>
      <div class="actions"><a class="button button--primary" href="${APPOINTMENT}">Request an eye test ${icon('arrow')}</a>${contactActions()}</div></div>
      <figure class="split-image"><img src="/images/eye-care.webp" width="1040" height="698" alt="Illustration of a routine eye test in an optical practice" fetchpriority="high"><figcaption class="edit-label">ILLUSTRATIVE PHOTO</figcaption></figure>
    </section>
    ${steps([
      ['Pick a day', 'Send a request or call ahead to check available times and any fees. The shop will confirm your appointment directly.', 'calendar'],
      ['Bring your current pair', 'Bring any glasses and prescriptions you use, and tell the team what you want to see more clearly in your daily routine.', 'glasses'],
      ['Try on a few frames', 'Compare the weight, width, and comfort of a few styles. Ask about lens options once you’ve found a frame you like.', 'eye'],
    ], 'steps-title', 'What to expect.', 'PLAN YOUR VISIT')}
    ${faq(EYE_FAQS, 'EYE TEST FAQS')}
    <aside class="assist-block"><span class="trust-icon">${icon('pin')}</span><div><h2>Easy to find in Kota.</h2><p>Bagherwal Four Seasons, opposite City Mall. ${BUSINESS.hours}.</p></div><a class="button button--outline" href="/contact/">See store details ${icon('arrow')}</a></aside>
  </div>`;
}

export function about() {
  return `<div class="wrap inner-page">
    ${breadcrumbs(aboutTrail)}
    <section class="split-panel inner-hero split-panel--about" aria-labelledby="about-title">
      <div class="split-copy"><p class="eyebrow">${icon('spark')} OUR KOTA SHOP</p><h1 id="about-title">Your optician<br class="desktop-break"> in Kota.</h1>
        <p>Vision Eye Plus is an optical shop and wholesaler on Jhalawar Road. Try on <a href="${categoryHref('eyeglasses')}">eyeglasses</a> and <a href="${categoryHref('sunglasses')}">sunglasses</a>, talk through prescription lenses or ask about an eye test.</p>
        <div class="actions"><a class="button button--primary" href="/contact/">Plan your visit ${icon('arrow')}</a><a class="text-link" href="${BUSINESS.maps}" ${externalAttrs}>View on Google Maps ${icon('up-right')}</a></div></div>
      <figure class="split-image store-photo"><img src="/images/kota-store.webp" width="453" height="463" alt="Interior of the Vision Eye Plus shop with eyewear displays along both walls" fetchpriority="high"><figcaption class="edit-label"><span class="edit-dot"></span> THE JHALAWAR ROAD SHOP</figcaption></figure>
    </section>
    ${steps([
      ['Find your fit', 'Try a few shapes in person. Small differences in the bridge, frame width, and weight can make a big difference to comfort.', 'glasses'],
      ['Ask about lenses', 'Bring your prescription. Whether you need glasses for reading, screens, or everyday wear, you can discuss which lenses might suit.', 'eye'],
      ['Enquire about wholesale', 'Call the shop or send a wholesale enquiry to ask what ranges are available and how to order.', 'chat'],
    ], 'about-steps', 'What you’ll find here.', 'AT THE STUDIO')}
    <section class="section visit-teaser" aria-labelledby="about-visit"><div class="visit-copy"><p class="eyebrow">FIND THE SHOP</p><h2 id="about-visit">Across from City Mall.</h2>${storeAddress()}<p>${BUSINESS.hours} · ${BUSINESS.rating} on Google</p>
      <div class="actions"><a class="button button--primary" href="${BUSINESS.directions}" ${externalAttrs}>Get directions ${icon('up-right')}</a>${contactActions()}</div></div>${mapCard()}</section>
  </div>`;
}

const contactItems = [
  ['pin', 'Find the shop', storeAddress()],
  ['clock', 'Opening hours', `<p>${BUSINESS.hours}<small>Holiday hours may vary.</small></p>`],
  ['phone', 'Call us', `<p><a href="tel:${BUSINESS.phone}">${BUSINESS.phoneDisplay}</a></p>`],
];

const enquiryLink = escapeHtml(whatsappLink('Hi Vision Eye Plus! I have a question about your Kota store.'));

function enquiryForm() {
  return `<section id="enquiry" class="section enquiry-section" aria-labelledby="enquiry-title">
    <div class="enquiry-intro"><p class="eyebrow">LET’S TALK</p><h2 id="enquiry-title">How can we help?</h2><p>Ask about a frame, an eye test, or a wholesale order. This form prepares a message for you to send in WhatsApp.</p>
      <a class="text-link" href="tel:${BUSINESS.phone}">${icon('phone')} Prefer to call? ${BUSINESS.phoneDisplay}</a>
      <noscript><p><a class="button button--primary" href="${enquiryLink}" ${externalAttrs}>Open WhatsApp ${icon('up-right')}</a></p></noscript>
    </div>
    <form class="enquiry-form" data-enquiry-form data-js>
      <div class="form-columns">
        <label class="field"><span>Your name <small>(required)</small></span><input type="text" name="name" autocomplete="name" maxlength="80" required></label>
        <label class="field"><span>What are you looking for?</span><select name="topic"><option value="general">General enquiry</option><option value="eye-test">Eye test appointment</option><option value="frame">Eyewear enquiry</option><option value="wholesale">Wholesale enquiry</option></select></label>
      </div>
      <div class="form-columns" data-appointment-fields hidden>
        <label class="field"><span>Preferred day <small>(optional)</small></span><input type="date" name="date" disabled></label>
        <label class="field"><span>Preferred time <small>(optional)</small></span><select name="time" disabled><option value="">Any time</option><option>Morning (10 am–12 pm)</option><option>Afternoon (12–5 pm)</option><option>Evening (5–9 pm)</option></select></label>
      </div>
      <label class="field"><span>Your message <small>(optional)</small></span><textarea name="message" rows="4" maxlength="500" placeholder="For example, what styles would you like to try?"></textarea></label>
      <p class="form-note">No details are sent by this site. Please leave out prescriptions or other sensitive information.</p>
      <button class="button button--primary" type="submit">${icon('chat')} Continue to WhatsApp ${icon('up-right')}</button>
      <div class="form-result" data-form-result hidden><p role="status" data-form-status></p><a class="text-link" data-whatsapp-fallback href="${enquiryLink}" ${externalAttrs}>Open your WhatsApp message ${icon('up-right')}</a></div>
    </form>
  </section>`;
}

export function contact() {
  return `<div class="wrap inner-page">
    ${breadcrumbs(contactTrail)}
    <section class="contact-hero" aria-labelledby="contact-title">
      <div class="contact-copy"><p class="eyebrow">${icon('pin')} JHALAWAR ROAD · KOTA</p><h1 id="contact-title">Visit Vision Eye Plus.</h1><p>Find our optical shop just across from City Mall. Stop in to try frames, or call ahead to ask about eye test availability.</p>
      <div class="contact-details">${contactItems.map(([symbol, title, content]) => `<div class="contact-detail"><span class="trust-icon">${icon(symbol)}</span><div><strong>${title}</strong>${content}</div></div>`).join('')}</div>
      <div class="actions"><a class="button button--primary" href="${BUSINESS.directions}" ${externalAttrs}>Get directions ${icon('up-right')}</a><a class="button button--outline" href="${enquiryLink}" ${externalAttrs}>${icon('chat')} WhatsApp</a></div></div>
      <div class="contact-map">${mapCard()}<div class="map-link-row"><span>${BUSINESS.rating} on Google · ${BUSINESS.reviewCount} reviews</span><a class="text-link" href="${BUSINESS.maps}" ${externalAttrs}>View listing ${icon('up-right')}</a></div></div>
    </section>
    ${enquiryForm()}
    ${faq(CONTACT_FAQS, 'VISIT FAQS')}
  </div>`;
}

export function notFound() {
  return `<div class="wrap inner-page"><section class="page-banner not-found"><div><p class="eyebrow">404 / NOT FOUND</p><h1>This page is out of focus.</h1><p>Try the collection or head back to the Vision Eye Plus homepage.</p><div class="actions"><a class="button button--primary" href="/">Back home ${icon('arrow')}</a><a class="button button--outline" href="/shop/">Explore frames</a></div></div></section></div>`;
}
