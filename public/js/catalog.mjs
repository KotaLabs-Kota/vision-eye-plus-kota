export const BUSINESS = Object.freeze({
  name: 'Vision Eye Plus',
  address: 'Shop No. UG-05, Bagherwal Four Seasons',
  landmark: 'Opposite City Mall, Jhalawar Road',
  cityLine: 'Kota, Rajasthan 324005',
  hours: 'Daily, 10 am–9 pm',
  phone: '+919929594560',
  phoneDisplay: '+91 99295 94560',
  // Store-specific chat contact listed separately from the Google Maps phone.
  whatsapp: '917014063286',
  maps: 'https://www.google.com/maps?cid=6663549362734050113',
  directions: 'https://www.google.com/maps/dir/?api=1&destination=25.136439%2C75.8541896',
  latitude: 25.136439,
  longitude: 75.8541896,
  rating: '4.9',
  reviewCount: 239,
});

export const APPOINTMENT = '/contact/?topic=eye-test#enquiry';

export const CATEGORIES = {
  eyeglasses: 'Eyeglasses',
  sunglasses: 'Sunglasses',
};

export const SHAPES = { square: 'Square', round: 'Round', rectangle: 'Rectangle', 'cat-eye': 'Cat-eye', aviator: 'Aviator' };
export const MATERIALS = { acetate: 'Acetate', metal: 'Metal' };
export const COLORS = {
  black: { name: 'Ink Black', hex: '#27252c' },
  tortoise: { name: 'Honey Tortoise', hex: '#9d6039' },
  gold: { name: 'Champagne Gold', hex: '#c6a570' },
  silver: { name: 'Brushed Silver', hex: '#a8a9ae' },
  lilac: { name: 'Soft Lilac', hex: '#c3b1d7' },
  clear: { name: 'Clear Crystal', hex: '#ece1d6' },
  gunmetal: { name: 'Gunmetal', hex: '#646573' },
};

export const PRODUCTS = [
  {
    id: 'regent', name: 'The Regent', type: 'eyeglasses', shape: 'square', material: 'acetate', colors: ['black', 'tortoise', 'clear'],
    alt: 'Glossy black acetate eyeglasses with softly square rims',
    description: 'A softly squared silhouette with a confident, thicker rim. A good reference if you like the look of classic black frames but want a little more character at the bridge.',
  },
  {
    id: 'boulevard', name: 'The Boulevard', type: 'eyeglasses', shape: 'round', material: 'metal', colors: ['gold', 'silver', 'black'],
    alt: 'Fine champagne-gold metal eyeglasses with round rims',
    description: 'Fine metal rims, a rounded profile and a quiet champagne finish. A lighter-looking frame for anyone who wants their glasses to do a little less talking.',
  },
  {
    id: 'solstice', name: 'The Solstice', type: 'sunglasses', shape: 'cat-eye', material: 'acetate', colors: ['tortoise', 'black'],
    alt: 'Tortoiseshell cat-eye sunglasses with dark brown lenses',
    description: 'An upswept outer corner and a warm tortoiseshell pattern. Bring this reference if you want a bold sun frame without a dramatically pointed cat-eye shape.',
  },
  {
    id: 'arcade', name: 'The Arcade', type: 'eyeglasses', shape: 'rectangle', material: 'acetate', colors: ['lilac', 'clear', 'black'],
    alt: 'Translucent lilac rectangular acetate eyeglasses',
    description: 'Clean rectangular lines meet a translucent lilac finish. A playful alternative to darker acetate with enough structure to work as an everyday pair.',
  },
  {
    id: 'meridian', name: 'The Meridian', type: 'eyeglasses', shape: 'rectangle', material: 'metal', colors: ['gunmetal', 'silver'],
    alt: 'Matte gunmetal rectangular eyeglasses with thin metal rims',
    description: 'A neutral, low-profile rectangle with pared-back metal rims. Use it as a reference if you prefer straight lines and understated hardware.',
  },
  {
    id: 'afterlight', name: 'The Afterlight', type: 'sunglasses', shape: 'aviator', material: 'metal', colors: ['gold', 'gunmetal'],
    alt: 'Gold aviator sunglasses with a double bridge and brown lenses',
    description: 'A double bridge, relaxed oversized lenses and a warm gradient tint. A vintage-inspired starting point for finding your next sun frame.',
  },
];

