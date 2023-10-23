const addResourcesToCache = async (resources) => {
    const cache = await caches.open("v1");
    await cache.addAll(resources);
};

self.addEventListener("install", (event) => {
    event.waitUntil(
        addResourcesToCache([
            "./",
            "./sw.js",
            "./index.html",
            "./styles.css",
            "./jquery.js",
            "./app.js",
            "./countdown.js",
            "./interact.js",
            "./events.json",
            "./icons/close.svg",
            "./icons/fullscreen.svg",
            "./icons/fullscreenclose.svg",
            "./icons/favicon.png"
        ]),
    );
});

const cacheFirst = async (request) => {
    const responseFromCache = await caches.match(request);
    if (responseFromCache) {
      return responseFromCache;
    }
    return fetch(request);
  };
  
  self.addEventListener("fetch", (event) => {
    event.respondWith(cacheFirst(event.request));
  });