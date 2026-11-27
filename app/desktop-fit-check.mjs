import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,channel:'msedge'});
try {
 const context=await browser.newContext({viewport:{width:1366,height:768},timezoneId:'Europe/Oslo'});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.clock.setFixedTime(new Date('2026-11-27T12:00:00+01:00'));
 await page.goto('http://localhost:5173');
 const data={version:1,tasks:[...Array.from({length:8},(_,i)=>({id:`p${i}`,title:`Tidligere oppgave ${i}`,date:'2026-11-01',category:'Jobb'})),...Array.from({length:5},(_,i)=>({id:`t${i}`,title:`Oppgave med lang tittel ${i}`,date:'2026-11-27',category:'Familie',...(i<2?{start:'12:00',end:'13:00'}:{})}))]};
 await page.evaluate(d=>localStorage.setItem('smart-todo.v1',JSON.stringify(d)),data);await page.reload();
 const stored=await page.evaluate(()=>localStorage.getItem('smart-todo.v1'));
 const checkFit=async()=>{
  await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(100);
  const bounds=await page.evaluate(()=>Object.fromEntries(['.month-grid','.calendar-actions','.app-header','#past-notice','#upcoming'].map(s=>{const r=document.querySelector(s).getBoundingClientRect();return [s,{top:r.top,bottom:r.bottom,right:r.right,left:r.left}];})));
  assert.ok(bounds['.month-grid'].bottom<=await page.evaluate(()=>innerHeight),JSON.stringify(bounds));
  assert.ok(bounds['.calendar-actions'].bottom<=await page.evaluate(()=>innerHeight),JSON.stringify(bounds));
  assert.ok(bounds['#upcoming'].right<bounds['.month-grid'].left);
  for(const id of ['appearance-toggle','completed-toggle','category-filter'])assert.ok(await page.locator('#'+id).isVisible());
 };
 assert.equal(await page.locator('.month-grid>.week').count(),6);await checkFit();
 const day=page.locator('[data-date="2026-11-27"]');
 assert.equal(await day.locator('.task:visible').count(),2);
 await day.locator('.month-more').click();assert.equal(await page.locator('#expanded-day .task').count(),5);
 await page.getByRole('button',{name:'Lukk dagen',exact:true}).click();await checkFit();
 await page.locator('#past-open').click();assert.equal(await page.locator('#past-dialog').isVisible(),true);await page.locator('#past-close').click();await checkFit();
 await page.locator('#appearance-toggle').click();await page.locator('[data-landscape=image]').click();await page.waitForFunction(()=>!document.querySelector('#appearance-save').disabled);await page.locator('#appearance-save').click();await page.locator('#appearance-status').filter({hasText:'er lagret'}).waitFor();await page.locator('#appearance-cancel').click();
 await checkFit();await page.screenshot({path:process.env.TEMP+'/smart-todo-desktop-fit.png',fullPage:true});
 await page.setViewportSize({width:1920,height:1080});await checkFit();
 await page.locator('#next').click();assert.equal(await page.locator('.month-grid>.week').count(),5);await checkFit();
 // Open work can scroll, and resizing never discards the editor draft.
 await page.locator('[data-date="2026-12-25"] .add').click();await page.getByLabel('Hva skal du gjøre?',{exact:true}).fill('Behold utkast');
 await page.setViewportSize({width:1366,height:768});assert.equal(await page.getByLabel('Hva skal du gjøre?',{exact:true}).inputValue(),'Behold utkast');
 await page.setViewportSize({width:900,height:700});assert.equal(await page.getByLabel('Hva skal du gjøre?',{exact:true}).inputValue(),'Behold utkast');
 assert.equal(await page.evaluate(()=>localStorage.getItem('smart-todo.v1')),stored);
 // Dense holiday in a six-week month still fits, without hiding its flag or tasks.
 page.once('dialog',d=>d.accept());await page.reload();
 await page.clock.setFixedTime(new Date('2024-12-25T12:00:00+01:00'));
 await page.evaluate(()=>localStorage.setItem('smart-todo.v1',JSON.stringify({version:1,tasks:Array.from({length:5},(_,i)=>({id:`h${i}`,title:'Juleoppgave '+i,date:'2024-12-25',category:'Familie'}))})));
 await page.setViewportSize({width:1366,height:768});await page.reload();await checkFit();
 const holiday=page.locator('[data-date="2024-12-25"]');assert.equal(await page.locator('.month-grid>.week').count(),6);
 assert.equal(await holiday.locator('.task:visible').count(),2);assert.equal(await holiday.locator('.holiday-flag').isVisible(),true);
 await holiday.locator('.month-more').click();assert.equal(await page.locator('#expanded-day .task').count(),5);
 await page.getByRole('button',{name:'Lukk dagen',exact:true}).click();await checkFit();
 await page.clock.setFixedTime(new Date('2027-05-17T12:00:00+02:00'));
 await page.reload();await checkFit();
 const collision=page.locator('[data-date="2027-05-17"]');
 const labelBox=await collision.locator('.holiday-name').boundingBox(),cellBox=await collision.boundingBox();
 assert.ok(labelBox.x+labelBox.width<=cellBox.x+cellBox.width,'Combined holiday name remains inside its day');
 await page.setViewportSize({width:900,height:700});
 await page.locator('#appearance-toggle').click();await page.locator('#appearance-calendar').fill('#000000');
 for(const selector of ['.toolbar .eyebrow','#filter-status','.tidy-toolbar p'])assert.equal(await page.locator(selector).evaluate(e=>getComputedStyle(e).color),'rgb(255, 255, 255)');
 assert.deepEqual(errors,[]);
 console.log('Desktop six/five week fit, notice, overflow/day access, resize and draft/data preservation passed.');
}finally{await browser.close();}
