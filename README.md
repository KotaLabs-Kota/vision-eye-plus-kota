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

- `/` — collection shortcuts, featured frame styles, an interactive fit guide, eye tests, Google review excerpts, the store location, and a four-reel carousel with an Instagram profile link.
- `/shop/` — 10 photographed eyeglass frames; search, sorting, and shareable shape, rim style, and colour filters.
- `/shop/men/` and `/shop/women/` — curated style edits, not fit or gender restrictions. Frames can appear in both.
- `/shop/eyeglasses/` and `/shop/sunglasses/` — all eyeglass frames and an enquiry-only sunglasses page. No sunglasses photos were supplied for the catalogue. Both sections work without JavaScript.
- `/shop/<style>/` — uploaded frame photos with alternate views where available, a shortlist button, and Call, WhatsApp and Instagram DM links below the details. WhatsApp includes the specific frame, photographed colour, and any optional fit/lens preferences. Prices and stock must be confirmed with the shop.
- The six retired illustrative style URLs redirect to their respective collections.
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

## Launching on your domain and Google

1. **Connect the domain in Vercel.** Add it in the project’s **Settings → Domains** and enter the DNS records Vercel shows at your registrar. Pick one primary HTTPS hostname (with or without `www`) and redirect the other to it. See [Vercel’s domain setup guide](https://vercel.com/docs/domains/set-up-custom-domain).
2. **Enable production indexing.** In **Settings → Environment Variables**, set `SITE_URL` to the exact primary HTTPS origin, such as `https://www.example.com` (example only; use your domain). Set it for **Production only** and redeploy the merged site. Leave Vercel’s system environment variables exposed so the build can also recognize preview deployments. On the live domain, open `/robots.txt` and confirm it lists `/sitemap.xml` on that domain. The sitemap and canonical tags should all use the same HTTPS hostname. Check the homepage source for `index, follow` rather than `noindex`, and make sure the response does not have an `X-Robots-Tag: noindex` header.
3. **Submit the site to Google.** In [Search Console](https://search.google.com/search-console/), add a [Domain property and verify it through DNS](https://support.google.com/webmasters/answer/9008080). Submit `/sitemap.xml` under **Sitemaps**. Use [URL Inspection](https://support.google.com/webmasters/answer/9012289) to test the homepage, eyeglasses, sunglasses, eye tests, and visit pages. You can request indexing for the main pages after the live tests pass. Use the **Page indexing** and **Performance** reports to review coverage, impressions, and queries over time.
4. **Update the existing Maps listing.** Claim or verify the [Vision Eye Plus Google Business Profile](https://www.google.com/maps?cid=6663549362734050113) if needed, rather than creating a second listing. Set the new primary URL as its website. Confirm the shop name, category, pin, address, phone, opening and holiday hours, and eye test availability against the site. Add current shop photos you own, invite honest customer reviews, and reply to them. Confirm the WhatsApp number and photo rights before publishing.

The build writes one sitemap for the seven real landing pages. Catalogue filters and search parameters still work but use the clean `/shop/` URL as their canonical. Enquiry and tracking parameters use their corresponding clean page. The curated men’s and women’s edits, individual frame pages, and 404 have `noindex` and are omitted from the sitemap. The edits and frame pages are still browseable and shareable. The build uses the real store details in `Optician` structured data and does not publish `Product`/`Offer` markup or add review stars. The site does not track stock or publish prices. You can check the production homepage and contact page with Google’s [Rich Results Test](https://search.google.com/test/rich-results).

**Before the domain is set:** local builds without `SITE_URL` and non-production Vercel builds emit `noindex` and no sitemap or canonical URLs. `robots.txt` allows crawlers to read the HTML directives; it is not a privacy control. For a local check of the production output, run `SITE_URL=https://www.example.com npm run build` with an example hostname that you do not deploy. Technical SEO helps people and search engines find the right pages; [Google does not guarantee indexing or a specific rank](https://developers.google.com/search/docs/fundamentals/how-search-works). Local Maps visibility also depends on [relevance, distance, and prominence](https://support.google.com/business/answer/7091).

## Updating the site

- `public/js/catalog.mjs`: store details, frame styles, FAQs, excerpts, and fit-guide recommendations. The catalogue lists photographed styles, not live inventory. Add or remove frames when the shop changes its selection, and confirm current stock and pricing by enquiry.
- `public/js/main.mjs` and `enquiries.mjs`: storefront interactions and WhatsApp message preparation.
- `src/`: shared page layout and page templates; `public/css/styles.css` defines the design system.
- `public/video 1.mp4` through `public/video 4.mp4`: the shop’s four original reels. `src/reels.mjs` sets their order, titles and posters. Playback starts muted only when the selected reel comes into view; autoplay is skipped for reduced motion or data saver.
- `public/images/catalog/`: 15 distinct photos from the 16 supplied images, cropped and optimized as 1080 × 650 WebPs. Uploads 4 and 5 showed the same angle; only one is used. The price/QR sticker printing was removed from both red rimless photos. The first view in `catalog.mjs` is the card and sharing image. Add only actual photos for each frame; do not use simulated colour variants or publish price labels in photos. Confirm usage rights for the supplied photos before publishing.
- The reel posters are stills from the uploaded videos. `public/images/kota-store.webp` is a crop of the shop interior in the supplied Google listing screenshot. Verify usage rights or replace it with a store-owned photo before publishing.
- DM Serif Display and Plus Jakarta Sans are self-hosted; their OFL licenses are in `public/assets/fonts/`.
