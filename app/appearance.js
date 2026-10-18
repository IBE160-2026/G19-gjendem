export const appearanceKey='smart-todo.appearance.v1';
export const defaultAppearance={version:1,background:'#f5f6f8',calendar:'#ffffff',days:'#ffffff',image:'',gridImage:''};
export function parseAppearance(raw) {
  if(raw===null)return {...defaultAppearance};
  const value=JSON.parse(raw);
  if(!value || value.version!==1 || !['background','calendar','days'].every(k=>/^#[0-9a-f]{6}$/i.test(value[k])) || typeof value.image!=='string' || value.image.length>1500000 || (value.image!==''&&!/^data:image\/jpeg;base64,[A-Za-z0-9+/]+=*$/.test(value.image)))throw Error('Ugyldig lagret utseende. Velg nytt utseende eller tilbakestill.');
  const gridImage=value.gridImage===undefined?'':value.gridImage;
  if(typeof gridImage!=='string'||gridImage.length>1500000||(gridImage!==''&&!/^data:image\/jpeg;base64,[A-Za-z0-9+/]+=*$/.test(gridImage)))throw Error('Ugyldig lagret kalenderbilde. Velg nytt bilde eller tilbakestill.');
  return {version:1,background:value.background,calendar:value.calendar,days:value.days,image:value.image,gridImage};
}
export function textColour(hex) {
  const channels=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(v=>v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4);
  const light=channels[0]*.2126+channels[1]*.7152+channels[2]*.0722;
  return light>.179?'#000000':'#ffffff';
}
export function saveAppearance(storage,value,expected) {
  const raw=JSON.stringify(value);parseAppearance(raw);
  if(storage.getItem(appearanceKey)!==expected)throw Error('Utseendet er endret i en annen fane. Trykk Avbryt og åpne på nytt.');
  storage.setItem(appearanceKey,raw);return raw;
}
async function imageData(file) {
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>10*1024*1024)throw Error('Velg et JPG-, PNG- eller WebP-bilde på maks 10 MB.');
  const bitmap=await createImageBitmap(file);
  try {
    if(bitmap.width*bitmap.height>40000000)throw Error('Bildet er for stort. Velg et bilde under 40 megapiksler.');
    const scale=Math.min(1,1600/Math.max(bitmap.width,bitmap.height));
    const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));
    const ctx=canvas.getContext('2d');ctx.fillStyle='#ffffff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);
    const result=canvas.toDataURL('image/jpeg',.8);
    if(result.length>1500000)throw Error('Bildet tar for mye lagringsplass. Prøv et mindre bilde.');
    return result;
  } finally {bitmap.close();}
}
if(typeof document!=='undefined') {
  const panel=document.querySelector('#appearance-panel'),toggle=document.querySelector('#appearance-toggle'),error=document.querySelector('#appearance-error'),status=document.querySelector('#appearance-status');
  const save=document.querySelector('#appearance-save');
  const images=[{key:'image',input:'appearance-image',state:'appearance-image-state',remove:'appearance-remove'},{key:'gridImage',input:'appearance-grid-image',state:'appearance-grid-state',remove:'appearance-grid-remove'}];
  const sequences={image:0,gridImage:0},pending=new Set();
  const imageErrors={image:'',gridImage:''};
  const processing=()=>pending.size>0;
  let draft={...defaultAppearance},snapshot=null,dirty=false,saving=false;
  const controls=['background','calendar','days'];
  function apply(value) {
    const style=document.documentElement.style;
    style.setProperty('--page-bg',value.background);style.setProperty('--page-image',value.image?`url("${value.image}")`:'none');
    style.setProperty('--grid-image',value.gridImage?`url("${value.gridImage}")`:'none');
    document.body.classList.toggle('has-grid-image',Boolean(value.gridImage));
    for(const key of ['calendar','days']){style.setProperty(`--${key}-bg`,value[key]);style.setProperty(`--${key}-text`,textColour(value[key]));}
    style.setProperty('--today-bg',value.days==='#ffffff'?'#f8fbff':value.days);
    style.setProperty('--empty-bg',value.days==='#ffffff'?'#fafbfc':value.days);
    document.body.classList.toggle('custom-surround',value.background!==defaultAppearance.background||Boolean(value.image));
  }
  function sync() {
    for(const key of controls)document.querySelector(`#appearance-${key}`).value=draft[key];
    document.querySelector('#appearance-image-state').textContent=draft.image?'Bakgrunnsbilde valgt. Bildet fyller bakgrunnen.':'Ingen bakgrunnsbilde.';
    document.querySelector('#appearance-grid-state').textContent=draft.gridImage?'Kalenderbilde valgt. Ett bilde dekker hele rutenettet.':'Ingen bilde i rutenettet.';
    for(const item of images){document.getElementById(item.remove).disabled=!draft[item.key]&&!pending.has(item.key);document.getElementById(`${item.input}-error`).textContent=imageErrors[item.key];}
    save.disabled=processing()||saving;
  }
  function load() {
    try {snapshot=localStorage.getItem(appearanceKey);draft=parseAppearance(snapshot);error.textContent='';}
    catch(failure){draft={...defaultAppearance};error.textContent=failure.message;}
    dirty=false;imageErrors.image='';imageErrors.gridImage='';apply(draft);sync();
  }
  function changed() {dirty=true;error.textContent='';apply(draft);sync();status.textContent='Forhåndsvisning – trykk Lagre utseende for å beholde valgene.';}
  function invalidate(key){for(const item of images.filter(item=>!key||item.key===key)){sequences[item.key]++;pending.delete(item.key);imageErrors[item.key]='';document.getElementById(item.input).value='';}}
  function cancel(){if(saving)return;invalidate();load();panel.hidden=true;toggle.setAttribute('aria-expanded','false');status.textContent='';toggle.focus();}
  toggle.addEventListener('click',()=>{if(saving)return;if(!panel.hidden){cancel();return;}load();panel.hidden=false;toggle.setAttribute('aria-expanded','true');document.querySelector('#appearance-background').focus();});
  for(const key of controls)document.querySelector(`#appearance-${key}`).addEventListener('input',event=>{draft[key]=event.target.value;changed();});
  for(const button of panel.querySelectorAll('[data-theme]'))button.addEventListener('click',()=>{
    const themes={standard:['#f5f6f8','#ffffff','#ffffff'],forest:['#dce7df','#f3f7f1','#e7f0e4'],ocean:['#d5e5ef','#f1f7fc','#e4f0fa'],warm:['#e9ded2','#fcf8f0','#f4eadb']};
    const values=themes[button.dataset.theme];controls.forEach((key,i)=>draft[key]=values[i]);changed();
  });
  for(const item of images) {
    const file=document.getElementById(item.input),key=item.key;
    file.addEventListener('change',async()=>{
      const selected=file.files[0];if(!selected)return;const ticket=++sequences[key];pending.add(key);imageErrors[key]='';sync();status.textContent='Klargjør bildet …';error.textContent='';
      try {const image=await imageData(selected);if(ticket!==sequences[key])return;draft[key]=image;changed();}
      catch(failure){if(ticket===sequences[key]){imageErrors[key]=failure.message.startsWith('Velg ')||failure.message.startsWith('Bildet ')?failure.message:'Kunne ikke lese bildet. Prøv et annet JPG-, PNG- eller WebP-bilde.';status.textContent='Bildet ble ikke endret.';}}
      finally {if(ticket===sequences[key]){pending.delete(key);file.value='';sync();}}
    });
    document.getElementById(item.remove).addEventListener('click',()=>{invalidate(key);draft[key]='';changed();});
  }
  document.querySelector('#appearance-reset').addEventListener('click',()=>{invalidate();draft={...defaultAppearance};changed();});
  document.querySelector('#appearance-cancel').addEventListener('click',cancel);
  document.querySelector('#appearance-form').addEventListener('submit',async event=>{
    event.preventDefault();if(processing()||saving)return;saving=true;
    const elements=[...panel.querySelectorAll('input,button')].map(el=>[el,el.disabled]);elements.forEach(([el])=>el.disabled=true);
    try {
      const write=()=>{snapshot=saveAppearance(localStorage,draft,snapshot);};
      if(navigator.locks)await navigator.locks.request('smart-todo-appearance',write);else write();
      dirty=false;error.textContent='';status.textContent='Utseendet er lagret på denne nettleseren.';
    } catch(failure){error.textContent=failure.message.startsWith('Utseendet er endret')?failure.message:'Utseendet ble ikke lagret. Prøv å fjerne bildet eller frigjøre lagringsplass. Valgene dine er beholdt.';}
    finally {saving=false;elements.forEach(([el,disabled])=>el.disabled=disabled);sync();}
  });
  window.addEventListener('beforeunload',event=>{if(dirty||processing()){event.preventDefault();event.returnValue='';}});
  window.addEventListener('storage',event=>{if(event.key!==appearanceKey&&event.key!==null)return;if(!panel.hidden){status.textContent='Lagret utseende er endret i en annen fane. Avbryt for å hente siste versjon.';}else load();});
  load();
}
