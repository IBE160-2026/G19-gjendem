import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,channel:'msedge'});
try {
  const context=await browser.newContext({viewport:{width:1440,height:1000},timezoneId:'Europe/Oslo'});
  const errors=[];
  context.on('page',p=>p.on('pageerror',e=>errors.push(e.message)));
  let page=await context.newPage();
  await page.clock.install({time:new Date('2026-12-31T23:59:50+01:00')});
  await page.goto('http://localhost:5173');
  const tasks=[
    {id:'old',title:'Tidligere',date:'2026-12-30',category:'Jobb'},
    {id:'today',title:'Årsskifte',date:'2026-12-31',category:'Skole'},
    {id:'future',title:'Neste dag',date:'2027-01-01',category:'Familie'},
    {id:'undated',title:'Uten dato',date:'',category:'Ellers'},
    {id:'done',title:'Ferdig',date:'2026-12-29',category:'Ellers',completed:true}
  ];
  await page.evaluate(tasks=>localStorage.setItem('smart-todo.v1',JSON.stringify({version:1,tasks})),tasks);
  await page.reload();
  const saved=await page.evaluate(()=>localStorage.getItem('smart-todo.v1'));
  assert.match(await page.locator('#past-count').innerText(),/^1 uferdig/);
  await page.locator('[data-date="2026-12-31"] .add').click();
  const title=page.getByLabel('Hva skal du gjøre?',{exact:true});
  await title.fill('Ulagret ved midnatt');
  await page.clock.fastForward(31000);
  assert.match(await page.locator('#past-count').innerText(),/^2 uferdige/);
  assert.equal(await page.locator('#past-dialog').isVisible(),false);
  assert.equal(await title.inputValue(),'Ulagret ved midnatt');
  assert.equal(await title.evaluate(el=>el===document.activeElement),true);
  assert.equal(await page.evaluate(()=>localStorage.getItem('smart-todo.v1')),saved);
  // Returning after inactivity uses today's actual local date, without waiting for a timer.
  await page.clock.setSystemTime(new Date('2027-01-02T08:00:00+01:00'));
  await page.evaluate(()=>document.dispatchEvent(new Event('visibilitychange')));
  assert.match(await page.locator('#past-count').innerText(),/^3 uferdige/);
  assert.equal(await title.inputValue(),'Ulagret ved midnatt');
  assert.equal(await title.evaluate(el=>el===document.activeElement),true);
  assert.equal(await page.locator('#past-dialog').isVisible(),false);
  page.once('dialog',d=>d.accept());
  await page.getByRole('button',{name:'Avbryt',exact:true}).click();
  await page.locator('#past-open').click();
  await page.locator('#past-close').click();
  assert.equal(await page.evaluate(()=>localStorage.getItem('smart-todo.v1')),saved);
  // Close the actual page and revisit in the same browser storage environment.
  await page.close();page=await context.newPage();
  await page.clock.install({time:new Date('2027-01-02T08:00:00+01:00')});
  await page.goto('http://localhost:5173');
  assert.match(await page.locator('#past-count').innerText(),/^3 uferdige/);
  await page.locator('#past-open').click();
  assert.deepEqual(await page.locator('#past-list h3').allTextContents(),['Tidligere','Årsskifte','Neste dag']);
  await page.getByRole('button',{name:'Endre: Tidligere',exact:true}).click();
  const modalTitle=page.locator('#past-editor').getByLabel('Hva skal du gjøre?',{exact:true});
  await modalTitle.fill('Mitt utkast');
  const other=await context.newPage();await other.goto('http://localhost:5173');
  await other.evaluate(()=>{const d=JSON.parse(localStorage.getItem('smart-todo.v1'));d.tasks[0].title='Endret i annen fane';localStorage.setItem('smart-todo.v1',JSON.stringify(d));});
  await page.waitForFunction(()=>document.querySelector('#past-status').textContent.includes('annen fane'));
  assert.equal(await modalTitle.inputValue(),'Mitt utkast');
  assert.equal(await modalTitle.evaluate(el=>el===document.activeElement),true);
  assert.equal(await page.locator('#past-dialog').isVisible(),true);
  await page.getByRole('button',{name:'Lagre oppgave',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('#editor .error').textContent.length>0);
  assert.equal(await modalTitle.inputValue(),'Mitt utkast');
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('smart-todo.v1')).tasks[0].title),'Endret i annen fane');
  page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'Avbryt',exact:true}).click();
  // Resolve one record externally: count decreases, the remaining window stays open.
  await other.evaluate(()=>{const d=JSON.parse(localStorage.getItem('smart-todo.v1'));d.tasks[0].completed=true;localStorage.setItem('smart-todo.v1',JSON.stringify(d));});
  await page.waitForFunction(()=>document.querySelectorAll('#past-list li').length===2);
  assert.match(await page.locator('#past-count').innerText(),/^2 uferdige/);
  assert.equal(await page.locator('#past-dialog').isVisible(),true);
  await other.evaluate(()=>{const d=JSON.parse(localStorage.getItem('smart-todo.v1'));d.tasks.forEach(t=>{if(t.date)t.completed=true;});localStorage.setItem('smart-todo.v1',JSON.stringify(d));});
  await page.waitForFunction(()=>!document.querySelector('#past-dialog').open);
  assert.equal(await page.locator('#past-notice').isVisible(),false);
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('smart-todo.v1')).tasks.length),5);
  // Hidden notice becomes visible; subsequent date changes preserve a modal editor.
  const zeroContext=await browser.newContext({viewport:{width:1440,height:1000},timezoneId:'Europe/Oslo'});
  const zero=await zeroContext.newPage();zero.on('pageerror',e=>errors.push(e.message));
  await zero.clock.install({time:new Date('2027-01-01T23:59:50+01:00')});
  await zero.goto('http://localhost:5173');
  const boundaryTasks=[
    {id:'a',title:'Første dag',date:'2027-01-01',category:'Jobb'},
    {id:'b',title:'Andre dag',date:'2027-01-02',category:'Skole'},
    {id:'c',title:'Tredje dag',date:'2027-01-03',category:'Familie'},
    {id:'d',title:'Udatert',date:'',category:'Ellers'},
    {id:'e',title:'Fullført',date:'2026-12-30',category:'Ellers',completed:true}
  ];
  await zero.evaluate(tasks=>localStorage.setItem('smart-todo.v1',JSON.stringify({version:1,tasks})),boundaryTasks);
  await zero.reload();
  const unchanged=await zero.evaluate(()=>localStorage.getItem('smart-todo.v1'));
  assert.equal(await zero.locator('#past-notice').isVisible(),false);
  await zero.locator('#today').focus();
  await zero.clock.fastForward(31000);
  assert.equal(await zero.locator('#past-notice').isVisible(),true);
  assert.match(await zero.locator('#past-count').innerText(),/^1 uferdig/);
  assert.equal(await zero.locator('#past-dialog').isVisible(),false);
  assert.equal(await zero.locator('#today').evaluate(el=>el===document.activeElement),true);
  await zero.locator('#past-open').click();
  await zero.getByRole('button',{name:'Endre: Første dag',exact:true}).click();
  const midnightTitle=zero.locator('#past-editor').getByLabel('Hva skal du gjøre?',{exact:true});
  await midnightTitle.fill('Ulagret i vinduet');
  await zero.clock.setSystemTime(new Date('2027-01-02T23:59:50+01:00'));
  await zero.clock.fastForward(31000);
  assert.match(await zero.locator('#past-count').innerText(),/^2 uferdige/);
  assert.equal(await midnightTitle.inputValue(),'Ulagret i vinduet');
  assert.equal(await midnightTitle.isVisible(),true);
  assert.equal(await midnightTitle.evaluate(el=>el===document.activeElement),true);
  await zero.clock.setSystemTime(new Date('2027-01-04T08:00:00+01:00'));
  await zero.evaluate(()=>document.dispatchEvent(new Event('visibilitychange')));
  assert.match(await zero.locator('#past-count').innerText(),/^3 uferdige/);
  assert.equal(await midnightTitle.inputValue(),'Ulagret i vinduet');
  assert.equal(await midnightTitle.isVisible(),true);
  assert.equal(await midnightTitle.evaluate(el=>el===document.activeElement),true);
  assert.equal(await zero.evaluate(()=>localStorage.getItem('smart-todo.v1')),unchanged);
  zero.once('dialog',d=>d.accept());await zero.getByRole('button',{name:'Avbryt',exact:true}).click();
  assert.deepEqual(await zero.locator('#past-list h3').allTextContents(),['Første dag','Andre dag','Tredje dag']);
  assert.equal(await zero.locator('#past-dialog').isVisible(),true);
  assert.equal(await zero.evaluate(()=>localStorage.getItem('smart-todo.v1')),unchanged);
  await zeroContext.close();
  assert.deepEqual(errors,[]);
  console.log('Story 1.4 passed: timer/year boundary, visibility return, close/revisit, preserved drafts/focus, visible cross-tab feedback, stale-save rejection and remaining-count closure.');
} finally {await browser.close();}
