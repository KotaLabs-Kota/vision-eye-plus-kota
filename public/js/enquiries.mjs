import { CATEGORIES, COLORS } from './catalog.mjs';

export const TOPIC_LABELS = {
  general: 'General enquiry', 'eye-test': 'Eye test appointment', frame: 'Eyewear enquiry', wholesale: 'Wholesale enquiry',
};

export function todayInKota(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const date = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return `${date.year}-${date.month}-${date.day}`;
}

export function formatPreferredDay(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return '';
  const date = new Date(`${value}T00:00:00Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) return '';
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'long', timeZone: 'UTC' }).format(date);
}

export function contactMessage({ name, topic, date, time, message }) {
  const preferredDay = formatPreferredDay(date || '');
  return [
    `Hi Vision Eye Plus! My name is ${name.trim()}.`,
    `Topic: ${Object.hasOwn(TOPIC_LABELS, topic) ? TOPIC_LABELS[topic] : TOPIC_LABELS.general}`,
    topic === 'eye-test' && preferredDay ? `Preferred day: ${preferredDay}` : '',
    topic === 'eye-test' && time ? `Preferred time: ${time}` : '',
    message?.trim() || '',
    topic === 'eye-test' ? 'Could you confirm whether a slot is available and let me know about any fees?' : '',
  ].filter(Boolean).join('\n');
}

export const FIT_PREFERENCES = ['Not sure', 'Narrow', 'Regular', 'Wide'];
export const LENS_PREFERENCES = {
  eyeglasses: ['Help me choose', 'Single vision', 'Progressive', 'Non-prescription'],
};

export function productMessage(frame, { fit, lens } = {}, pageUrl) {
  return [
    `Hi Vision Eye Plus! I’m interested in ${frame.name} (${CATEGORIES[frame.type]}).`,
    `Colour shown: ${COLORS[frame.color].name}`,
    FIT_PREFERENCES.includes(fit) && fit !== FIT_PREFERENCES[0] ? `Fit preference: ${fit}` : '',
    LENS_PREFERENCES[frame.type].includes(lens) && lens !== LENS_PREFERENCES[frame.type][0] ? `Lens preference: ${lens}` : '',
    'Is this frame available to try or order? Could you share the current price and lens options?',
    pageUrl && `Frame: ${pageUrl}`,
  ].filter(Boolean).join('\n');
}
