import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,channel:'msedge'});
try {
  const context=await browser.newContext({viewport:{width:1500,height:1100},timezoneId:'Europe/Oslo'});
  const page=await context.newPage(), errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.clock.setFixedTime(new Date('2026-11-23T12:00:00+01:00'));
  await page.goto('http://localhost:5173');
  await page.locator('#category-toggle').click();
  await page.locator('#category-name').fill('Hobby');
  await page.locator('#category-color').fill('#123456');
  await page.getByRole('button',{name:'Lagre kategori',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('#category-panel').hidden);
  const tasks=[
    {id:'timed',title:'Tidsatt',date:'2026-11-23',start:'12:00',end:'13:00',category:'Hobby'},
    {id:'untimed',title:'Uten tid',date:'2026-11-23',category:'Hobby'},
    {id:'undated',title:'Uten dato',date:'',category:'Hobby'},
    {id:'past',title:'Tidligere',date:'2026-11-22',category:'Hobby'},
    {id:'done',title:'Fullført',date:'',category:'Hobby',completed:true,archived:true},
    {id:'other',title:'Jobboppgave',date:'2026-11-23',category:'Jobb'},
    {id:'other-past',title:'Tidligere jobb',date:'2026-11-21',category:'Jobb'},
    {id:'other-undated',title:'Udatert jobb',date:'',category:'Jobb'},
    {id:'other-done',title:'Fullført jobb',date:'',category:'Jobb',completed:true,archived:true}
  ].map(t=>({...t,description:'Detaljer beholdes'}));
  await page.evaluate(tasks=>{const data=JSON.parse(localStorage.getItem('smart-todo.v1'));data.tasks=tasks;localStorage.setItem('smart-todo.v1',JSON.stringify(data));},tasks);
  await page.reload();await page.locator('#category-filter').selectOption('Hobby');
  await page.locator('#manage-categories').click();
  const row=page.locator('[data-category-id="Hobby"]');
  const displayName='Fritid <b>min</b>', color='#8654ad';
  await row.getByLabel('Navn',{exact:true}).fill(displayName);
  await row.getByLabel('Egen farge',{exact:true}).fill(color);
  await row.getByRole('button',{name:'Lagre kategori',exact:true}).click();
  await page.waitForFunction(name=>JSON.parse(localStorage.getItem('smart-todo.v1')).categoryOverrides?.Hobby?.name===name,displayName);
  assert.equal(await page.locator('#category-filter').inputValue(),'Hobby');
  assert.equal(await page.locator('#category-filter option:checked').innerText(),displayName);
  assert.equal(await page.locator('.legend b').count(),0);
  assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('smart-todo.v1')).tasks),tasks);
  await page.getByRole('button',{name:'Lukk kategorier',exact:true}).click();
  await page.locator('#undated-toggle').click();await page.locator('#completed-toggle').click();
  await page.locator('[data-date="2026-11-23"] .day-number').click();
  for (const [selector,count] of [['.week .task',3],['#upcoming .task',2],['#expanded-day .task',2],['#undated-panel .task',1],['#completed-panel .task',1]]) {
    const cards=page.locator(selector);assert.equal(await cards.count(),count,selector);
    for(const card of await cards.all()) {
      assert.match(await card.locator('small').first().innerText(),/Fritid <b>min<\/b>/);
      assert.equal(await card.evaluate(el=>el.style.getPropertyValue('--stripe')),color);
      assert.equal(await card.locator('b').count(),0);
    }
  }
  // The past review deliberately ignores the normal category filter.
  await page.locator('#past-open').click();
  assert.equal(await page.locator('#past-list li').count(),2);
  const past=page.locator('[data-past-id="past"]');
  assert.match(await past.innerText(),/Fritid <b>min<\/b>/);
  assert.equal(await past.evaluate(el=>el.style.getPropertyValue('--stripe')),color);
  assert.equal(await past.locator('b').count(),0);
  await page.locator('#past-close').click();
  await page.locator('#clear-filter').click();
  assert.equal(await page.locator('.week .task').count(),5);
  assert.equal(await page.locator('#undated-panel .task').count(),2);
  assert.equal(await page.locator('#completed-panel .task').count(),2);
  await page.reload();
  assert.equal(await page.locator('#category-filter').inputValue(),'');
  await page.locator('#category-filter').selectOption('Hobby');
  assert.equal(await page.locator('#category-filter option:checked').innerText(),displayName);
  assert.equal(await page.locator('.week .task').first().evaluate(el=>el.style.getPropertyValue('--stripe')),color);
  assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('smart-todo.v1')).tasks),tasks);
  await page.locator('[data-date="2026-11-23"] .add').click();
  assert.equal(await page.getByLabel('Kategori',{exact:true}).inputValue(),'Ellers');
  assert.equal(await page.getByLabel('Kategori',{exact:true}).locator('option[value="Hobby"]').innerText(),displayName);
  await page.getByRole('button',{name:'Avbryt',exact:true}).click();
  // Cleanup must also retain and archive completed records hidden by the filter.
  await page.evaluate(()=>{const data=JSON.parse(localStorage.getItem('smart-todo.v1'));for(const t of data.tasks)if(['timed','other'].includes(t.id))t.completed=true;localStorage.setItem('smart-todo.v1',JSON.stringify(data));});
  await page.reload();await page.locator('#category-filter').selectOption('Hobby');
  await page.getByRole('button',{name:'Rydd side',exact:true}).click();
  await page.waitForFunction(()=>JSON.parse(localStorage.getItem('smart-todo.v1')).tasks.find(t=>t.id==='other').archived);
  const cleaned=await page.evaluate(()=>JSON.parse(localStorage.getItem('smart-todo.v1')).tasks);
  assert.equal(cleaned.length,tasks.length);
  assert.equal(cleaned.find(t=>t.id==='timed').archived,true);
  assert.equal(cleaned.find(t=>t.id==='untimed').archived,undefined);
  assert.deepEqual(errors,[]);
  console.log('Epic 2 integration passed: custom rename/recolour in all task views, safe labels, stable filter/IDs, unchanged records, reload and default.');
} finally {await browser.close();}
