import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,channel:'msedge'});
try {
 const context=await browser.newContext({viewport:{width:1500,height:1100}});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://localhost:5173');
 const asset=await page.request.get('http://localhost:5173/assets/mountains-lake.jpg');
 assert.equal(asset.status(),200);assert.equal(asset.headers()['content-type'],'image/jpeg');
 const open=()=>page.locator('#appearance-toggle').click();
 const save=async()=>{await page.locator('#appearance-save').click();await page.locator('#appearance-status').filter({hasText:'er lagret'}).waitFor();};
 const choose=async key=>{await page.locator(`[data-landscape="${key}"]`).click();await page.locator('#appearance-save').waitFor({state:'visible'});await page.waitForFunction(()=>!document.querySelector('#appearance-save').disabled);};
 await open();await choose('image');
 assert.equal(await page.evaluate(()=>localStorage.getItem('smart-todo.appearance.v1')),null);
 assert.match(await page.locator('html').evaluate(e=>getComputedStyle(e).backgroundImage),/data:image\/jpeg/);
 const mountain=await page.locator('html').evaluate(e=>getComputedStyle(e).backgroundImage);
 // Use a distinct uploaded surrounding image so wrong-target assignments are detectable.
 const fixture=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=40;c.height=40;const x=c.getContext('2d');x.fillStyle='#24466a';x.fillRect(0,0,40,40);return c.toDataURL('image/png').split(',')[1];});
 await page.locator('#appearance-image').setInputFiles({name:'fixture.png',mimeType:'image/png',buffer:Buffer.from(fixture,'base64')});
 await page.waitForFunction(()=>!document.querySelector('#appearance-save').disabled);
 await save();const saved=await page.evaluate(()=>localStorage.getItem('smart-todo.appearance.v1'));
 assert.equal(JSON.parse(saved).gridImage,'');
 await choose('gridImage');await page.locator('#appearance-cancel').click();
 assert.equal(await page.locator('.month-grid').evaluate(e=>getComputedStyle(e).backgroundImage),'none');
 await open();await choose('gridImage');await save();await page.reload();
 assert.equal(await page.locator('.month-grid').evaluate(e=>getComputedStyle(e).backgroundImage),mountain);
 assert.equal(JSON.parse(await page.evaluate(()=>localStorage.getItem('smart-todo.appearance.v1'))).image,JSON.parse(saved).image);
 // A late preset response cannot revive an image after Cancel.
 await open();await page.locator('#appearance-grid-remove').click();await save();
 let release,arrived;const arrival=new Promise(r=>arrived=r),gate=new Promise(r=>release=r);
 await page.route('**/assets/mountains-lake.jpg',async route=>{arrived();await gate;await route.fulfill({status:200,contentType:'image/jpeg',body:await asset.body()});});
 await page.locator('[data-landscape="gridImage"]').click();await arrival;
 assert.equal(await page.locator('#appearance-save').isDisabled(),true);
 await page.locator('#appearance-cancel').click();release();
 await page.waitForResponse(r=>r.url().endsWith('/assets/mountains-lake.jpg'));
 await page.waitForTimeout(100);
 assert.equal(await page.locator('.month-grid').evaluate(e=>getComputedStyle(e).backgroundImage),'none');
 await page.unroute('**/assets/mountains-lake.jpg');
 await open();await choose('gridImage');await save();
 const beforeFailure=await page.evaluate(()=>localStorage.getItem('smart-todo.appearance.v1'));
 await page.route('**/assets/mountains-lake.jpg',route=>route.fulfill({status:503,body:'unavailable'}));
 await choose('gridImage');assert.match(await page.locator('#appearance-grid-image-error').textContent(),/ikke lastes/);
 assert.equal(await page.locator('.month-grid').evaluate(e=>getComputedStyle(e).backgroundImage),mountain);
 assert.equal(await page.evaluate(()=>localStorage.getItem('smart-todo.appearance.v1')),beforeFailure);
 await page.unroute('**/assets/mountains-lake.jpg');await page.locator('#appearance-cancel').click();
 // Record default mountain surroundings and a second continuous-grid preview.
 await open();await choose('image');await page.locator('#appearance-grid-remove').click();await save();await page.locator('#appearance-cancel').click();
 await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:process.env.TEMP+'/smart-todo-nature-surround.png',fullPage:true});
 await open();await choose('gridImage');await save();await page.locator('#appearance-cancel').click();
 await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:process.env.TEMP+'/smart-todo-nature-grid.png',fullPage:true});
 assert.deepEqual(errors,[]);console.log('Nature preset delivery, independent preview/save/reload/cancel, late-response cancellation and load failure passed.');
} finally {await browser.close();}
