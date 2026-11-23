import test from 'node:test';
import assert from 'node:assert/strict';
import {pastUnfinishedTasks} from './model.js';

test('past overview selects incomplete dated tasks, ordered by date, without mutating data',()=>{
  const tasks=[
    {id:'recent',date:'2026-11-22',title:'Recent'},
    {id:'today',date:'2026-11-23'},
    {id:'done',date:'2026-11-01',completed:true},
    {id:'old',date:'2025-12-31',title:'Old',completed:false},
    {id:'future',date:'2026-11-24'},
    {id:'undated',date:''},
    {id:'archived',date:'2026-10-01',completed:true,archived:true}
  ];
  const before=structuredClone(tasks);
  assert.deepEqual(pastUnfinishedTasks(tasks,new Date(2026,10,23)).map(t=>t.id),['old','recent']);
  assert.deepEqual(tasks,before);
  assert.deepEqual(pastUnfinishedTasks([],new Date(2026,10,23)),[]);
});
test('uses local dates at year boundary and excludes completed tasks regardless of category',()=>{
  const tasks=[{id:'x',date:'2026-12-31',category:'Jobb',title:'x'}];
  assert.equal(pastUnfinishedTasks(tasks,new Date(2026,11,31,23,59)).length,0);
  assert.equal(pastUnfinishedTasks(tasks,new Date(2027,0,1,0,0)).length,1);
});
