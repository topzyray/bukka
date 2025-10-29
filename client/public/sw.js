const CACHE_NAME = "bukka-cache-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/web-app-manifest-192x192.png",
  "/web-app-manifest-512x512.png",
  "/app/favicon.ico",
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME) return caches.delete(k);
        })
      )
    )
  );
  self.clients.claim();
});

// Basic fetch strategy:
// - For navigation and HTML: network-first
// - For static assets: cache-first
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Only handle same-origin requests here; allow others to pass through
  if (url.origin !== self.location.origin) return;

  // Navigation requests (HTML) -> network-first
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const copy = res.clone();
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(event.request, copy));
          return res;
        })
        .catch(() =>
          caches.match(event.request).then((r) => r || caches.match("/"))
        )
    );
    return;
  }

  // Static assets -> cache-first
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});

// Push event
// self.addEventListener("push", function (event) {
//   if (event.data) {
//     const data = event.data.json();
//     const options = {
//       body: data.body,
//       icon: data.icon || "web-app-manifest-192x192.png",
//       badge: "/badge.png",
//       vibrate: [100, 50, 100],
//       data: {
//         dateOfArrival: Date.now(),
//         primaryKey: "2",
//       },
//     };
//     event.waitUntil(self.registration.showNotification(data.title, options));
//   }
// });
self.addEventListener("push", (event) => {
  try {
    if (!event.data) return;
    const data = event.data.json();
    const title = data.title || "Bukka";
    const options = {
      body: data.body || "",
      icon: data.icon || "/web-app-manifest-192x192.png",
      badge: data.badge || "/badge.png",
      vibrate: data.vibrate || [100, 50, 100],
      data: {
        url: data.url || "/",
        timestamp: Date.now(),
        ...data.extra,
      },
      tag: data.tag || undefined,
      renotify: !!data.renotify,
    };
    event.waitUntil(self.registration.showNotification(title, options));
  } catch (err) {
    // fail silently so SW doesn't die
    console.error("SW push handler error:", err);
  }
});

// self.addEventListener("notificationclick", function (event) {
//   console.log("Notification click received.");
//   event.notification.close();
//   const target = data?.url || "https://buuka.vercel.app"; // TODO: Change later
//   event.waitUntil(clients.openWindow(target));
// });
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const urlToOpen = event.notification?.data?.url || "/";
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// self.addEventListener("notificationclose", (event) => {
//   // Optional analytics: send a beacon that notification was dismissed
//   navigator.sendBeacon(
//     "/api/notifications/dismiss",
//     JSON.stringify({ tag: event.notification.tag })
//   );
// });
