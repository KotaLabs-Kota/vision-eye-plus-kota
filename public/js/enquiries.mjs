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

export function productMessage(frame, { color, fit, lens }, pageUrl) {
  const colourName = frame.colors.includes(color) ? COLORS[color].name : COLORS[frame.colors[0]].name;
  return [
    `Hi Vision Eye Plus! I’m interested in a frame like ${frame.name} (${CATEGORIES[frame.type]}).`,
    `Colour preference: ${colourName}`,
    `Fit preference: ${fit || 'Not sure'}`,
    `Lens preference: ${lens || 'Help me choose'}`,
    'Could you share similar styles, prices, and availability for a try-on?',
    pageUrl && `Style reference: ${pageUrl}`,
  ].filter(Boolean).join('\n');
}
