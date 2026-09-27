import http from 'node:http';
import {readFile} from 'node:fs/promises';

const files = new Map([
  ['/', ['index.html', 'text/html']], ['/index.html', ['index.html', 'text/html']],
  ['/main.js', ['main.js', 'text/javascript']], ['/model.js', ['model.js', 'text/javascript']],
  ['/styles.css', ['styles.css', 'text/css']]
]);
const server = http.createServer(async (request, response) => {
  const entry = files.get((request.url || '/').split('?')[0]);
  if (!entry || !['GET', 'HEAD'].includes(request.method)) { response.writeHead(404); response.end('Not found'); return; }
  try {
    const data = await readFile(new URL(entry[0], import.meta.url));
    response.writeHead(200, {'Content-Type': `${entry[1]}; charset=utf-8`, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff'});
    response.end(request.method === 'HEAD' ? undefined : data);
  } catch { response.writeHead(500); response.end('Unable to load application'); }
});
server.on('error', error => { console.error(`Unable to start localhost:5173: ${error.message}`); process.exitCode = 1; });
server.listen(5173, '127.0.0.1', () => console.log('Smart To-Do: http://localhost:5173 (Ctrl+C to stop)'));
