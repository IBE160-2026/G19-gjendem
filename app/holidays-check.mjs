import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,channel:'msedge'});
try {
 const context=await browser.newContext({viewport:{width:1500,height:1100},timezoneId:'Europe/Oslo'}),page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.clock.setFixedTime(new Date('2027-05-17T12:00:00+02:00'));await page.goto('http://localhost:5173');
 const day=page.locator('[data-date="2027-05-17"]');
 assert.equal(await day.locator('.holiday-flag').count(),1);assert.match(await day.locator('.holiday-name').innerText(),/Grunnlovsdagen.*Andre pinsedag/);
 assert.equal(await day.getAttribute('aria-current'),'date');assert.match(await day.locator('.day-number').getAttribute('aria-label'),/Andre pinsedag/);
 assert.equal(await page.evaluate(()=>localStorage.getItem('smart-todo.v1')),null);
 await day.locator('.add').click();await page.getByLabel('Hva skal du gjøre?',{exact:true}).fill('Feire sammen');await page.getByRole('button',{name:'Lagre oppgave',exact:true}).click();await page.waitForSelector('#editor',{state:'detached'});
 assert.equal(await day.locator('.task').count(),1);
 const stored=await page.evaluate(()=>localStorage.getItem('smart-todo.v1'));
 await page.locator('#category-filter').selectOption('Jobb');assert.equal(await day.locator('.task').count(),0);assert.equal(await day.locator('.holiday-flag').count(),1);await page.locator('#clear-filter').click();
 await day.locator('.day-number').click();assert.match(await page.locator('#expanded-day .holiday-name').innerText(),/Grunnlovsdagen.*Andre pinsedag/);await page.getByRole('button',{name:'Lukk dagen',exact:true}).click();
 await page.evaluate(()=>{const c=document.createElement('canvas');c.width=500;c.height=300;const x=c.getContext('2d');x.fillStyle='#ac1825';x.fillRect(0,0,500,300);localStorage.setItem('smart-todo.appearance.v1',JSON.stringify({version:1,background:'#000000',calendar:'#000000',days:'#ac1825',image:'',gridImage:c.toDataURL('image/jpeg')}));});await page.reload();
 assert.equal(await day.locator('.day-number').evaluate(el=>getComputedStyle(el).color),'rgb(172, 24, 37)');
 assert.equal(await day.locator('.holiday-name').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(255, 255, 255)');
 const box=await day.boundingBox(),flag=await day.locator('.holiday-flag').boundingBox(),task=await day.locator('.task').boundingBox();
 assert.ok(box.x+box.width-flag.x-flag.width<12);assert.ok(box.y+box.height-flag.y-flag.height<12);assert.ok(task.y+task.height<=flag.y);
 await page.screenshot({path:'app/test-results/holidays.png',fullPage:true});
 await page.locator('#previous').click();assert.equal(await page.locator('[data-date="2027-04-01"] .holiday-flag').count(),0);await page.locator('#previous').click();assert.match(await page.locator('[data-date="2027-03-28"] .holiday-name').innerText(),/Første påskedag/);
 assert.equal(await page.evaluate(()=>localStorage.getItem('smart-todo.v1')),stored);assert.deepEqual(errors,[]);
 await context.close();console.log('Holiday UI passed: names/collision, red date, bottom-right flag, task entry, filters, expanded day, custom photo and storage preservation.');
}finally{await browser.close();}
