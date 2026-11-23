import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {defaultAppearance} from './appearance.js';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,channel:'msedge'});
try {
 const context=await browser.newContext({viewport:{width:1500,height:1100},timezoneId:'Europe/Oslo'});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.clock.setFixedTime(new Date('2026-12-25T12:00:00+01:00'));
 await page.goto('http://localhost:5173');
 const data={version:1,customCategories:[{name:'Hobby',color:'#123456'}],categoryOverrides:{Ellers:{name:'Privat',color:'#8654ad'}},tasks:[
  {id:'a',title:'Arbeid',date:'2026-12-25',start:'12:00',end:'13:00',category:'Hobby'},
  {id:'b',title:'Overlapp',date:'2026-12-25',start:'12:30',end:'13:30',category:'Ellers'},
  {id:'c',title:'Fullført',date:'2026-12-25',category:'Jobb',completed:true}
 ]};
 await page.evaluate(data=>localStorage.setItem('smart-todo.v1',JSON.stringify(data)),data);await page.reload();
 const stored=await page.evaluate(()=>localStorage.getItem('smart-todo.v1'));
 const open=()=>page.locator('#appearance-toggle').click();
 const save=async()=>{await page.locator('#appearance-save').click();await page.locator('#appearance-status').filter({hasText:'er lagret'}).waitFor();};
 const image=async colour=>Buffer.from(await page.evaluate(colour=>{const c=document.createElement('canvas');c.width=400;c.height=200;const x=c.getContext('2d');x.fillStyle=colour;x.fillRect(0,0,400,200);return c.toDataURL('image/png').split(',')[1];},colour),'base64');
 const red=await image('#ff0000'),blue=await image('#0000ff');
 const checkContrast=async selector=>{
  const samples=await page.locator(selector).evaluateAll(nodes=>nodes.map(el=>{
   let parent=el,bg;
   while(parent){bg=getComputedStyle(parent).backgroundColor;const rgba=bg.match(/[\d.]+/g)?.map(Number);if(rgba&&(rgba.length===3||rgba[3]===1))break;parent=parent.parentElement;}
   return {fg:getComputedStyle(el).color,bg};
  }));
  assert.ok(samples.length,selector);
  const lum=rgb=>{const v=rgb.match(/[\d.]+/g).slice(0,3).map(Number).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return v[0]*.2126+v[1]*.7152+v[2]*.0722;};
  for(const {fg,bg} of samples){const a=lum(fg),b=lum(bg);assert.ok((Math.max(a,b)+.05)/(Math.min(a,b)+.05)>=4.5,`${selector}: ${fg} on ${bg}`);}
 };
 await open();await page.locator('#appearance-calendar').fill('#000000');await page.locator('#appearance-days').fill('#000000');
 await checkContrast('.day-number');
 await page.locator('[data-date="2026-12-24"] .day-number').hover();await checkContrast('[data-date="2026-12-24"] .day-number');
 await page.locator('#appearance-image').setInputFiles({name:'red.png',mimeType:'image/png',buffer:red});
 await page.locator('#appearance-image-state').filter({hasText:'valgt'}).waitFor();
 await page.locator('#appearance-grid-image').setInputFiles({name:'blue.png',mimeType:'image/png',buffer:blue});
 await page.locator('#appearance-grid-state').filter({hasText:'valgt'}).waitFor();
 assert.equal(await page.evaluate(()=>localStorage.getItem('smart-todo.appearance.v1')),null);
 await save();await page.reload();
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('smart-todo.appearance.v1')));
 assert.ok(saved.image&&saved.gridImage);assert.notEqual(saved.image,saved.gridImage);
 assert.equal(await page.locator('html').evaluate(el=>getComputedStyle(el).backgroundImage),`url("${saved.image}")`);
 assert.equal(await page.locator('.month-grid').evaluate(el=>getComputedStyle(el).backgroundImage),`url("${saved.gridImage}")`);
 assert.equal(await page.locator('.month-grid').evaluate(el=>getComputedStyle(el).backgroundSize),'cover');
 assert.equal(await page.locator('.month-grid').evaluate(el=>getComputedStyle(el).backgroundRepeat),'no-repeat');
 for(const selector of ['.day-number','.today-label','.holiday-name','.task-title','.conflict-label','.task small'])await checkContrast(selector);
 assert.equal(await page.locator('.week .conflict').count(),2);
 assert.match(await page.locator('.completed .task-title').evaluate(el=>getComputedStyle(el).textDecorationLine),/line-through/);
 await page.screenshot({path:'app/test-results/appearance-acceptance.png',fullPage:true});
 await open();await page.locator('#appearance-remove').click();
 assert.equal(await page.locator('html').evaluate(el=>getComputedStyle(el).backgroundImage),'none');
 assert.equal(await page.locator('.month-grid').evaluate(el=>getComputedStyle(el).backgroundImage),`url("${saved.gridImage}")`);
 await page.locator('#appearance-cancel').click();
 assert.equal(await page.locator('html').evaluate(el=>getComputedStyle(el).backgroundImage),`url("${saved.image}")`);
 await open();
 for(const [input,error] of [['#appearance-image','#appearance-image-error'],['#appearance-grid-image','#appearance-grid-image-error']]) {
  for(const file of [{name:'invalid.gif',mimeType:'image/gif',buffer:red},{name:'oversized.png',mimeType:'image/png',buffer:Buffer.alloc(10*1024*1024+1)}]) {
   await page.locator(input).setInputFiles(file);await page.locator(error).filter({hasText:'maks 10 MB'}).waitFor();
   assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('smart-todo.appearance.v1'))),saved);
   assert.equal(await page.locator('html').evaluate(el=>getComputedStyle(el).backgroundImage),`url("${saved.image}")`);
   assert.equal(await page.locator('.month-grid').evaluate(el=>getComputedStyle(el).backgroundImage),`url("${saved.gridImage}")`);
  }
 }
 await page.locator('#appearance-cancel').click();
 await open();await page.locator('#appearance-grid-remove').click();
 assert.equal(await page.locator('.month-grid').evaluate(el=>getComputedStyle(el).backgroundImage),'none');
 assert.equal(await page.locator('.day').first().evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(0, 0, 0)');
 assert.equal(await page.locator('html').evaluate(el=>getComputedStyle(el).backgroundImage),`url("${saved.image}")`);
 await page.locator('#appearance-cancel').click();
 // Reset previews both images and all colours; Cancel restores the rendered saved choice.
 await open();await page.locator('#appearance-reset').click();
 assert.equal(await page.locator('html').evaluate(el=>getComputedStyle(el).backgroundImage),'none');
 assert.equal(await page.locator('.month-grid').evaluate(el=>getComputedStyle(el).backgroundImage),'none');
 assert.equal(await page.locator('html').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(245, 246, 248)');
 assert.equal(await page.locator('.calendar-card').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(255, 255, 255)');
 assert.equal(await page.locator('[data-date="2026-12-24"]').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(255, 255, 255)');
 await page.locator('#appearance-cancel').click();
 assert.equal(await page.locator('html').evaluate(el=>getComputedStyle(el).backgroundImage),`url("${saved.image}")`);
 assert.equal(await page.locator('.month-grid').evaluate(el=>getComputedStyle(el).backgroundImage),`url("${saved.gridImage}")`);
 assert.equal(await page.locator('.calendar-card').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(0, 0, 0)');
 assert.equal(await page.locator('html').evaluate(el=>el.style.getPropertyValue('--days-bg')),'#000000');
 assert.equal(await page.locator('html').evaluate(el=>el.style.getPropertyValue('--page-bg')),saved.background);
 await page.locator('[data-date="2026-12-25"] .add').click();await page.getByLabel('Hva skal du gjøre?',{exact:true}).fill('Ulagret oppgave');
 await page.locator('#manage-categories').click();const category=page.locator('[data-category-id="Hobby"]');await category.getByLabel('Navn',{exact:true}).fill('Ulagret kategori');
 await open();await page.locator('#appearance-reset').click();
 assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('smart-todo.appearance.v1'))),saved);
 await save();
 assert.equal(await page.getByLabel('Hva skal du gjøre?',{exact:true}).inputValue(),'Ulagret oppgave');
 assert.equal(await category.getByLabel('Navn',{exact:true}).inputValue(),'Ulagret kategori');
 assert.equal(await page.evaluate(()=>localStorage.getItem('smart-todo.v1')),stored);
 await category.getByRole('button',{name:'Avbryt',exact:true}).click();
 page.once('dialog',d=>d.accept());await page.locator('#editor').getByRole('button',{name:'Avbryt',exact:true}).click();
 await page.reload();
 assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('smart-todo.appearance.v1'))),defaultAppearance);
 assert.equal(await page.locator('html').evaluate(el=>getComputedStyle(el).backgroundImage),'none');
 assert.equal(await page.locator('.month-grid').evaluate(el=>getComputedStyle(el).backgroundImage),'none');
 assert.equal(await page.evaluate(()=>localStorage.getItem('smart-todo.v1')),stored);
 // Exercise desktop widths and a 200%-equivalent CSS viewport (not native browser zoom).
 for(const size of [{width:1366,height:768},{width:1920,height:1080}]) {
  await page.setViewportSize(size);await open();
  await page.locator('#appearance-days').fill('#e4f0fa');await save();
  await page.locator('#appearance-cancel').click();
  await page.locator('[data-date="2026-12-25"] .day-number').click();
  assert.equal(await page.locator('#expanded-day').isVisible(),true);
  await page.getByRole('button',{name:'Lukk dagen',exact:true}).click();
 }
 const zoomContext=await browser.newContext({viewport:{width:683,height:384},deviceScaleFactor:2,timezoneId:'Europe/Oslo'});
 const zoom=await zoomContext.newPage();zoom.on('pageerror',e=>errors.push(e.message));
 await zoom.goto('http://localhost:5173');
 await zoom.locator('#appearance-toggle').click();
 await zoom.locator('#appearance-days').fill('#000000');
 await zoom.locator('#appearance-save').click();await zoom.locator('#appearance-status').filter({hasText:'er lagret'}).waitFor();
 await zoom.locator('#appearance-reset').click();
 await zoom.locator('#appearance-cancel').click();
 await zoom.locator('.day-number').first().click();
 await zoom.getByRole('button',{name:'Lukk dagen',exact:true}).click();
 await zoom.locator('#appearance-toggle').click();await zoom.locator('#appearance-save').scrollIntoViewIfNeeded();
 await zoom.screenshot({path:'app/test-results/appearance-zoom-equivalent.png'});
 assert.equal(await zoom.locator('#appearance-save').evaluate(el=>{const r=el.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight;}),true);
 await zoomContext.close();
 assert.deepEqual(errors,[]);
 console.log('Epic 3 integration passed: independent dual photos, rendered contrast/status cues, removal/cancel, reset persistence and task/category record/draft preservation.');
} finally {await browser.close();}
