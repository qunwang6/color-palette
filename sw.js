const APP_VERSION = "v1.0.0";
const CACHE_NAME = APP_VERSION + "--cache";

const INSTALL_FILES = [
  "/",
  "/index.html",
  "/favicon.ico",
  "/manifest.json",
  "/css/style.css",
  "/images/icons/icon-144x144.png",
  "/images/icons/icon-512x512.png",
  "/images/icons/icon-512x512.svg",
  "/js/app.js",
  "/js/models/ui/ColorInput.js",
  "/js/models/ui/ColorPalette.js",
  "/js/models/ui/WelcomePage.js",
  "/js/models/utils/Color.js",
  "/js/models/utils/ColorAlgorithm.js",
  "/js/models/utils/ServiceWorker.js",
];

const updateCacheFromNetwork = (event, cache) => {
  const url = event.request.url;

  fetch(event.request)
    .then((networkResponse) => {
      // Prevent chrome-extension error
      const isHttpRequest = event.request.url.startsWith("http");
      if (isHttpRequest) {
        console.log(
          `[Service Worker] resource(${url}) is updated to cache, it will be effective on next app launching.🚀`
        );
        cache.put(event.request, networkResponse.clone());
      }
    })
    .catch((error) => {
      console.log(
        `[Service Worker] No network response on URL(${url}), could not update the resource to cache.💀`
      );
    });
};

self.addEventListener("install", (event) => {
  console.log(
    `[Service Worker] Service Worker is installed.🖥️ (App version: ${APP_VERSION})`
  );

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(INSTALL_FILES))
  );
});

self.addEventListener("activate", function (event) {
  console.log(
    `[Service Worker] Service Worker is activated.🐶 (App version: ${APP_VERSION})`
  );
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key === CACHE_NAME) {
            return;
          } else {
            caches.delete(key);
            console.log(`[Service Worker] Old cache ${key} is deleted.💀`);
          }
        })
      );
    })
  );
});

// Stale-while-revalidate
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cacheResponse) => {
        updateCacheFromNetwork(event, cache);
        if (cacheResponse) {
          return cacheResponse;
        } else {
          return fetch(event.request);
        }
      });
    })
  );
});
