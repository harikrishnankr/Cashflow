const STATIC_CACHE = "cashflow-static-v1";
const PAGES_CACHE = "cashflow-pages-v1";

const PRECACHE_PAGES = ["/login", "/register", "/dashboard", "/offline"];

// Install: precache essential pages
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(PAGES_CACHE)
      .then((cache) =>
        cache.addAll(PRECACHE_PAGES).catch(() => {
          // Silently ignore precache failures (e.g. pages that redirect)
        })
      )
      .then(() => self.skipWaiting())
  );
});

// Activate: remove stale caches and claim clients immediately
self.addEventListener("activate", (event) => {
  const KNOWN_CACHES = new Set([STATIC_CACHE, PAGES_CACHE]);
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) => !KNOWN_CACHES.has(name))
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Fetch: apply caching strategies per request type
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin GET requests; skip API routes
  if (
    request.method !== "GET" ||
    url.origin !== self.location.origin ||
    url.pathname.startsWith("/api/")
  ) {
    return;
  }

  // Static assets (JS bundles, CSS, images, fonts) — cache-first
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.match(/\.(js|css|png|jpg|jpeg|webp|avif|svg|ico|woff2|woff)$/)
  ) {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request).then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          });
        })
      )
    );
    return;
  }

  // App pages — network-first, fall back to cache, then /offline
  event.respondWith(
    caches.open(PAGES_CACHE).then((cache) =>
      fetch(request)
        .then((response) => {
          if (response.ok) cache.put(request, response.clone());
          return response;
        })
        .catch(() =>
          cache.match(request).then(
            (cached) =>
              cached ||
              cache.match("/offline") ||
              new Response("Offline", { status: 503 })
          )
        )
    )
  );
});

// Push notifications
self.addEventListener("push", (event) => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title ?? "CashFlow", {
      body: data.body,
      icon: "/icon-192x192.png",
      badge: "/icon-192x192.png",
      vibrate: [100, 50, 100],
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        const existing = clientList.find((c) => c.focus);
        if (existing) return existing.focus();
        return clients.openWindow("/dashboard");
      })
  );
});
