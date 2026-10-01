// Optional integration check. Requires externally installed Playwright and running local server.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({headless:true,channel:'msedge'});
try {
  const context = await browser.newContext({viewport:{width:1440,height:1100}});
  const page = await context.newPage(); const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://localhost:5173');
  await page.evaluate(() => {
    const d=new Date(); const date=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    localStorage.setItem('smart-todo.v1',JSON.stringify({version:1,tasks:[
      {id:'legacy',title:'Handle mat',category:'Familie',date},
      {id:'early',title:'Tidlig vakt',category:'Jobb',date,start:'00:15',end:'01:00'},
      {id:'late',title:'Kveldslesing',category:'Skole',date,start:'23:15',end:'23:59'},
      {id:'morning',title:'Skrive rapport',category:'Jobb',date,start:'09:15',end:'10:15'}
    ]}));
  });
  await page.reload();
  const openDay=async()=>page.locator('[aria-current="date"] .day-number').click();
  await openDay();
  assert.equal(await page.locator('.time-slot').count(),24);
  assert.equal(await page.locator('.untimed .task').count(),1);
  assert.equal(await page.locator('.timeline .task').count(),3);
  assert.deepEqual(await page.locator('.timeline .task-title').allTextContents(),['Tidlig vakt','Skrive rapport','Kveldslesing']);
  await page.getByRole('button',{name:'Ny oppgave klokken 09:00',exact:true}).click();
  assert.equal(await page.getByLabel('Start (valgfritt)',{exact:true}).inputValue(),'09:00');
  assert.equal(await page.getByLabel('Slutt (valgfritt)',{exact:true}).inputValue(),'');
  await page.getByLabel('Hva skal du gjøre?').fill('Forelesning');
  await page.getByRole('button',{name:'Lagre oppgave'}).click();
  await page.getByRole('alert').filter({hasText:'både start og slutt'}).waitFor();
  await page.getByLabel('Slutt (valgfritt)',{exact:true}).fill('10:00');
  await page.getByRole('button',{name:'Lagre oppgave'}).click();
  await page.waitForSelector('#expanded-day',{state:'detached'});
  assert.equal(await page.locator('.week .conflict').count(),2);
  await openDay();
  assert.equal(await page.locator('.timeline .conflict').count(),2);
  const red=await page.locator('.timeline .conflict .task-title').first().evaluate(el=>getComputedStyle(el).color);
  assert.equal(red,'rgb(172, 24, 37)');
  await page.locator('.timeline').getByRole('checkbox',{name:'Ferdig: Forelesning',exact:true}).click();
  await page.waitForFunction(()=>document.querySelectorAll('.conflict').length===0);
  assert.equal(await page.locator('.timeline .completed').count(),1);
  await page.locator('.timeline').getByRole('checkbox',{name:'Ferdig: Forelesning',exact:true}).click();
  await page.waitForFunction(()=>document.querySelectorAll('.timeline .conflict').length===2);
  await page.locator('.timeline').getByRole('button',{name:'Rediger Forelesning',exact:true}).click();
  await page.getByLabel('Start (valgfritt)',{exact:true}).fill('10:15');
  await page.getByLabel('Slutt (valgfritt)',{exact:true}).fill('11:30');
  await page.locator('.timeline').getByRole('checkbox',{name:'Ferdig: Forelesning',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('.timeline .completed'));
  assert.equal(await page.getByLabel('Start (valgfritt)',{exact:true}).inputValue(),'10:15');
  assert.equal(await page.getByLabel('Slutt (valgfritt)',{exact:true}).inputValue(),'11:30');
  await page.locator('.timeline').getByRole('checkbox',{name:'Ferdig: Forelesning',exact:true}).click();
  await page.waitForFunction(()=>!document.querySelector('.timeline .completed'));
  await page.getByRole('button',{name:'Lagre oppgave'}).click();
  await page.waitForSelector('#expanded-day',{state:'detached'});
  assert.equal(await page.locator('.conflict').count(),0);
  await page.reload(); await openDay();
  assert.match(await page.locator('.timeline').getByRole('button',{name:'Rediger Forelesning',exact:true}).innerText(),/10:15–11:30/);
  await page.locator('.timeline').getByRole('button',{name:'Rediger Forelesning',exact:true}).click();
  await page.getByLabel('Start (valgfritt)',{exact:true}).fill('');
  await page.getByLabel('Slutt (valgfritt)',{exact:true}).fill('');
  await page.getByRole('button',{name:'Lagre oppgave'}).click();
  await page.waitForSelector('#expanded-day',{state:'detached'}); await openDay();
  assert.equal(await page.locator('.untimed .task').count(),2);
  const other = await context.newPage(); await other.goto('http://localhost:5173');
  await page.locator('.untimed').getByRole('button',{name:'Rediger Forelesning',exact:true}).click();
  await page.getByLabel('Start (valgfritt)',{exact:true}).fill('12:30');
  await page.getByLabel('Slutt (valgfritt)',{exact:true}).fill('13:45');
  await other.locator('.week').getByRole('button',{name:'Rediger Forelesning',exact:true}).click();
  await other.getByLabel('Start (valgfritt)',{exact:true}).fill('14:00');
  await other.getByLabel('Slutt (valgfritt)',{exact:true}).fill('15:00');
  await other.getByRole('button',{name:'Lagre oppgave'}).click();
  await other.waitForSelector('#expanded-day',{state:'detached'});
  await page.getByRole('button',{name:'Lagre oppgave'}).click();
  await page.getByRole('alert').filter({hasText:'annen fane'}).waitFor();
  assert.equal(await page.getByLabel('Start (valgfritt)',{exact:true}).inputValue(),'12:30');
  assert.equal(await page.getByLabel('Slutt (valgfritt)',{exact:true}).inputValue(),'13:45');
  page.once('dialog',dialog=>dialog.accept());
  await page.getByRole('button',{name:'Slett oppgave'}).click();
  await page.getByRole('alert').filter({hasText:'annen fane'}).waitFor();
  assert.equal(await page.getByLabel('Slutt (valgfritt)',{exact:true}).inputValue(),'13:45');
  page.once('dialog',dialog=>dialog.accept());
  await page.getByRole('button',{name:'Avbryt'}).click(); await openDay();
  await page.getByRole('button',{name:'Ny oppgave klokken 12:00',exact:true}).click();
  await page.getByLabel('Hva skal du gjøre?').fill('Behold tiden');
  await page.getByLabel('Slutt (valgfritt)',{exact:true}).fill('13:30');
  await page.evaluate(()=>{Storage.prototype.setItem=()=>{throw new Error('quota');};});
  await page.getByRole('button',{name:'Lagre oppgave'}).click();
  await page.getByRole('alert').filter({hasText:'ikke lagret'}).waitFor();
  assert.equal(await page.getByLabel('Slutt (valgfritt)',{exact:true}).inputValue(),'13:30');
  assert.equal(await page.locator('#expanded-day').count(),1);
  page.once('dialog',dialog=>dialog.accept()); await page.getByRole('button',{name:'Avbryt'}).click();
  await openDay();
  await page.screenshot({path:'app/test-results/timetable.png',fullPage:true});
  assert.deepEqual(errors,[]);
  console.log('Timetable browser checks passed: 24 hours, ordering, legacy untimed, prefill, validation, conflict colours, completion, adjacent intervals, reload, clear times, failed-save recovery.');
} finally {await browser.close();}
