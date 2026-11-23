export const BUSINESS = Object.freeze({
  name: 'Vision Eye Plus',
  address: 'Shop No. UG-05, Bagherwal Four Seasons',
  landmark: 'Opposite City Mall, Jhalawar Road',
  city: 'Kota',
  region: 'Rajasthan',
  postalCode: '324005',
  hours: 'Daily, 10 am–9 pm',
  opens: '10:00:00',
  closes: '21:00:00',
  phone: '+919929594560',
  phoneDisplay: '+91 99295 94560',
  // Store-specific chat contact listed separately from the Google Maps phone.
  whatsapp: '917014063286',
  instagramHandle: 'vision_eye_plus_kota',
  maps: 'https://www.google.com/maps?cid=6663549362734050113',
  directions: 'https://www.google.com/maps/dir/?api=1&destination=25.136439%2C75.8541896',
  latitude: 25.136439,
  longitude: 75.8541896,
  rating: '4.9',
  reviewCount: 239,
});

export const APPOINTMENT = '/contact/?topic=eye-test#enquiry';
export const INSTAGRAM_URL = `https://www.instagram.com/${BUSINESS.instagramHandle}/`;
export const INSTAGRAM_DM_URL = `https://ig.me/m/${BUSINESS.instagramHandle}`;

export const CATEGORIES = {
  eyeglasses: 'Eyeglasses',
};

export const AUDIENCES = { men: 'Men', women: 'Women' };
export const SHAPES = { square: 'Square', rounded: 'Rounded', rectangle: 'Rectangle', geometric: 'Geometric', aviator: 'Aviator' };
export const RIMS = { 'full-rim': 'Full rim', rimless: 'Rimless' };
export const COLORS = {
  black: { name: 'Black', hex: '#29282c' },
  navy: { name: 'Midnight Blue', hex: '#272c40' },
  'navy-silver': { name: 'Navy & Silver', hex: '#5c6988' },
  silver: { name: 'Silver', hex: '#a8a9ad' },
  gold: { name: 'Champagne Gold', hex: '#c7a878' },
  green: { name: 'Deep Green', hex: '#32463c' },
  red: { name: 'Scarlet', hex: '#c92a33' },
  grey: { name: 'Smoke Grey', hex: '#b7b6bf' },
  clear: { name: 'Clear Crystal', hex: '#e4e3e5' },
};

export const PHOTO_SIZE = { width: 1080, height: 650 };
const photoLabels = { angle: 'Angle view', front: 'Front view', folded: 'Folded view' };

// Collection edits are style suggestions, not gender or fit restrictions.
export const PRODUCTS = [
  {
    id: 'silver-aviator', name: 'Silver Aviator', shape: 'aviator', rim: 'full-rim', color: 'silver', audiences: ['men'],
    description: 'Thin silver rims, a straight brow bar and dark temple tips give this double-bridge frame a classic aviator profile.',
    views: { angle: 'Angled view of silver aviator eyeglasses with a double bridge', front: 'Front view of the thin silver aviator rims and straight brow bar' },
  },
  {
    id: 'studio-square', name: 'Studio Square', shape: 'square', rim: 'full-rim', color: 'black', audiences: ['men', 'women'],
    description: 'Soft square rims in glossy black with two small silver rivets on each corner.',
    views: { angle: 'Angled view of thick black square eyeglasses with two round rivets at each corner' },
  },
  {
    id: 'crystal-curve', name: 'Crystal Curve', shape: 'rounded', rim: 'full-rim', color: 'clear', audiences: ['women'],
    description: 'Clear rims with rounded corners and a sculpted bridge keep this frame understated from the front.',
    views: { folded: 'Clear rounded eyeglasses photographed with their translucent temples folded' },
  },
  {
    id: 'scarlet-rimless', name: 'Scarlet Rimless', shape: 'rectangle', rim: 'rimless', color: 'red', audiences: ['women'],
    description: 'A rectangular rimless front with a dark bridge and bright red temples. The colour comes from the sides rather than a rim around the lenses.',
    views: { front: 'Front view of rectangular rimless eyeglasses with bright red temples', folded: 'Red rimless eyeglasses with both temples folded behind the lenses' },
  },
  {
    id: 'midnight-square', name: 'Midnight Square', shape: 'square', rim: 'full-rim', color: 'navy', audiences: ['men'],
    description: 'An almost-black blue finish and fine square rims with softened corners. Compare the front and angle photos to see the slim bridge and temples.',
    views: { angle: 'Angled view of midnight-blue square eyeglasses with thin rims', front: 'Front view of the dark blue square rims and single bridge' },
  },
  {
    id: 'navy-silver-geo', name: 'Navy & Silver Geo', shape: 'geometric', rim: 'full-rim', color: 'navy-silver', audiences: ['men', 'women'],
    description: 'Navy edges trace the angled upper corners, with silver hardware at the bridge and along the temples.',
    views: { angle: 'Angled view of navy geometric eyeglasses with silver temples', front: 'Front view of geometric navy rims with a silver bridge', folded: 'Navy and silver geometric eyeglasses with their temples folded' },
  },
  {
    id: 'bold-black-square', name: 'Bold Black Square', shape: 'square', rim: 'full-rim', color: 'black', audiences: ['men'],
    description: 'Broad black rims with squared upper corners and a single oval silver accent on each side.',
    views: { front: 'Straight-on photo of broad black square eyeglasses with oval silver accents' },
  },
  {
    id: 'forest-rectangle', name: 'Forest Rectangle', shape: 'rectangle', rim: 'full-rim', color: 'green', audiences: ['men', 'women'],
    description: 'A deep green rectangular front with a defined brow and a slim lower rim.',
    views: { folded: 'Front of deep green rectangular eyeglasses with the temples folded' },
  },
  {
    id: 'champagne-rimless', name: 'Champagne Rimless', shape: 'rectangle', rim: 'rimless', color: 'gold', audiences: ['women'],
    description: 'Rectangular rimless lenses with champagne-coloured hardware and darker temple tips.',
    views: { angle: 'Angled view of rectangular rimless eyeglasses with champagne hardware' },
  },
  {
    id: 'smoke-square', name: 'Smoke Square', shape: 'square', rim: 'full-rim', color: 'grey', audiences: ['women'],
    description: 'Translucent grey square rims paired with slim silver-tone temples.',
    views: { angle: 'Angled view of translucent grey square eyeglasses with slim silver-tone temples' },
  },
].map(({ views, ...frame }) => ({
  type: 'eyeglasses',
  ...frame,
  photos: Object.entries(views).map(([id, alt]) => ({ id, alt, label: photoLabels[id], src: `/images/catalog/${frame.id}-${id}.webp` })),
}));

