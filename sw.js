const CACHE='waltrans-v2';
const SHELL=['./','index.html','manifest.json','icon.svg','icon-192.png','icon-512.png','nllb-worker.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET') return;
  const u=new URL(r.url);
  // App files: cache first, refresh in background
  if(u.origin===location.origin){
    e.respondWith(caches.match(r).then(hit=>{
      const net=fetch(r).then(res=>{if(res.ok){const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c))}return res}).catch(()=>hit||(r.mode==='navigate'?caches.match('index.html'):undefined));
      return hit||net;
    }));
    return;
  }
  // Library files for the optional offline pack (code + wasm only; model weights are cached by the library itself)
  if(u.hostname==='cdn.jsdelivr.net'){
    e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{if(res.ok){const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c))}return res})));
  }
});
