const CACHE_NAME = 'stylesync-v1';
const STATIC_CACHE = 'stylesync-static-v1';
const API_CACHE = 'stylesync-api-v1';

// Static assets to pre-cache (Cache First)
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/favicon.ico'
];

// Install: Pre-cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Pre-caching static assets');
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== API_CACHE && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: Apply caching strategies based on request type
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Strategy 1: Cache First — static assets (JS, CSS, images, fonts)
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Strategy 2: Network First — API calls
  if (isApiRequest(url)) {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }

  // Strategy 3: Stale-While-Revalidate — HTML navigation
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(staleWhileRevalidate(request, CACHE_NAME));
    return;
  }

  // Default: Network with cache fallback
  event.respondWith(networkFirst(request, CACHE_NAME));
});

// --- Caching Strategies ---

// Cache First: Serve from cache, fallback to network
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return offlineFallback();
  }
}

// Network First: Try network, fallback to cache
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || offlineFallback();
  }
}

// Stale-While-Revalidate: Serve cache immediately, update in background
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached || offlineFallback());

  return cached || fetchPromise;
}

// --- Helpers ---

function isStaticAsset(url) {
  return /\.(js|css|png|jpg|jpeg|svg|gif|webp|woff2?|ttf|eot|ico)(\?.*)?$/.test(url.pathname);
}

function isApiRequest(url) {
  return url.pathname.startsWith('/api') ||
    url.hostname.includes('supabase') ||
    url.hostname.includes('lovable');
}

function offlineFallback() {
  return caches.match('/') || new Response(
    `<!DOCTYPE html>
    <html lang="es">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
    <title>StyleSync - Sin conexión</title>
    <style>
      body{font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#faf8f6;color:#3d2f2f;text-align:center;padding:1rem}
      .offline{max-width:400px}
      h1{font-size:1.5rem;margin-bottom:.5rem}
      p{color:#7a6b6b;margin-bottom:1.5rem}
      button{background:linear-gradient(135deg,#d94a6b,#e87461);color:#fff;border:none;padding:.75rem 2rem;border-radius:.75rem;font-size:1rem;cursor:pointer}
    </style></head>
    <body><div class="offline">
      <h1>✂️ Sin conexión</h1>
      <p>No tienes conexión a internet. Revisa tu red e intenta de nuevo.</p>
      <button onclick="location.reload()">Reintentar</button>
    </div></body></html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}
