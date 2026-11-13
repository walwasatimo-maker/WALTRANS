// OPTIONAL. Only needed if your browser blocks direct calls to api.sunbird.ai (a "CORS" error).
// Deploy as a free Cloudflare Worker, then paste its URL into WalTrans > Settings > "API address".
export default {
  async fetch(req){
    const origin=req.headers.get('Origin')||'*';
    const cors={'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Headers':'authorization,content-type','Access-Control-Allow-Methods':'GET,POST,OPTIONS','Vary':'Origin'};
    if(req.method==='OPTIONS') return new Response(null,{status:204,headers:cors});
    const u=new URL(req.url);
    const h=new Headers(req.headers); h.delete('origin'); h.delete('host');
    const r=await fetch('https://api.sunbird.ai'+u.pathname+u.search,{method:req.method,headers:h,body:['GET','HEAD'].includes(req.method)?undefined:req.body});
    const out=new Response(r.body,r); for(const [k,v] of Object.entries(cors)) out.headers.set(k,v);
    return out;
  }
}
