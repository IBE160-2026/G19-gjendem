import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({headless:true,channel:'msedge'});
try {
  const context=await browser.newContext({viewport:{width:1500,height:1000},timezoneId:'Europe/Oslo'});
  const page=await context.newPage(); const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.clock.install({time:new Date('2026-10-01T12:00:00+02:00')});
  await page.goto('http://localhost:5173');
  await page.evaluate(()=>localStorage.setItem('smart-todo.v1',JSON.stringify({version:1,tasks:[
    {id:'a',title:'Første',date:'2026-10-01',category:'Jobb',start:'09:00',end:'10:00'},
    {id:'b',title:'Andre',date:'2026-10-01',category:'Skole',start:'09:30',end:'10:30'},
    {id:'c',title:'Tredje',date:'2026-10-01',category:'Familie'},
    {id:'d',title:'Ferdig',date:'2026-10-01',category:'Ellers',completed:true},
    {id:'w',title:'Denne uken',date:'2026-10-04',category:'Familie'},
    {id:'m',title:'Neste uke',date:'2026-10-05',category:'Skole'},
    {id:'n',title:'Neste måned',date:'2026-11-03',category:'Jobb'},
    {id:'z',title:'Neste år',date:'2027-01-01',category:'Ellers'},
    {id:'old',title:'Tidligere',date:'2026-09-30',category:'Ellers'}
  ]})));
  await page.reload();
  const today=page.locator('#period-today'), week=page.locator('#period-week'), coming=page.locator('#period-upcoming');
  assert.equal(await today.locator('.task').count(),2);
  assert.equal(await week.locator('.task').count(),1);
  assert.equal(await coming.locator('.task').count(),2);
  assert.equal(await page.locator('#upcoming .task-title').filter({hasText:'Tidligere'}).count(),0);
  await today.getByRole('button',{name:/Vis mer/}).click();
  assert.equal(await today.locator('.task').count(),4);
  assert.equal(await coming.locator('.task').count(),2);
  assert.match(await today.locator('.completed .task-title').evaluate(el=>getComputedStyle(el).textDecorationLine),/line-through/);
  await today.getByRole('checkbox',{name:'Ferdig: Første',exact:true}).click();
  await page.waitForFunction(()=>document.querySelectorAll('#upcoming .conflict').length===0);
  assert.equal(await today.locator('.task').count(),4);
  assert.equal(await page.locator('.week [data-task-id="a"] input').isChecked(),true);
  assert.equal(await today.getByRole('checkbox',{name:'Ferdig: Første'}).evaluate(el=>el===document.activeElement),true);
  await page.getByRole('button',{name:'Neste måned',exact:true}).click();
  assert.equal(await today.locator('.task').count(),4);
  await today.getByRole('button',{name:'Rediger Tredje',exact:true}).click();
  assert.match(await page.locator('#month').innerText(),/oktober/i);
  await page.getByLabel('Hva skal du gjøre?').fill('Ulagret utkast');
  await page.evaluate(()=>{window.realSetItem=Storage.prototype.setItem;Storage.prototype.setItem=()=>{throw new Error('quota');};});
  await today.getByRole('checkbox',{name:'Ferdig: Tredje',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('#message').textContent.includes('ikke lagret'));
  assert.equal(await today.getByRole('checkbox',{name:'Ferdig: Tredje',exact:true}).isChecked(),false);
  assert.equal(await page.locator('.week [data-task-id="c"] input').isChecked(),false);
  assert.equal(await page.getByLabel('Hva skal du gjøre?').inputValue(),'Ulagret utkast');
  assert.equal(await today.getByRole('checkbox',{name:'Ferdig: Tredje',exact:true}).isEnabled(),true);
  await page.evaluate(()=>{Storage.prototype.setItem=window.realSetItem;});
  await today.getByRole('checkbox',{name:'Ferdig: Tredje',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('#period-today [data-task-id="c"] input').checked);
  assert.equal(await page.getByLabel('Hva skal du gjøre?').inputValue(),'Ulagret utkast');
  await page.getByRole('button',{name:'Lagre oppgave'}).click();
  await page.waitForSelector('#editor',{state:'detached'});
  await today.getByRole('button',{name:'Rediger Ulagret utkast',exact:true}).click();
  await page.getByLabel('Hva skal du gjøre?').fill('Et nytt utkast');
  await coming.getByRole('button',{name:/Vis mer/}).click();
  assert.equal(await page.getByLabel('Hva skal du gjøre?').inputValue(),'Et nytt utkast');
  page.once('dialog',d=>d.dismiss());
  await coming.getByRole('button',{name:'Rediger Neste år',exact:true}).click();
  assert.equal(await page.getByLabel('Hva skal du gjøre?').inputValue(),'Et nytt utkast');
  page.once('dialog',d=>d.accept());
  await coming.getByRole('button',{name:'Rediger Neste år',exact:true}).click();
  assert.match(await page.locator('#month').innerText(),/2027/);
  assert.equal(await page.getByLabel('Hva skal du gjøre?').inputValue(),'Neste år');
  await page.getByLabel('Dato',{exact:true}).fill('2026-10-02');
  await page.getByRole('button',{name:'Lagre oppgave'}).click();
  await page.waitForSelector('#editor',{state:'detached'});
  assert.equal(await week.getByRole('button',{name:'Rediger Neste år',exact:true}).count(),1);
  await today.getByRole('button',{name:'Vis mindre'}).click();
  assert.equal(await today.locator('.task').count(),2);
  const sidebarBox=await page.locator('#upcoming').boundingBox(), calendarBox=await page.locator('.calendar-card').boundingBox();
  assert.ok(sidebarBox.x+sidebarBox.width<=calendarBox.x);
  await page.screenshot({path:'app/test-results/sidebar.png',fullPage:true});
  await page.clock.setSystemTime(new Date('2026-10-01T23:59:00+02:00'));
  await today.getByRole('button',{name:/Vis mer/}).focus();
  await page.clock.setSystemTime(new Date('2026-10-02T00:01:00+02:00'));
  await today.getByRole('button',{name:/Vis mer/}).click();
  assert.equal(await today.locator('h3').evaluate(el=>el===document.activeElement),true);
  await page.clock.runFor(31000);
  assert.deepEqual(await today.locator('.task-title').allTextContents(),['Neste år']);
  await page.clock.setSystemTime(new Date('2026-10-04T23:58:00+02:00')); await page.clock.runFor(31000);
  await today.getByRole('button',{name:'Rediger Denne uken',exact:true}).click();
  await page.getByLabel('Hva skal du gjøre?').fill('Utkast gjennom helgen');
  await page.clock.setSystemTime(new Date('2026-10-05T00:01:00+02:00')); await page.clock.runFor(31000);
  assert.deepEqual(await today.locator('.task-title').allTextContents(),['Neste uke']);
  assert.equal(await week.locator('.task').count(),0);
  assert.equal(await page.getByLabel('Hva skal du gjøre?').inputValue(),'Utkast gjennom helgen');
  assert.deepEqual(errors,[]);
  console.log('Sidebar checks passed: periods, two-row expansion, completed/conflict sync, focus, month-independent dates, cross-month edit, draft protection, moved task, midnight rollover and desktop layout.');
} finally {await browser.close();}