export const REVIEWS = [
  { quote: 'Very nice collection and prices are reasonable and good service', credit: 'Google Maps review' },
  { quote: 'In short my experience was very good', credit: 'Shrey B. · Google Maps' },
  { quote: 'Great service and very polite', credit: 'Ajinath P. · Google Maps' },
];

export const FIT_GUIDE = {
  round: { label: 'Round', title: 'Start with a little structure.', description: 'Square and rectangular rims can add definition to soft lines. Try a frame a similar width to your face and check that it doesn’t rest on your cheeks when you smile.', shape: 'square', icon: 'shape-round' },
  square: { label: 'Angular', title: 'Try a softer silhouette.', description: 'Rounded rims can soften an angular jawline. Try a few widths and choose the one that feels stable without squeezing.', shape: 'rounded', icon: 'shape-square' },
  oval: { label: 'Oval', title: 'Play with proportion.', description: 'Start with a frame as wide as the broadest part of your face. A rectangle can add contrast, while a bolder rim makes the eyewear more of a feature.', shape: 'rectangle', icon: 'shape-oval' },
};

export const CONTACT_FAQS = [
  ['Where exactly is the shop?', 'We’re at Shop No. UG-05, Bagherwal Four Seasons, on Jhalawar Road opposite City Mall in Kota. Use the directions link above for the storefront pin.'],
  ['Can I request an eye test?', 'Yes. Call the store or use the eye test option in the enquiry form. Ask the team to confirm availability, any fees, and the time before you travel.'],
  ['Can I buy these frames online?', 'There is no online checkout. Open a frame and call, WhatsApp, or message the shop on Instagram to confirm availability, pricing, lenses and how to order.'],
  ['Can I bring my own prescription?', 'Bring your current prescription and glasses, if you have them. The store can help you discuss suitable frames and lenses in person.'],
  ['Can I enquire about wholesale eyewear?', 'The Kota store is listed as an optical wholesaler. Call or choose Wholesale enquiry in the form to ask about current ranges and terms.'],
];

export const EYE_FAQS = [
  ['What should I bring to an eye checkup?', 'Bring any current glasses and a recent prescription if you have one. It can also help to tell the team what you use your glasses for most often, such as study, screens, or driving.'],
  ['Is my appointment confirmed online?', 'No. This site prepares a WhatsApp request or lets you call the shop. The team confirms the time and any fees directly.'],
  ['Can I choose frames during my visit?', 'Yes, you can browse and try frames in the store. Ask which lens options suit your prescription, the cost, and how long your pair may take.'],
];

export const categoryHref = type => `/shop/${type}/`;
export const productHref = id => `/shop/${id}/`;
export const collectionHref = audience => `/shop/${audience}/`;
export const featuredFrames = (audience = '') => PRODUCTS.filter(frame => !audience || frame.audiences.includes(audience)).slice(0, 4);

export const whatsappLink = message => `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`;

export const CATALOGUE_FILTERS = {
  type: CATEGORIES,
  shape: SHAPES,
  color: Object.fromEntries(Object.entries(COLORS).map(([key, value]) => [key, value.name])),
  rim: RIMS,
  sort: { featured: 'Featured', 'name-asc': 'Name: A to Z', 'name-desc': 'Name: Z to A' },
};

export function frameSearchText(frame) {
  return [frame.name, frame.id, CATEGORIES[frame.type], 'optical prescription glasses specs', SHAPES[frame.shape], RIMS[frame.rim], COLORS[frame.color].name, ...frame.audiences.map(audience => AUDIENCES[audience]), frame.description].join(' ').toLowerCase();
}

export function parseFilters(params) {
  const out = { q: (params.get('q') || '').trim().slice(0, 80) };
  for (const [key, options] of Object.entries(CATALOGUE_FILTERS)) {
    const term = params.get(key);
    out[key] = Object.hasOwn(options, term) ? term : key === 'sort' ? 'featured' : '';
  }
  return out;
}

export function filterFrames(frames, { q = '', type, shape, color, rim, sort } = {}) {
  const words = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const matches = frames.filter(frame => {
    if (type && frame.type !== type || shape && frame.shape !== shape || rim && frame.rim !== rim || color && frame.color !== color) return false;
    const fields = frameSearchText(frame);
    return words.every(word => Object.hasOwn(AUDIENCES, word) ? frame.audiences.includes(word) : fields.includes(word));
  });
  if (sort === 'name-asc' || sort === 'name-desc') {
    const sign = sort === 'name-asc' ? 1 : -1;
    matches.sort((a, b) => sign * a.name.localeCompare(b.name, 'en-IN'));
  }
  return matches;
}
