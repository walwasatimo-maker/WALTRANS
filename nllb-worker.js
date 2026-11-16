// Optional offline translation pack: NLLB-200 (distilled, 600M, 8-bit) running on-device via Transformers.js.
// Long text is split into sentences (NLLB is a sentence-level model) and stitched back together.
let translator=null, loading=null;
async function load(){
  if(translator) return translator;
  if(loading) return loading;
  loading=(async()=>{
    const {pipeline,env}=await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.4.0');
    env.allowLocalModels=false; env.useBrowserCache=true;
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
function segment(text){
  const out=[];
  for(const line of text.split(/\n/)){
    if(!line.trim()){out.push({text:'',br:true});continue}
    const parts=line.match(/[^.!?。！？]+[.!?。！？]*\s*/g)||[line];
    parts.forEach((p,i)=>out.push({text:p.trim(),br:i===parts.length-1}));
  }
  return out;
}
self.onmessage=async e=>{
  const m=e.data;
  try{
    if(m.type==='load'){await load();self.postMessage({type:'ready'})}
    else if(m.type==='translate'){
      const t=await load();let result='';
      for(const s of segment(m.text)){
        if(s.text){const [o]=await t(s.text,{src_lang:m.src,tgt_lang:m.tgt,max_new_tokens:256,num_beams:1});result+=o.translation_text}
        result+=s.br?'\n':' ';
      }
      self.postMessage({type:'result',id:m.id,text:result.trim()});
    }
  }catch(err){self.postMessage({type:'error',id:m.id,message:String((err&&err.message)||err)})}
};
