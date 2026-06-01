const CACHE = 'tardes-de-te-v1';

const PRECACHE = [
  '/admin.html',
  '/manifest.json',
  '/icon@2x.png',
  '/logo.png',
  '/cami.png',
  '/desayuno-vector.png',
  '/lunchs-vector.png',
  '/saladitos-vector.png',
  '/tortas-vector.png',
];

// Hosts que nunca se cachean (API calls, auth, storage)
const BYPASS_HOSTS = ['supabase.co', 'supabase.io', 'googleapis.com'];

// ── Install: precachea los assets clave ──────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      cache.addAll(PRECACHE.map((url) => new Request(url, { cache: 'reload' })))
    )
  );
  self.skipWaiting();
});

// ── Activate: limpia versiones anteriores del caché ──────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ── Fetch: estrategia según tipo de recurso ───────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo interceptamos GET sobre http/https
  if (request.method !== 'GET') return;
  if (!url.protocol.startsWith('http')) return;

  // Dejamos pasar las llamadas a APIs externas sin tocar
  if (BYPASS_HOSTS.some((host) => url.hostname.includes(host))) return;

  if (request.destination === 'document') {
    // HTML → network-first: siempre intenta traer el más reciente
    event.respondWith(networkFirst(request));
  } else {
    // Assets (imágenes, JS, CSS, fuentes) → cache-first: más rápido
    event.respondWith(cacheFirst(request));
  }
});

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached ?? Response.error();
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return Response.error();
  }
}
