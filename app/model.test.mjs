import test from 'node:test';
import assert from 'node:assert/strict';
import {validDate, monthDays, readTasks, addTask, storageKey} from './model.js';
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
