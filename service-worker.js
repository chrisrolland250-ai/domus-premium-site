const CACHE_NAME='domus-premium-v1';
const ASSETS=[
'/', '/index.html',
'/assets/meta/og-image-1200x630.jpg',
'/assets/meta/twitter-card-1200x630.jpg',
'/assets/meta/apple-touch-icon.png',
'/assets/meta/favicon-32x32.png',
'/assets/meta/favicon-16x16.png'
];
self.addEventListener('install',e=>{
e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)));
});
self.addEventListener('activate',e=>{
e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE_NAME&&caches.delete(k)))));
});
self.addEventListener('fetch',e=>{
const req=e.request;
e.respondWith(
caches.match(req).then(res=>res||fetch(req).then(r=>{
const copy=r.clone();
caches.open(CACHE_NAME).then(c=>c.put(req,copy));
return r;
}).catch(()=>res))
);
});