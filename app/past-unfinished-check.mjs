import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,channel:'msedge'});
try {
  const context=await browser.newContext({viewport:{width:1440,height:1000},timezoneId:'Europe/Oslo'});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.clock.setFixedTime(new Date('2026-11-23T12:00:00+01:00'));
  await page.goto('http://localhost:5173');
  assert.equal(await page.locator('#past-notice').isVisible(),false);
  const tasks=[
    {id:'later',title:'Senere oppgave',date:'2026-11-22',category:'Jobb'},
    {id:'old',title:'<img src=x onerror=alert(1)> Eldst',date:'2025-12-31',category:'Skole'},
    {id:'today',title:'I dag',date:'2026-11-23',category:'Ellers'},
    {id:'done',title:'Ferdig',date:'2026-11-21',category:'Familie',completed:true},
    {id:'undated',title:'Uten dato',date:'',category:'Ellers'},
    {id:'future',title:'Senere',date:'2026-12-01',category:'Ellers'}
  ];
  await page.evaluate(tasks=>localStorage.setItem('smart-todo.v1',JSON.stringify({version:1,tasks})),tasks);
  await page.reload();
  const saved=await page.evaluate(()=>localStorage.getItem('smart-todo.v1'));
  assert.match(await page.locator('#past-count').innerText(),/^2 uferdige/);
  await page.locator('#category-filter').selectOption('Jobb');
  await page.locator('#past-open').click();
  assert.equal(await page.locator('#past-dialog').isVisible(),true);
  assert.equal(await page.locator('#past-close').evaluate(el=>el===document.activeElement),true);
  assert.deepEqual(await page.locator('#past-list h3').allTextContents(),[tasks[1].title,tasks[0].title]);
  assert.equal(await page.locator('#past-list img').count(),0);
  await page.keyboard.press('Escape');assert.equal(await page.locator('#past-dialog').isVisible(),true);
  await page.mouse.click(1,1);assert.equal(await page.locator('#past-dialog').isVisible(),true);
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(()=>document.activeElement===document.body || !!document.activeElement.closest('#past-dialog')),true);
  await page.screenshot({path:'app/test-results/past-unfinished.png',fullPage:true});
  await page.locator('#past-close').click();
  assert.equal(await page.locator('#past-open').evaluate(el=>el===document.activeElement),true);
  assert.equal(await page.evaluate(()=>localStorage.getItem('smart-todo.v1')),saved);
  await page.reload();assert.equal(await page.locator('#past-notice').isVisible(),true);
  // A view-only modal must preserve an existing unsaved task draft.
  await page.locator('[data-date="2026-11-23"] .add').click();
  await page.getByLabel('Hva skal du gjøre?',{exact:true}).fill('Ulagret utkast');
  await page.locator('#past-open').click();await page.locator('#past-close').click();
  assert.equal(await page.getByLabel('Hva skal du gjøre?',{exact:true}).inputValue(),'Ulagret utkast');
  // Another tab resolves the past records without erasing that draft.
  const other=await context.newPage();await other.goto('http://localhost:5173');
  await page.locator('#past-open').click();
  await other.evaluate(()=>{const data=JSON.parse(localStorage.getItem('smart-todo.v1'));data.tasks.forEach(t=>{if(t.date&&t.date<'2026-11-23')t.completed=true;});localStorage.setItem('smart-todo.v1',JSON.stringify(data));});
  await page.waitForFunction(()=>!document.querySelector('#past-dialog').open);
  assert.equal(await page.locator('#past-notice').isVisible(),false);
  assert.equal(await page.getByLabel('Hva skal du gjøre?',{exact:true}).inputValue(),'Ulagret utkast');
  await other.evaluate(()=>localStorage.setItem('smart-todo.v1','invalid'));
  await page.waitForFunction(()=>document.querySelector('#message').textContent.includes('Ingen data er endret'));
  assert.equal(await page.evaluate(()=>localStorage.getItem('smart-todo.v1')),'invalid');
  // Recovery clears the overview-owned message, without losing the draft.
  await other.evaluate(tasks=>localStorage.setItem('smart-todo.v1',JSON.stringify({version:1,tasks})),tasks);
  await page.waitForFunction(()=>!document.querySelector('#past-notice').hidden);
  assert.equal(await page.locator('#message').innerText().then(t=>t.includes('Vi kunne ikke lese')),false);
  await page.locator('#past-open').click();
  await other.evaluate(()=>localStorage.setItem('smart-todo.v1','invalid'));
  await page.waitForFunction(()=>document.querySelector('#past-error').textContent.includes('Ingen data er endret'));
  assert.equal(await page.locator('#past-dialog').isVisible(),true);
  assert.equal(await page.locator('#past-list li').count(),0);
  await page.locator('#past-close').click();
  assert.equal(await page.getByLabel('Hva skal du gjøre?',{exact:true}).inputValue(),'Ulagret utkast');
  assert.equal(await page.evaluate(()=>localStorage.getItem('smart-todo.v1')),'invalid');
  await other.evaluate(tasks=>localStorage.setItem('smart-todo.v1',JSON.stringify({version:1,tasks})),tasks);
  await page.waitForFunction(()=>document.querySelector('#past-list li'));
  const beforeMidnight=await page.evaluate(()=>localStorage.getItem('smart-todo.v1'));
  await page.clock.setFixedTime(new Date('2026-11-24T00:00:01+01:00'));
  await page.evaluate(()=>document.dispatchEvent(new Event('visibilitychange')));
  assert.match(await page.locator('#past-count').innerText(),/^3 uferdige/);
  assert.equal(await page.locator('#past-dialog').isVisible(),false);
  assert.equal(await page.getByLabel('Hva skal du gjøre?',{exact:true}).inputValue(),'Ulagret utkast');
  assert.equal(await page.evaluate(()=>localStorage.getItem('smart-todo.v1')),beforeMidnight);
  assert.deepEqual(errors,[]);
  console.log('Past overview browser checks passed: count, exclusions, ordering, filter independence, safe text, modal dismissal/focus, recurrence, unchanged storage, drafts and cross-tab refresh.');
} finally {await browser.close();}
