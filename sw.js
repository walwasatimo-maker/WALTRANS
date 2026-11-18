// WalTrans service worker. Network first for the app's own files (so updates, including icons, show up straight away),
// with the saved copy as the fallback when offline or the network is slow.
const CACHE='waltrans-v44';
const SHELL=['./','index.html','config.js','manifest.json','icon-192.png','icon-512.png','icon-maskable-512.png','nllb-worker.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('waltrans-')&&x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
function networkFirst(r){
  return caches.open(CACHE).then(cache=>cache.match(r,{ignoreSearch:false}).then(hit=>{
    const net=fetch(r,{cache:'no-cache'}).then(res=>{if(res&&res.ok)cache.put(r,res.clone());return res});
    if(!hit)return net.catch(()=>r.mode==='navigate'?cache.match('index.html'):Response.error());
    // saved copy exists: wait up to 3 s for the network, then fall back to the saved copy
    return Promise.race([net,new Promise(res=>setTimeout(()=>res(hit),3000))]).catch(()=>hit);
  }));
}
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET') return;
  const u=new URL(r.url);
  if(u.origin===location.origin){e.respondWith(networkFirst(r));return}
  // Code libraries used by scanning and the offline pack (model weights are cached by the library itself)
  if(u.hostname==='cdn.jsdelivr.net'||u.hostname==='cdnjs.cloudflare.com'){
    e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{if(res.ok){const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c))}return res})));
  }
});
