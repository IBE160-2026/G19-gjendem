import test from 'node:test';
import assert from 'node:assert/strict';
import {appearanceKey,defaultAppearance,parseAppearance,textColour,saveAppearance} from './appearance.js';
test('appearance validation and storage are independent, atomic and stale-safe',()=>{
 const data=new Map([['smart-todo.v1','tasks unchanged']]);const storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)};
 assert.deepEqual(parseAppearance(null),defaultAppearance);
 const raw=saveAppearance(storage,{...defaultAppearance,days:'#000000'},null);
 assert.equal(parseAppearance(raw).days,'#000000');assert.equal(data.get('smart-todo.v1'),'tasks unchanged');
 assert.throws(()=>saveAppearance(storage,defaultAppearance,null));assert.equal(data.get(appearanceKey),raw);
 assert.throws(()=>saveAppearance({...storage,setItem:()=>{throw Error('quota');}},defaultAppearance,raw));assert.equal(data.get(appearanceKey),raw);
 for(const value of [null,{}, {...defaultAppearance,version:2},{...defaultAppearance,days:'red'},{...defaultAppearance,image:'https://example.com/image.jpg'},{...defaultAppearance,image:'data:image/svg+xml;base64,AAAA'}])assert.throws(()=>parseAppearance(JSON.stringify(value)));
});
test('contrast selects readable black or white across RGB samples',()=>{
 for(let r=0;r<=255;r+=17)for(let g=0;g<=255;g+=17)for(let b=0;b<=255;b+=17){
  const hex='#'+[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('');
  const linear=[r,g,b].map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);
  const luminance=linear[0]*.2126+linear[1]*.7152+linear[2]*.0722;
  const ratio=textColour(hex)==='#ffffff'?1.05/(luminance+.05):(luminance+.05)/.05;assert.ok(ratio>=4.5);
 }
});
