import test from 'node:test';
import assert from 'node:assert/strict';
import {validDate, validTimes, conflictingIds, byTime, upcomingGroups, monthDays, readTasks, addTask, changeTask, archiveCompleted, storageKey} from './model.js';
const memory = () => { const data = new Map(); return {getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value)}; };
const task = {id:'one', title:'Levere rapport', date:'2026-09-27', category:'Ellers'};
test('calendar dates reject impossible dates and support leap years', () => {
  assert.equal(validDate('2024-02-29'), true); assert.equal(validDate('2026-02-29'), false);
  assert.equal(validDate('2026-13-01'), false); assert.equal(validDate('2026-9-1'), false);
  const days = monthDays(2026, 8); assert.equal(days[0], null); assert.equal(days[1], '2026-09-01');
  assert.equal(days.filter(Boolean).length, 30); assert.equal(days.length % 7, 0);
});
test('save and reload, retaining tasks saved by another tab', () => {
  const storage = memory(); assert.deepEqual(readTasks(storage), []);
  addTask(storage, task); addTask(storage, {...task, id:'two', category:'Jobb'});
  assert.equal(readTasks(storage).length, 2); assert.deepEqual(readTasks(storage)[0], task);
});
test('invalid and corrupt data are not overwritten', () => {
  const storage = memory(); storage.setItem(storageKey, '{broken');
  assert.throws(() => addTask(storage, task)); assert.equal(storage.getItem(storageKey), '{broken');
  storage.setItem(storageKey, JSON.stringify({version:2,tasks:[]})); assert.throws(() => readTasks(storage));
  assert.throws(() => addTask(memory(), {...task,title:'  '}));
});
test('storage write failures propagate without reporting saved state', () => {
  const storage = memory(); addTask(storage, task);
  const fail = {getItem:storage.getItem, setItem(){throw new Error('quota');}};
  assert.throws(() => addTask(fail, {...task,id:'two'}), /quota/);
  assert.equal(readTasks(storage).length, 1);
});
test('legacy tasks can be completed, reopened, edited and deleted without losing other tasks', () => {
  const storage = memory(); addTask(storage, task); addTask(storage, {...task,id:'two'});
  changeTask(storage, task.id, {completed:true});
  const original = readTasks(storage)[0];
  changeTask(storage, task.id, {title:'Revised',date:'2026-10-02',category:'Skole'}, original);
  assert.equal(readTasks(storage)[0].completed, true);
  changeTask(storage, task.id, {completed:false});
  assert.equal(readTasks(storage)[0].completed, false);
  changeTask(storage, task.id, null, readTasks(storage)[0]);
  assert.deepEqual(readTasks(storage).map(t=>t.id), ['two']);
});
test('stale edits and deleted records cannot overwrite or resurrect tasks', () => {
  const storage = memory(); addTask(storage, task);
  changeTask(storage, task.id, {title:'Changed elsewhere'});
  assert.throws(() => changeTask(storage, task.id, {title:'Stale'}, task), {code:'conflict'});
  assert.throws(() => changeTask(storage, task.id, null, task), {code:'conflict'});
  changeTask(storage, task.id, null);
  assert.throws(() => changeTask(storage, task.id, task), {code:'conflict'});
});
test('failed edit, completion and deletion preserve saved records', () => {
  const storage = memory(); addTask(storage, task);
  const fail = {getItem:storage.getItem,setItem(){throw new Error('quota');}};
  for (const change of [{title:'Changed'},{completed:true},null]) {
    assert.throws(() => changeTask(fail, task.id, change), /quota/);
    assert.deepEqual(readTasks(storage), [task]);
  }
});
test('optional times require a complete same-day interval with minute precision', () => {
  assert.equal(validTimes(undefined, undefined), true);
  assert.equal(validTimes('', ''), true);
  assert.equal(validTimes('00:00', '23:59'), true);
  assert.equal(validTimes('09:15', '10:05'), true);
  for (const pair of [['09:00',''],['','10:00'],['10:00','09:00'],['10:00','10:00'],['24:00','25:00'],[null,null],['9:00','10:00']]) assert.equal(validTimes(...pair), false);
  const storage = memory(); addTask(storage, task);
  changeTask(storage, task.id, {start:'09:15',end:'10:05'});
  assert.equal(readTasks(storage)[0].start, '09:15');
  changeTask(storage, task.id, {start:'',end:''});
  assert.equal(readTasks(storage)[0].end, '');
});
test('conflicts mark both unfinished tasks, exclude touching edges and other days', () => {
  const a = {...task,start:'09:00',end:'10:00'};
  const b = {...task,id:'two',start:'09:59',end:'11:00'};
  assert.deepEqual([...conflictingIds([a,b])], ['one','two']);
  assert.equal(conflictingIds([a,{...b,start:'10:00'}]).size, 0);
  assert.equal(conflictingIds([a,{...b,completed:true}]).size, 0);
  assert.equal(conflictingIds([a,{...b,date:'2026-09-28'}]).size, 0);
  assert.equal(conflictingIds([a,{...task,id:'untimed'}]).size, 0);
  assert.deepEqual([{...task,id:'untimed'},b,a].sort(byTime).map(t=>t.id), ['one','two','untimed']);
});
test('upcoming periods exclude past dates, separate Sunday from Monday and retain completion', () => {
  const records = ['2026-12-26','2026-12-27','2026-12-28','2027-01-01'].map((date,i)=>({...task,id:String(i),date,completed:true}));
  const sunday = upcomingGroups(records,new Date(2026,11,27,12));
  assert.deepEqual(sunday.today.map(t=>t.id),['1']); assert.equal(sunday.week.length,0);
  assert.deepEqual(sunday.upcoming.map(t=>t.id),['2','3']);
  const monday = upcomingGroups(records,new Date(2026,11,28,12));
  assert.deepEqual(monday.today.map(t=>t.id),['2']); assert.deepEqual(monday.week.map(t=>t.id),['3']);
  assert.equal(monday.upcoming.length,0);
});
test('upcoming uses dates then time with untimed last across DST week', () => {
  const records = [
    {...task,id:'untimed',date:'2026-10-25'},
    {...task,id:'late',date:'2026-10-25',start:'15:00',end:'16:00'},
    {...task,id:'early',date:'2026-10-25',start:'09:00',end:'10:00'},
    {...task,id:'next',date:'2026-10-26'}
  ];
  const groups = upcomingGroups(records,new Date(2026,9,24,12));
  assert.deepEqual(groups.week.map(t=>t.id),['early','late','untimed']);
  assert.deepEqual(groups.upcoming.map(t=>t.id),['next']);
});
test('descriptions preserve multiline text, survive completion and can be cleared', () => {
  const storage = memory(); addTask(storage, task);
  const description='Ta med notater\n<script>not executable</script>\nÆØÅ';
  changeTask(storage,task.id,{description});
  changeTask(storage,task.id,{completed:true});
  assert.equal(readTasks(storage)[0].description,description);
  changeTask(storage,task.id,{description:''});
  assert.equal(readTasks(storage)[0].description,'');
  assert.throws(()=>changeTask(storage,task.id,{description:42}));
});
test('cleanup retains full records, hides completed tasks from upcoming and reopening restores', () => {
  const storage=memory();addTask(storage,task);
  const done={...task,id:'done',completed:true,description:'Keep me',start:'12:00',end:'13:00'};
  addTask(storage,done);
  const result=archiveCompleted(storage);
  assert.equal(result.length,2);assert.deepEqual(result[1],{...done,archived:true});
  assert.deepEqual(upcomingGroups(result,new Date(2026,8,27)).today.map(t=>t.id),['one']);
  assert.deepEqual(archiveCompleted(storage),result);
  changeTask(storage,'done',{completed:false});
  assert.deepEqual(readTasks(storage)[1],{...done,completed:false,archived:false});
  const before=storage.getItem(storageKey);
  assert.throws(()=>archiveCompleted({getItem:storage.getItem,setItem(){throw new Error('quota');}}),/quota/);
  assert.equal(storage.getItem(storageKey),before);
  assert.throws(()=>changeTask(storage,'one',{archived:true}));
});
