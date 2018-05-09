/*eslint-disable */

var version = 'v003';
var staticCacheName = 'fr-uniqlo-' + version;

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        '/favicon.ico',
        '/fonts/unico.woff',
        '/fonts/UniqloProRegular.woff',
        '/fonts/fontIcons.woff'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  var request = event.request,
      requestURL = new URL(event.request.url),
      pathname = requestURL.pathname,
      shouldCache = pathname.match(/\.(jpe?g|png|gif|woff2?|js|css)$/i),
      shouldNeverCache = pathname.match(/(api|graphql|sw)$/i)

  event.respondWith(
    caches.match(request)
      .catch(() => {
        return fetch(request);
      })
      .then(response => {
        if (response) {
          return response;
        }

        var fetchRequest = request.clone();

        return fetch(fetchRequest)
          .then(fetchResp => {
            if(shouldNeverCache || !shouldCache || !fetchResp || fetchResp.status !== 200 || fetchResp.type !== 'basic') {
              return fetchResp;
            }


            var responseToCache = fetchResp.clone();
            caches.open(staticCacheName)
              .then(cache => cache.put(request, responseToCache));

            return fetchResp;
          }
        );
      })
  );
});

this.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key.indexOf(version) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});
