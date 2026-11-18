# Vision Eye Plus — Kota

A responsive storefront for the Vision Eye Plus optical shop on Jhalawar Road. It follows the browsing-to-enquiry model of [Mishra Optics](https://github.com/KotaLabs-Kota/mishra-optics) with a new visual identity, photography, layout, and copy.

## Run locally

```sh
npm run dev        # serves http://localhost:4173
npm test          # dependency-free Node tests
npm run build     # generates a static site in dist/
```

Use Node 20 or later. There are no runtime dependencies, accounts, API keys, or backend services. `vercel.json` configures a static Vercel build; any static host with directory index support can serve `dist/`.

## Pages and behaviour

- `/` — collection shortcuts, featured frame styles, an interactive fit guide, eye tests, Google review excerpts, and the store location.
- `/shop/` — six frame previews; search, sorting, and shareable collection, shape, material, and colour filters.
- `/shop/<style>/` — full-width and detail crop views, colour/fit/lens preferences, save button, and a prefilled WhatsApp enquiry.
- `/eye-tests/` and `/about/` — what to expect at an eye test and what the shop offers.
- `/contact/` — store details, a schematic map, phone and directions, FAQs, and an enquiry form with an eye-test option.

Search and the saved-frames drawer are available from the header. The shortlist is stored in the current browser only. The contact form prepares a message; it does not submit to a server, send a WhatsApp message on the visitor’s behalf, or confirm appointments. There is no cart or checkout.

## Business details and sources

| Item | Details |
| --- | --- |
| Address | Shop No. UG-05, Bagherwal Four Seasons, opposite City Mall, Jhalawar Road, Kota, Rajasthan 324005 |
| Public phone | +91 99295 94560 |
| Listed hours | Daily, 10 am–9 pm; holiday hours may vary |
| Google rating | 4.9 from 239 reviews when checked on 18 November 2026; not fetched live |
| Listed chat number | +91 70140 63286 (listed separately from the phone by WearMySpex) |

- [Google Maps store listing](https://www.google.com/maps?cid=6663549362734050113): exact shop, rating/count, reviews, hours, address, and phone. [Directions](https://www.google.com/maps/dir/?api=1&destination=25.136439%2C75.8541896) use the storefront pin, not the business listing URL.
- [Mappls](https://www.mappls.com/c7o2y1) and [Yappe](https://yappe.in/rajasthan/kota/vision-eye-plus/1393550) corroborate the primary phone and hours.
- [WearMySpex](https://www.wearmyspex.com/stores/kota-jhalawar-road-vision-eye-plus-rajib-nagar) lists eye testing and publishes a separate, store-specific WhatsApp chat number. Its directory hours differ, so the site uses the current Google Maps hours corroborated above. Confirm the chat number with the store before a public launch.

## Updating the site

- `public/js/catalog.mjs`: store details, frame styles, FAQs, excerpts, and fit-guide recommendations. Frame imagery and options are examples, **not live inventory**; swap in approved product photos, stock, and prices when available.
- `public/js/main.mjs` and `enquiries.mjs`: storefront interactions and WhatsApp message preparation.
- `src/`: shared page layout and page templates; `public/css/styles.css` defines the design system.
- `public/images/`: generated campaign, eye-test, and example frame imagery; `kota-store.webp` is a crop of the shop interior in the supplied Google listing screenshot. Verify usage rights or replace it with a store-owned photo before publishing.
- DM Serif Display and Plus Jakarta Sans are self-hosted; their OFL licenses are in `public/assets/fonts/`.
