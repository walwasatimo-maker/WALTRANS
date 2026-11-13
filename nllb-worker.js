// Optional offline translation pack: NLLB-200 (distilled, 600M) running on-device via Transformers.js.
let translator=null, loading=null;
async function load(){
  if(translator) return translator;
  if(loading) return loading;
  loading=(async()=>{
    const {pipeline,env}=await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.4.0');
    env.allowLocalModels=false;
    const files={};
    translator=await pipeline('translation','Xenova/nllb-200-distilled-600M',{
      dtype:'q8',
      progress_callback:p=>{
        if(p.status==='progress'&&p.total){files[p.file]={l:p.loaded,t:p.total};let l=0,t=0;for(const f of Object.values(files)){l+=f.l;t+=f.t}self.postMessage({type:'progress',loaded:l,total:t})}
      }
    });
    return translator;
  })();
  try{return await loading}finally{loading=null}
}
self.onmessage=async e=>{
  const m=e.data;
  try{
    if(m.type==='load'){await load();self.postMessage({type:'ready'})}
    else if(m.type==='translate'){
      const t=await load();
      const out=await t(m.text,{src_lang:m.src,tgt_lang:m.tgt,max_new_tokens:Math.min(512,Math.max(48,m.text.length*2))});
      self.postMessage({type:'result',id:m.id,text:out[0].translation_text});
    }
  }catch(err){self.postMessage({type:'error',id:m.id,message:String((err&&err.message)||err)})}
};
