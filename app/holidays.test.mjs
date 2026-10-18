import test from 'node:test';
import assert from 'node:assert/strict';
import {norwegianHolidays} from './model.js';
test('2026 named Norwegian holidays match independently published calendar',()=>{
 const actual=Object.fromEntries([...norwegianHolidays(2026)].sort());
 assert.deepEqual(actual,{
 '2026-01-01':['Første nyttårsdag'],'2026-04-02':['Skjærtorsdag'],'2026-04-03':['Langfredag'],'2026-04-05':['Første påskedag'],'2026-04-06':['Andre påskedag'],
 '2026-05-01':['Arbeidernes dag'],'2026-05-14':['Kristi himmelfartsdag'],'2026-05-17':['Grunnlovsdagen'],'2026-05-24':['Første pinsedag'],'2026-05-25':['Andre pinsedag'],'2026-12-25':['Første juledag'],'2026-12-26':['Andre juledag']});
});
test('2027 handles DST Easter and coinciding holidays without overwriting',()=>{
 const days=norwegianHolidays(2027);
 for(const [date,name] of [['03-25','Skjærtorsdag'],['03-26','Langfredag'],['03-28','Første påskedag'],['03-29','Andre påskedag'],['05-06','Kristi himmelfartsdag'],['05-16','Første pinsedag']])assert.deepEqual(days.get(`2027-${date}`),[name]);
 assert.deepEqual(days.get('2027-05-17'),['Grunnlovsdagen','Andre pinsedag']);
 assert.equal(days.has('2027-12-24'),false);assert.equal(days.has('2027-03-27'),false);
});
test('USNO Easter examples and supported-year invariants',()=>{
 for(const [year,date] of [[1954,'04-18'],[1962,'04-22'],[2010,'04-04']])assert.deepEqual(norwegianHolidays(year).get(`${year}-${date}`),['Første påskedag']);
 for(let year=1900;year<=2099;year++){
  const days=norwegianHolidays(year);assert.equal([...days.values()].flat().length,12);
  const easter=[...days].find(([,names])=>names.includes('Første påskedag'))[0];
  assert.ok(easter>=`${year}-03-22`&&easter<=`${year}-04-25`);assert.equal(new Date(`${easter}T12:00:00Z`).getUTCDay(),0);
 }
 for(const year of [1899,2100,2026.5,NaN,'2026'])assert.equal(norwegianHolidays(year).size,0);
});
