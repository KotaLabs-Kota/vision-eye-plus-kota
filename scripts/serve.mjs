import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('../dist', import.meta.url)));
const port = Number(process.env.PORT || 4173);
const mime = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

createServer(async (request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }
  let status = 200;
  let path;
  let body;
  try {
    const url = new URL(request.url, 'http://local.invalid');
    path = resolve(root, `.${decodeURIComponent(url.pathname)}`);
    if (path !== root && !path.startsWith(`${root}${sep}`)) throw new Error('Invalid path');
    if ((await stat(path)).isDirectory()) {
      if (!url.pathname.endsWith('/')) {
        response.writeHead(308, { Location: `${url.pathname}/${url.search}` }).end();
        return;
      }
      path = join(path, 'index.html');
    }
    body = await readFile(path);
  } catch {
    status = 404;
    path = join(root, '404.html');
    body = await readFile(path).catch(() => 'Page not found');
  }
  response.writeHead(status, { 'Content-Type': mime[extname(path)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
  response.end(request.method === 'HEAD' ? undefined : body);
}).listen(port, '0.0.0.0', () => console.log(`Vision Eye Plus is running on port ${port}`));
