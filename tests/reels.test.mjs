import { test } from 'node:test';
import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import { home } from '../src/home.mjs';
import { REELS } from '../src/reels.mjs';
import { videoRange } from '../scripts/video-response.mjs';

test('the homepage uses the uploaded reels in numerical order and links to Instagram afterward', async () => {
  const html = home();
  const videos = [...html.matchAll(/<video\b[^>]*src="([^"]+)"[^>]*>/g)];
  const expected = [1, 2, 3, 4].map(number => `/video%20${number}.mp4`);
  assert.deepEqual(videos.map(([, src]) => src), expected);
  for (const [markup] of videos) {
    assert.match(markup, /\bcontrols playsinline muted preload="none"/);
    assert.doesNotMatch(markup, /\bautoplay\b/);
  }
  assert.match(html, /class="reels-more"[\s\S]*?For more reels, visit us on Instagram\.[\s\S]*?href="https:\/\/www\.instagram\.com\/vision_eye_plus_kota\/"/);
  for (const { file, poster } of REELS) {
    await access(new URL(`../public/${encodeURIComponent(file)}`, import.meta.url));
    await access(new URL(`../public/images/${poster}`, import.meta.url));
  }
});

test('preview video ranges support seeking and reject unsatisfiable requests', () => {
  assert.deepEqual(videoRange('bytes=0-1', 100), { start: 0, end: 1 });
  assert.deepEqual(videoRange('bytes=40-', 100), { start: 40, end: 99 });
  assert.deepEqual(videoRange('bytes=90-150', 100), { start: 90, end: 99 });
  assert.deepEqual(videoRange('bytes=-8', 100), { start: 92, end: 99 });
  for (const header of ['bytes=100-', 'bytes=20-10', 'bytes=-0', 'bytes=-', 'items=0-5']) {
    assert.equal(videoRange(header, 100), null);
  }
});
