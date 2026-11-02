// Only public application assets are requested over HTTP. Personal records stay in IndexedDB.
const CACHE='samaya-browser-20261102-v1';
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(['./','./index.html'])).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('samaya-browser-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url),scope=new URL(self.registration.scope);
 if(req.method!=='GET'||url.origin!==scope.origin||!url.pathname.startsWith(scope.pathname))return;
 if(req.mode==='navigate'){
  event.respondWith(fetch(req).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put('./index.html',copy)).catch(()=>{})}return response}).catch(()=>caches.match('./index.html')));return;
 }
 event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(response=>{if(response.ok&&response.status!==206){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(req,copy)).catch(()=>{})}return response})));
});
