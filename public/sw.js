const CACHE_META = "cashflow-meta";
const STATIC_CACHE = "cashflow-static-v1";
const PAGES_CACHE = "cashflow-pages-v1";

const PRECACHE_PAGES = ["/login", "/register", "/dashboard", "/offline"];

// ─── Deployment detection ─────────────────────────────────────────────────────
//
// Next.js writes a /_next/BUILD_ID file on every production build.
// We persist the last-seen build ID in CACHE_META and compare on each page
// navigation. When it changes, we evict the content caches so the next
// static-asset requests go straight to the network.

let lastCheckAt = 0;
const CHECK_INTERVAL_MS = 60_000; // at most once per minute

async function detectNewDeployment() {
  const now = Date.now();
  if (now - lastCheckAt < CHECK_INTERVAL_MS) return;
  lastCheckAt = now;

  try {
    const res = await fetch("/_next/BUILD_ID", { cache: "no-store" });
    if (!res.ok) return;
    const current = (await res.text()).trim();

    const meta = await caches.open(CACHE_META);
    const prev = await meta.match("build-id").then((r) => (r ? r.text() : null));

    if (prev !== null && prev !== current) {
      // New deployment detected — evict content caches.
      // Pages use network-first so the current response is already fresh.
      // Static assets are content-hashed so new URLs will be cache misses;
      // we delete the cache to also reclaim storage from old hashed entries.
      await Promise.all([caches.delete(STATIC_CACHE), caches.delete(PAGES_CACHE)]);
    }

    meta.put("build-id", new Response(current));
  } catch {
    // Ignore — offline or local dev (no /_next/BUILD_ID)
  }
}

// ─── Install ──────────────────────────────────────────────────────────────────

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(PAGES_CACHE)
      .then((cache) => cache.addAll(PRECACHE_PAGES).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

// ─── Activate ─────────────────────────────────────────────────────────────────

self.addEventListener("activate", (event) => {
  const KNOWN = new Set([STATIC_CACHE, PAGES_CACHE, CACHE_META]);
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(names.filter((n) => !KNOWN.has(n)).map((n) => caches.delete(n)))
      )
      .then(() => detectNewDeployment())
      .then(() => self.clients.claim())
  );
});

// ─── Fetch ────────────────────────────────────────────────────────────────────

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin GETs; pass API calls straight through
  if (
    request.method !== "GET" ||
    url.origin !== self.location.origin ||
    url.pathname.startsWith("/api/")
  ) {
    return;
  }

  // /_next/static/* — content-hashed by Next.js, safe to cache forever
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request).then((res) => {
            if (res.ok) cache.put(request, res.clone());
            return res;
          });
        })
      )
    );
    return;
  }

  // App pages — network-first; detect deployments in the background
  event.respondWith(
    caches.open(PAGES_CACHE).then((cache) =>
      fetch(request)
        .then((res) => {
          if (res.ok) {
            cache.put(request, res.clone());
            detectNewDeployment(); // fire-and-forget
          }
          return res;
        })
        .catch(() =>
          cache
            .match(request)
            .then(
              (cached) =>
                cached ||
                cache.match("/offline") ||
                new Response("Offline", { status: 503 })
            )
        )
    )
  );
});

// ─── Push notifications ───────────────────────────────────────────────────────

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
