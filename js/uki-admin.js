'use strict';
(function(){
const PROJECT_URL='https://gcdtqbeinaplqleuxwms.supabase.co';
const KEY='sb_publishable_MEu6mQJU3B-FbB4rolg8oA_W26M06BU';
const el=id=>document.getElementById(id);
const notice=(msg,error=false)=>{el('notice').textContent=msg;el('notice').classList.toggle('error',error)};
let client, entries=[];
try{client=window.supabase.createClient(PROJECT_URL,KEY)}catch(e){notice('Nepodařilo se načíst přihlašování. Zkus obnovit stránku.',true);return}
function cell(tr,txt){const td=document.createElement('td');td.textContent=txt;tr.appendChild(td);return td}
function download(name,lines){const content='\uFEFF'+lines.map(row=>row.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(';')).join('\r\n');const link=document.createElement('a');link.href=URL.createObjectURL(new Blob([content],{type:'text/csv;charset=utf-8'}));link.download=name;document.body.append(link);link.click();setTimeout(()=>{URL.revokeObjectURL(link.href);link.remove()},1000)}
function summary(){const j=entries.reduce((a,x)=>a+x.junior,0),s=entries.reduce((a,x)=>a+x.senior,0);el('count-j').textContent=j;el('count-s').textContent=s;el('count-all').textContent=j+s;el('amount').textContent='Celková hodnota zájmu: '+((j+s)*445).toLocaleString('cs-CZ')+' Kč bez případného poštovného.'}
async function reload(){notice('Načítám seznam…');const {data,error}=await client.from('uki_cepice').select('id,vytvoreno,jmeno,email,junior,senior,vyrizeno').order('vytvoreno',{ascending:false}).limit(1000);if(error){notice('Seznam není dostupný. Zkontroluj nastavení přístupových práv. '+error.message,true);return}entries=data||[];summary();const body=el('records');body.replaceChildren();entries.forEach(item=>{const tr=document.createElement('tr');cell(tr,new Date(item.vytvoreno).toLocaleDateString('cs-CZ'));cell(tr,item.jmeno);cell(tr,item.email);cell(tr,item.junior);cell(tr,item.senior);cell(tr,((item.junior+item.senior)*445).toLocaleString('cs-CZ')+' Kč');const td=document.createElement('td'),box=document.createElement('input');box.type='checkbox';box.checked=!!item.vyrizeno;box.setAttribute('aria-label','Vyřízeno: '+item.jmeno);box.addEventListener('change',async()=>{box.disabled=true;const {error}=await client.from('uki_cepice').update({vyrizeno:box.checked}).eq('id',item.id);box.disabled=false;if(error){box.checked=!box.checked;notice('Nepodařilo se uložit změnu: '+error.message,true)}else{item.vyrizeno=box.checked;notice('Změna uložena.')}});td.append(box);tr.append(td);
const actions=document.createElement('td');
const edit=document.createElement('button');edit.type='button';edit.className='secondary';edit.textContent='Upravit';edit.setAttribute('aria-label','Upravit '+item.jmeno);edit.addEventListener('click',()=>openEditor(item));
const del=document.createElement('button');del.type='button';del.className='danger';del.textContent='Smazat';del.setAttribute('aria-label','Smazat '+item.jmeno);del.addEventListener('click',()=>deleteOrder(item));
actions.append(edit,del);tr.append(actions);body.append(tr)});notice('Načteno záznamů: '+entries.length)}
async function begin(){const {data:{session}}=await client.auth.getSession();const logged=!!session;el('login').hidden=logged;el('dashboard').hidden=!logged;if(logged){await reload()}else{notice('Pro zobrazení seznamu se přihlas.')}}
el('loginform').addEventListener('submit',async e=>{e.preventDefault();const email=el('mail').value.trim();notice('Odesílám přihlašovací odkaz…');const {error}=await client.auth.signInWithOtp({email,options:{emailRedirectTo:location.origin+location.pathname}});notice(error?'Nepodařilo se poslat odkaz: '+error.message:'Hotovo. Zkontroluj e-mail a otevři přihlašovací odkaz na tomto zařízení.',!!error)});
el('refresh').addEventListener('click',reload);
el('logout').addEventListener('click',async()=>{await client.auth.signOut();await begin()});
el('export-summary').addEventListener('click',()=>{const j=entries.reduce((a,x)=>a+x.junior,0),s=entries.reduce((a,x)=>a+x.senior,0);download('uki-cepice-ddsport.csv',[['Velikost','Počet kusů'],['Junior',j],['Senior',s],['Celkem',j+s]])});
el('export-detail').addEventListener('click',()=>download('uki-cepice-evidence.csv',[['Datum','Jméno','E-mail','Junior','Senior','Celkem Kč','Vyřízeno'],...entries.map(x=>[new Date(x.vytvoreno).toLocaleDateString('cs-CZ'),x.jmeno,x.email,x.junior,x.senior,(x.junior+x.senior)*445,x.vyrizeno?'Ano':'Ne'])]));

// Adresy zákazníků zůstanou jen v přihlášené administraci a v konceptu Gmailu.
function recipientEmails(){
  return [...new Set(entries.map(x=>String(x.email||'').trim().toLowerCase())
    .filter(x=>/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(x)))];
}
el('mass-email').addEventListener('click',()=>{
  const emails=recipientEmails();
  if(!emails.length){notice('Zatím nemáme žádné platné e-mailové adresy.',true);return}
  const subject='Čepice UKI – informace k dodání';
  const body='Dobrý den,\\n\\nmám pro vás zprávu k čepicím UKI. DDSport plánuje dokončení výroby 3. 12. 2026 a dodání ke mně kolem 6. 12. 2026. Následně čepice roztřídím, zabalím a předpokládám odeslání všech objednávek nejpozději do 11. 12. 2026, pokud nenastane zdržení ve výrobě nebo dopravě.\\n\\nPokud se chcete s dalšími objednávajícími domluvit na společné zásilce a ušetřit za poštovné, napište mi prosím. Případně bude po předchozí domluvě možné osobní vyzvednutí v Praze na Florenci, pokud už budu zpátky v práci.\\n\\nDěkuji a přeji hezký den!\\nKarolina';
  const url='https://mail.google.com/mail/?view=cm&fs=1'
    +'&bcc='+encodeURIComponent(emails.join(','))
    +'&su='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  window.open(url,'_blank','noopener,noreferrer');
  notice('Gmail otevřen pro '+emails.length+' unikátních adres ve skryté kopii. Před odesláním zkontroluj odesílací účet k.ventlukova@gmail.com a příjemce.');
});
el('copy-emails').addEventListener('click',async()=>{
  const emails=recipientEmails();
  if(!emails.length){notice('Zatím nemáme žádné platné e-mailové adresy.',true);return}
  try{await navigator.clipboard.writeText(emails.join(', '));notice('Zkopírováno '+emails.length+' adres. V Gmailu je vlož do pole Skrytá kopie (BCC).')}
  catch(e){notice('Prohlížeč nepovolil kopírování. Použij tlačítko Hromadný e-mail.',true)}
});


const dialog=el('order-dialog'), editForm=el('order-form');
function openEditor(item){
  const existing=!!item;
  el('order-title').textContent=existing?'Upravit záznam':'Přidat záznam';
  el('edit-id').value=existing?String(item.id):'';
  el('edit-name').value=existing?item.jmeno:'';
  el('edit-email').value=existing?item.email:'';
  el('edit-junior').value=existing?item.junior:0;
  el('edit-senior').value=existing?item.senior:1;
  updateEditorTotal();
  dialog.showModal();
}
function updateEditorTotal(){
  const j=Number(el('edit-junior').value),s=Number(el('edit-senior').value);
  el('edit-total').textContent='Celkem: '+((j+s)*445).toLocaleString('cs-CZ')+' Kč bez poštovného';
}
el('edit-junior').addEventListener('input',updateEditorTotal);
el('edit-senior').addEventListener('input',updateEditorTotal);
el('add-order').addEventListener('click',()=>openEditor(null));
el('cancel-order').addEventListener('click',()=>dialog.close());
editForm.addEventListener('submit',async e=>{
  e.preventDefault();
  const id=el('edit-id').value;
  const j=Number(el('edit-junior').value),s=Number(el('edit-senior').value);
  const name=el('edit-name').value.trim(),email=el('edit-email').value.trim();
  if(!name||!email||!Number.isInteger(j)||!Number.isInteger(s)||j<0||s<0||j>99||s>99||j+s<1){
    notice('Vyplň jméno, e-mail a alespoň jednu čepici (maximálně 99 kusů od velikosti).',true);return;
  }
  const save=el('save-order');save.disabled=true;
  const values={jmeno:name,email,junior:j,senior:s};
  try{
    const q=id?client.from('uki_cepice').update(values).eq('id',id):client.from('uki_cepice').insert(values);
    const {error}=await q;
    if(error)throw error;
    dialog.close();await reload();notice(id?'Záznam upraven a uložen.':'Nový záznam přidán.');
  }catch(err){notice('Uložení se nepodařilo: '+err.message,true)}
  finally{save.disabled=false}
});
async function deleteOrder(item){
  if(!window.confirm('Opravdu trvale smazat záznam pro '+item.jmeno+' ('+item.email+') – Junior '+item.junior+', Senior '+item.senior+'?\\n\\nTuto akci nejde vrátit.'))return;
  notice('Mažu vybraný záznam…');
  const {error}=await client.from('uki_cepice').delete().eq('id',item.id);
  if(error){notice('Záznam se nepodařilo smazat: '+error.message,true);return}
  await reload();notice('Záznam byl smazán.');
}

client.auth.onAuthStateChange(()=>{setTimeout(begin,0)});begin();
})();