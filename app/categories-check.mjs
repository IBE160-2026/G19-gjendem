import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,channel:'msedge'});
try {
  const context=await browser.newContext({viewport:{width:1500,height:1100}});
  const page=await context.newPage(); const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://localhost:5173');
  const date=await page.locator('[aria-current="date"]').getAttribute('data-date');
  const tasks=[
    {id:'work',title:'Arbeid',date,category:'Jobb',start:'12:00',end:'13:00'},
    {id:'school',title:'Lesing',date,category:'Skole',start:'12:30',end:'13:30'},
    {id:'undated',title:'Huskelapp',date:'',category:'Skole'},
    {id:'done',title:'Ferdig',date,category:'Jobb',completed:true,archived:true}
  ];
  await page.evaluate(tasks=>localStorage.setItem('smart-todo.v1',JSON.stringify({version:1,tasks})),tasks);await page.reload();
  await page.locator('#category-filter').selectOption('Jobb');
  assert.equal(await page.locator('.week .task').count(),1);
  assert.equal(await page.locator('.week .task.conflict').count(),1);
  assert.equal(await page.locator('#upcoming .task').count(),1);
  await page.locator('#undated-toggle').click(); assert.equal(await page.locator('#undated-panel .task').count(),0);
  await page.locator('#completed-toggle').click(); assert.equal(await page.locator('#completed-panel .task').count(),1);
  await page.locator(`[data-date="${date}"] .day-number`).click();
  assert.equal(await page.locator('#expanded-day .task').count(),1);
  await page.locator('#clear-filter').click();assert.equal(await page.locator('.week .task').count(),2);
  assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('smart-todo.v1')).tasks),tasks);
  await page.locator('#category-toggle').click();
  await page.locator('#category-name').fill('jobb');await page.getByRole('button',{name:'Lagre kategori',exact:true}).click();
  await page.locator('#category-error').filter({hasText:'finnes allerede'}).waitFor();
  await page.locator('#category-name').fill('Trening');await page.locator('#category-color').fill('#9700ff');
  await page.evaluate(()=>{window.realWrite=Storage.prototype.setItem;Storage.prototype.setItem=()=>{throw Error('quota');};});
  await page.getByRole('button',{name:'Lagre kategori',exact:true}).click();
  await page.locator('#category-error').filter({hasText:'ikke lagret'}).waitFor();
  assert.equal(await page.locator('#category-name').inputValue(),'Trening');
  await page.evaluate(()=>{Storage.prototype.setItem=window.realWrite;});
  await page.getByRole('button',{name:'Lagre kategori',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('#category-panel').hidden);
  await page.locator('#category-filter').selectOption('Trening');
  assert.equal(await page.locator('.week .task').count(),0);assert.match(await page.locator('#filter-status').innerText(),/Ingen oppgaver/);
  await page.locator(`[data-date="${date}"] .add`).click();
  assert.equal(await page.getByLabel('Kategori',{exact:true}).inputValue(),'Ellers');
  await page.getByLabel('Hva skal du gjøre?',{exact:true}).fill('Løpetur');
  await page.getByLabel('Kategori',{exact:true}).selectOption('Trening');
  await page.locator('#category-filter').selectOption('Skole');
  assert.equal(await page.getByLabel('Hva skal du gjøre?',{exact:true}).inputValue(),'Løpetur');
  await page.getByRole('button',{name:'Lagre oppgave',exact:true}).click();await page.waitForSelector('#editor',{state:'detached'});
  assert.equal(await page.locator('#category-filter').inputValue(),'Trening');
  assert.equal(await page.locator('.week .custom-category').count(),1);
  assert.equal(await page.locator('.week .custom-category').evaluate(el=>el.style.getPropertyValue('--stripe')),'#9700ff');
  await page.reload();assert.equal(await page.locator('#category-filter').inputValue(),'');
  await page.locator('#category-filter').selectOption('Trening');
  assert.equal(await page.locator('.week .custom-category').count(),1);
  assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('smart-todo.v1')).tasks.slice(0,4)),tasks);
  assert.equal(await page.locator('.week .custom-category').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(243, 224, 255)');
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('smart-todo.v1')).customCategories[0].color),'#9700ff');
  // Category creation must preserve every field in an already-open task draft.
  await page.locator(`[data-date="${date}"] .add`).click();
  await page.getByLabel('Hva skal du gjøre?',{exact:true}).fill('Utkast');
  await page.getByLabel('Beskrivelse (valgfritt)',{exact:true}).fill('Behold detaljer');
  await page.getByLabel('Kategori',{exact:true}).selectOption('Trening');
  await page.getByLabel('Start (valgfritt)',{exact:true}).fill('15:00');
  await page.getByLabel('Slutt (valgfritt)',{exact:true}).fill('16:00');
  await page.locator('#category-toggle').click();await page.locator('#category-name').fill('Hobby');
  await page.locator('#category-color').fill('#000000');await page.getByRole('button',{name:'Lagre kategori',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('#category-panel').hidden);
  for(const [label,value] of [['Hva skal du gjøre?','Utkast'],['Beskrivelse (valgfritt)','Behold detaljer'],['Kategori','Trening'],['Dato',date],['Start (valgfritt)','15:00'],['Slutt (valgfritt)','16:00']]) assert.equal(await page.getByLabel(label,{exact:true}).inputValue(),value);
  await page.getByRole('button',{name:'Lagre oppgave',exact:true}).click();await page.waitForSelector('#editor',{state:'detached'});
  const other=await context.newPage();await other.goto('http://localhost:5173');
  const prepare=async(p,name)=>{await p.locator('#category-toggle').click();await p.locator('#category-name').fill(name);};
  await prepare(page,'Fritid');await prepare(other,'FRITID');
  await Promise.all([page.getByRole('button',{name:'Lagre kategori',exact:true}).click(),other.getByRole('button',{name:'Lagre kategori',exact:true}).click()]);
  await page.waitForFunction(()=>JSON.parse(localStorage.getItem('smart-todo.v1')).customCategories.some(c=>c.name.toLowerCase()==='fritid'));
  await Promise.all([page.waitForFunction(()=>document.querySelector('#category-panel').hidden||document.querySelector('#category-error').textContent.includes('finnes allerede')),other.waitForFunction(()=>document.querySelector('#category-panel').hidden||document.querySelector('#category-error').textContent.includes('finnes allerede'))]);
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('smart-todo.v1')).customCategories.filter(c=>c.name.toLowerCase()==='fritid').length),1);
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('smart-todo.v1')).tasks.length),6);
  for(const [p,name] of [[page,'Privat'],[other,'Reiser']]) {
    if(await p.locator('#category-panel').isHidden()) await p.locator('#category-toggle').click();
    await p.locator('#category-name').fill(name);
  }
  await Promise.all([page.getByRole('button',{name:'Lagre kategori',exact:true}).click(),other.getByRole('button',{name:'Lagre kategori',exact:true}).click()]);
  await Promise.all([page.waitForFunction(()=>document.querySelector('#category-panel').hidden),other.waitForFunction(()=>document.querySelector('#category-panel').hidden)]);
  assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('smart-todo.v1')).customCategories.map(c=>c.name).filter(n=>['Privat','Reiser'].includes(n)).sort()),['Privat','Reiser']);
  // Retained category draft warns on page navigation.
  if(await page.locator('#category-panel').isHidden()) await page.locator('#category-toggle').click();
  await page.locator('#category-name').fill('Ikke lagret');
  let warned=false;page.once('dialog',async d=>{warned=d.type()==='beforeunload';await d.accept();});await page.reload();assert.equal(warned,true);
  await page.locator('#category-toggle').click();await page.locator('#category-name').fill('X'.repeat(40));await page.locator('#category-color').fill('#ffffff');
  await page.getByRole('button',{name:'Lagre kategori',exact:true}).click();await page.waitForFunction(()=>document.querySelector('#category-panel').hidden);
  await page.setViewportSize({width:520,height:900});await page.locator('#category-filter').selectOption('X'.repeat(40));
  assert.equal(await page.locator('.legend').evaluate(el=>el.scrollWidth<=el.clientWidth),true);
  for(const [name,color] of [['Hobby','rgb(224, 224, 224)'],['X'.repeat(40),'rgb(255, 255, 255)']]) assert.equal(await page.locator('.legend span').filter({hasText:name}).evaluate(el=>getComputedStyle(el).backgroundColor),color);
  await page.setViewportSize({width:1500,height:1100});await page.locator('#category-filter').selectOption('Trening');
  assert.deepEqual(errors,[]);
  await page.screenshot({path:'app/test-results/categories.png',fullPage:true});
  await context.close();console.log('Category filtering, conflicts, custom colours, persistence, drafts, validation and failed saves passed.');
} finally {await browser.close();}
