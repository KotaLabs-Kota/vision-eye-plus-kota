import { createReadStream } from 'node:fs';

export function videoRange(header, size) {
  const match = /^bytes=(\d*)-(\d*)$/i.exec(header);
  if (!match || (!match[1] && !match[2])) return null;
  // A suffix length asks for the trailing N bytes, not a starting offset.
  const start = match[1] ? Number(match[1]) : Math.max(0, size - Number(match[2]));
  const end = match[1] && match[2] ? Math.min(size - 1, Number(match[2])) : size - 1;
  return Number.isSafeInteger(start) && start <= end && start < size ? { start, end } : null;
}

export function sendVideo(request, response, path, size) {
  const headers = { 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-cache', 'Content-Type': 'video/mp4' };
  const range = request.method === 'GET' && request.headers.range;
  const bounds = range ? videoRange(range, size) : undefined;
  if (range && !bounds) {
    response.writeHead(416, { ...headers, 'Content-Range': `bytes */${size}`, 'Content-Length': 0 }).end();
    return;
  }
  if (bounds) headers['Content-Range'] = `bytes ${bounds.start}-${bounds.end}/${size}`;
  headers['Content-Length'] = bounds ? bounds.end - bounds.start + 1 : size;
  response.writeHead(bounds ? 206 : 200, headers);
  if (request.method === 'HEAD' || size === 0) {
    response.end();
    return;
  }
  const stream = createReadStream(path, bounds);
  stream.on('error', error => response.destroy(error));
  response.on('close', () => stream.destroy());
  stream.pipe(response);
}
