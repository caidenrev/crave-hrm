// Service Worker Crave HRM Enterprise PWA
const CACHE_NAME = "crave-hrm-v1";
const OFFLINE_URL = "/offline.html";

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add(OFFLINE_URL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
      .then(() => caches.open(CACHE_NAME).then((cache) => cache.add(OFFLINE_URL)))
      .catch(() => {})
      .then(() => self.clients.claim())
  );
});

// Hanya request navigasi dokumen yang ditangani: coba fetch dulu, jika gagal baru offline.html
self.addEventListener("fetch", (e) => {
  if (e.request.mode !== "navigate") return;
  e.respondWith(
    fetch(e.request).catch(async () => {
      const page = await caches.match(OFFLINE_URL);
      return (
        page ??
        new Response(
          "Crave HRM sedang offline. Periksa koneksi internet Anda lalu coba lagi.",
          { headers: { "Content-Type": "text/plain; charset=utf-8" } }
        )
      );
    })
  );
});
