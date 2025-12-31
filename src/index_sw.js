// ---- Begin for activate ----
const enableNavigationPreload = async () => {
  if (self.registration.navigationPreload) {
    // Enable navigation preloads!
    await self.registration.navigationPreload.enable();
  }
};

const onActivate = (event) => { event.waitUntil(enableNavigationPreload()); };
// ---- End for activate ----

const addResourcesToCache = async (resources) => {
  const cache = await caches.open('v2');
  await cache.addAll(resources);
};

// ---- Begin for install ----
const onInstall = (event) => {
  event.waitUntil(addResourcesToCache([
    './',
    './static/css/hst-min.css',
    './static/js/hst-min.js',
  ]));
};
// ---- End for install ----

// ---- Begin for fetch ----
const isCacheableUrl = (url) => { return url.pathname == "/file"; };

const putInCache = async (request, response) => {
  const cache = await caches.open('v1');
  await cache.put(request, response);
};

const cachedFetch = async ({request, preloadResponsePromise, fallbackUrl}) => {
  // First try to get the resource from the cache
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }

  // Next try to use the preloaded response, if it's there
  const preloadResponse = await preloadResponsePromise;
  if (preloadResponse) {
    if (isCacheableUrl(URL(request.url))) {
      putInCache(request, preloadResponse.clone());
    }
    return preloadResponse;
  }

  // Next try to get the resource from the network
  try {
    const responseFromNetwork = await fetch(request);
    // response may be used only once
    // we need to save clone to put one copy in cache
    // and serve second one
    if (isCacheableUrl(URL(request.url))) {
      putInCache(request, responseFromNetwork.clone());
    }
    return responseFromNetwork;
  } catch (error) {
    const fallbackResponse = await caches.match(fallbackUrl);
    if (fallbackResponse) {
      return fallbackResponse;
    }
    // when even the fallback response is not available,
    // there is nothing we can do, but we must always
    // return a Response object
    return new Response('Network error happened', {
      status : 408,
      headers : {'Content-Type' : 'text/plain'},
    });
  }
};

const onFetch = (event) => {
  event.respondWith(cachedFetch({
    request : event.request,
    preloadResponsePromise : event.preloadResponse,
    fallbackUrl : './img/fallback.jpg',
  }));
};
// ---- End for fetch ----

self.addEventListener('activate', e => onActivate(e));
self.addEventListener('install', e => onInstall(e));
self.addEventListener('fetch', e => onFetch(e));
