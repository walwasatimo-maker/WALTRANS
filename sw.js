const CACHE='waltrans-v4';
const SHELL=['./','index.html','config.js','manifest.json','icon-192.png','icon-512.png','icon-maskable-512.png','nllb-worker.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('waltrans-')&&x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET') return;
  const u=new URL(r.url);
  // App files: cache first, refreshed in the background so updates arrive on the next open
  if(u.origin===location.origin){
    e.respondWith(caches.match(r).then(hit=>{
      const net=fetch(r).then(res=>{if(res.ok){const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c))}return res}).catch(()=>hit||(r.mode==='navigate'?caches.match('index.html'):undefined));
      return hit||net;
    }));
    return;
  }
  // Code libraries used by scanning and the offline pack (model weights are cached by the library itself)
  if(u.hostname==='cdn.jsdelivr.net'||u.hostname==='cdnjs.cloudflare.com'){
    e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{if(res.ok){const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c))}return res})));
  }
});
