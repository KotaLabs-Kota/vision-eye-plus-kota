import { isIP } from 'node:net';
import { BUSINESS, INSTAGRAM_URL } from '../public/js/catalog.mjs';
import { escapeHtml } from '../public/js/components.mjs';

export const SHARE_IMAGE = {
  path: '/images/vision-eye-plus-share.jpg',
  width: 1200,
  height: 630,
  alt: 'Vision Eye Plus optical shop in Kota, with a portrait of a woman wearing black eyeglasses',
};

export function resolveSiteOrigin(env = process.env) {
  if ([env.VERCEL_ENV, env.VERCEL_TARGET_ENV].some(value => value && value !== 'production')) return null;
  const configured = env.SITE_URL?.trim();
  if (!configured) return null;
  let url;
  try { url = new URL(configured); } catch { /* Report a configuration error below. */ }
  if (!url || !/^https:\/\/[^:/\\?#@\s]+\/?$/i.test(configured) || !url.hostname.includes('.')
    || url.hostname.endsWith('.') || isIP(url.hostname)) {
    throw new Error('SITE_URL must be an HTTPS domain origin, for example https://www.example.com, with no port, path, query, or fragment.');
  }
  return url.origin;
}

const absolute = (origin, path) => new URL(path, origin).href;

function optician(origin) {
  return {
    '@type': 'Optician',
    '@id': absolute(origin, '/#optician'),
    name: BUSINESS.name,
    url: absolute(origin, '/contact/'),
    image: absolute(origin, '/images/reel-1.webp'),
    logo: absolute(origin, '/assets/favicon.svg'),
    telephone: BUSINESS.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${BUSINESS.address}, ${BUSINESS.landmark}`,
      addressLocality: BUSINESS.city,
      addressRegion: BUSINESS.region,
      postalCode: BUSINESS.postalCode,
      addressCountry: 'IN',
    },
    geo: { '@type': 'GeoCoordinates', latitude: BUSINESS.latitude, longitude: BUSINESS.longitude },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => `https://schema.org/${day}`),
      opens: BUSINESS.opens,
      closes: BUSINESS.closes,
    },
    hasMap: BUSINESS.maps,
    sameAs: [BUSINESS.maps, INSTAGRAM_URL],
  };
}

export function structuredData(origin, route, trail = []) {
  const graph = [];
  const businessId = absolute(origin, '/#optician');
  if (route === '/') {
    graph.push({
      '@type': 'WebSite',
      '@id': absolute(origin, '/#website'),
      url: absolute(origin, '/'),
      name: BUSINESS.name,
      alternateName: 'Vision Eye Plus Kota',
      inLanguage: 'en-IN',
      publisher: { '@id': businessId },
    });
  }
  if (['/', '/contact/', '/eye-tests/'].includes(route)) graph.push(optician(origin));
  if (route === '/eye-tests/') {
    graph.push({
      '@type': 'Service',
      name: 'In-store eye tests',
      serviceType: 'Routine vision testing',
      url: absolute(origin, route),
      provider: { '@id': businessId },
      areaServed: { '@type': 'City', name: BUSINESS.city },
    });
  }
  if (trail.length > 1) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: trail.map(([name, path], index) => ({
        '@type': 'ListItem', position: index + 1, name, item: absolute(origin, path),
      })),
    });
  }
  return graph.length ? { '@context': 'https://schema.org', '@graph': graph } : null;
}

export function renderSeo({ title, description, origin, route, indexable = false, trail, socialImage = SHARE_IMAGE }) {
  const url = origin && route ? absolute(origin, route) : null;
  const eligible = Boolean(url && indexable);
  const schema = eligible ? structuredData(origin, route, trail) : null;
  const tags = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}">`,
    `<meta name="robots" content="${eligible ? 'index, follow, max-image-preview:large' : 'noindex, follow'}">`,
  ];
  if (eligible) tags.push(`<link rel="canonical" href="${escapeHtml(url)}">`);
  if (url && route !== '/404.html') {
    const imageUrl = escapeHtml(absolute(origin, socialImage.path));
    tags.push(
      '<meta property="og:type" content="website">',
      '<meta property="og:locale" content="en_IN">',
      `<meta property="og:site_name" content="${escapeHtml(BUSINESS.name)}">`,
      `<meta property="og:title" content="${escapeHtml(title)}">`,
      `<meta property="og:description" content="${escapeHtml(description)}">`,
      `<meta property="og:url" content="${escapeHtml(url)}">`,
      `<meta property="og:image" content="${imageUrl}">`,
      `<meta property="og:image:width" content="${socialImage.width}">`,
      `<meta property="og:image:height" content="${socialImage.height}">`,
      `<meta property="og:image:alt" content="${escapeHtml(socialImage.alt)}">`,
      `<meta name="twitter:card" content="${socialImage.width > socialImage.height ? 'summary_large_image' : 'summary'}">`,
      `<meta name="twitter:title" content="${escapeHtml(title)}">`,
      `<meta name="twitter:description" content="${escapeHtml(description)}">`,
      `<meta name="twitter:image" content="${imageUrl}">`,
      `<meta name="twitter:image:alt" content="${escapeHtml(socialImage.alt)}">`,
    );
  }
  if (schema) tags.push(`<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>`);
  return tags.join('\n  ');
}

export function robotsTxt(origin) {
  // Keep HTML crawlable so crawlers can actually read the noindex tag on previews.
  return `User-agent: *\nAllow: /\n${origin ? `\nSitemap: ${absolute(origin, '/sitemap.xml')}\n` : ''}`;
}

export function sitemapXml(origin, pages) {
  const links = pages.filter(page => page.indexable).map(page => `  <url><loc>${escapeHtml(absolute(origin, page.route))}</loc></url>`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${links.join('\n')}\n</urlset>\n`;
}
