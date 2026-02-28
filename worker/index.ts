/// <reference lib="webworker" />
export {};

const sw = self as unknown as ServiceWorkerGlobalScope;

// On activate, clear all old caches so users always get fresh content
sw.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Workbox precache names include a revision hash, so old ones
          // are automatically stale after a new build
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// Listen for SKIP_WAITING message from the client to force activate
sw.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    sw.skipWaiting();
  }
});

sw.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options: NotificationOptions = {
    body: data.body,
    icon: "/icons/icon-192x192.svg",
    badge: "/icons/icon-192x192.svg",
    tag: data.tag || "expiry-alert",
    data: { url: data.url || "/" },
  };

  event.waitUntil(
    sw.registration.showNotification(data.title, options)
  );
});

sw.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    sw.clients.matchAll({ type: "window" }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(url) && "focus" in client) {
          return client.focus();
        }
      }
      return sw.clients.openWindow(url);
    })
  );
});
