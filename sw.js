/* Rx Clinical AI Agent — Service Worker
   Strategy: cache-first for app shell, network-first for API calls.
   Bump CACHE_NAME on every release so users get the new version. */
const CACHE_NAME = 'rx-agent-v2';

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(['./', './index.html']).catch(() => {}))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const isAPI = url.hostname.includes('googleapis.com') ||
                url.hostname.includes('mahmoudfalous.workers.dev');
  if (event.request.method !== 'GET' || isAPI) return; /* never cache API calls */

  event.respondWith(
    caches.match(event.request).then(cached => {
      const fetched = fetch(event.request).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone)).catch(() => {});
        }
        return res;
      }).catch(() => cached || caches.match('./index.html'));
      return cached || fetched;
    })
  );
});