export const REVIEWS = [
  { quote: 'Very nice collection and prices are reasonable and good service', credit: 'Google Maps review' },
  { quote: 'In short my experience was very good', credit: 'Shrey B. · Google Maps' },
  { quote: 'Great service and very polite', credit: 'Ajinath P. · Google Maps' },
];

export const FIT_GUIDE = {
  round: { label: 'Round', title: 'Start with a little structure.', description: 'Square and rectangular rims can add definition to soft lines. Try a frame a similar width to your face and check that it doesn’t rest on your cheeks when you smile.', shape: 'square', icon: 'shape-round' },
  square: { label: 'Angular', title: 'Try a softer silhouette.', description: 'Curved metal rims and gentle round shapes can soften an angular jawline. Try a few widths and choose the one that feels stable without squeezing.', shape: 'round', icon: 'shape-square' },
  oval: { label: 'Oval', title: 'Play with proportion.', description: 'Start with a frame as wide as the broadest part of your face. A rectangle can add contrast, while a bolder rim makes the eyewear more of a feature.', shape: 'rectangle', icon: 'shape-oval' },
};

export const CONTACT_FAQS = [
  ['Where exactly is the shop?', 'We’re at Shop No. UG-05, Bagherwal Four Seasons, on Jhalawar Road opposite City Mall in Kota. Use the directions link above for the storefront pin.'],
  ['Can I request an eye test?', 'Yes. Call the store or use the eye test option in the enquiry form. Ask the team to confirm availability, any fees, and the time before you travel.'],
  ['Can I buy these frames online?', 'There is no online checkout. The frame previews are examples to help you describe what you like. Ask the store for current stock, prices, lens options, and pickup details.'],
  ['Can I bring my own prescription?', 'Bring your current prescription and glasses, if you have them. The store can help you discuss suitable frames and lenses in person.'],
  ['Can I enquire about wholesale eyewear?', 'The Kota store is listed as an optical wholesaler. Call or choose Wholesale enquiry in the form to ask about current ranges and terms.'],
];

export const EYE_FAQS = [
  ['What should I bring?', 'Bring any current glasses and a recent prescription if you have one. It can also help to tell the team what you use your glasses for most often, such as study, screens, or driving.'],
  ['Is my appointment confirmed online?', 'No. This site prepares a WhatsApp request or lets you call the shop. The team confirms the time and any fees directly.'],
  ['Can I choose frames during my visit?', 'Yes, you can browse and try frames in the store. Ask which lens options suit your prescription, the cost, and how long your pair may take.'],
];

export const productHref = id => `/shop/${id}/`;
export const productImage = id => `/images/${id}.webp`;
export const whatsappLink = message => `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`;

export const CATALOGUE_FILTERS = {
  type: CATEGORIES,
  shape: SHAPES,
  color: Object.fromEntries(Object.entries(COLORS).map(([key, value]) => [key, value.name])),
  material: MATERIALS,
  sort: { featured: 'Featured', 'name-asc': 'Name: A to Z', 'name-desc': 'Name: Z to A' },
};

export function frameSearchText(frame) {
  return [frame.name, frame.id, CATEGORIES[frame.type], frame.type === 'eyeglasses' ? 'optical prescription glasses specs' : 'sun shades', SHAPES[frame.shape], MATERIALS[frame.material], ...frame.colors.map(color => COLORS[color].name), frame.description].join(' ').toLowerCase();
}

export function parseFilters(params) {
  const out = { q: (params.get('q') || '').trim().slice(0, 80) };
  for (const [key, options] of Object.entries(CATALOGUE_FILTERS)) {
    const term = params.get(key);
    out[key] = Object.hasOwn(options, term) ? term : key === 'sort' ? 'featured' : '';
  }
  return out;
}

export function filterFrames(frames, { q = '', type, shape, color, material, sort } = {}) {
  const words = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const matches = frames.filter(frame => {
    if (type && frame.type !== type || shape && frame.shape !== shape || material && frame.material !== material || color && !frame.colors.includes(color)) return false;
    const fields = frameSearchText(frame);
    return words.every(word => fields.includes(word));
  });
  if (sort === 'name-asc' || sort === 'name-desc') {
    const sign = sort === 'name-asc' ? 1 : -1;
    matches.sort((a, b) => sign * a.name.localeCompare(b.name, 'en-IN'));
  }
  return matches;
}
