import { GUESTS } from './guests.js';
export const config = { matcher: ['/', '/index.html'] };
export default function middleware(req) {
  const to = new URL(req.url).searchParams.get('to');
  if (!to || !GUESTS[to]) {
    return new Response(`<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>404</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#F3EFE6;font-family:Georgia,serif;color:#5A4A7A;text-align:center}h1{font-size:5rem;margin:0}p{color:#8a7f95}</style></head>
<body><div><h1>404</h1><p>Halaman tidak ditemukan.</p></div></body></html>`,
      { status: 404, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });
  }
}
