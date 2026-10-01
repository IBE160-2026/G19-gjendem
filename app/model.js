export const categories = ['Jobb', 'Skole', 'Familie', 'Ellers'];
export const storageKey = 'smart-todo.v1';
export function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return y >= 1000 && y <= 9999 && dateKey(date) === value;
}
export function validateTask(task) {
  return typeof task.id === 'string' && task.id.length > 0 &&
    typeof task.title === 'string' && task.title.trim().length > 0 && task.title.length <= 200 &&
    validDate(task.date) && categories.includes(task.category) &&
    (task.completed === undefined || typeof task.completed === 'boolean');
}
export function readTasks(storage) {
  const raw = storage.getItem(storageKey);
  if (raw === null) return [];
  const data = JSON.parse(raw);
  if (data.version !== 1 || !Array.isArray(data.tasks) || !data.tasks.every(t => t && validateTask(t)) ||
      new Set(data.tasks.map(t => t.id)).size !== data.tasks.length) throw new Error('Invalid saved data');
  return data.tasks;
}
export function addTask(storage, task) {
  if (!validateTask(task)) throw new Error('Invalid task');
  // Re-read before writing so another tab's saved tasks are not replaced by a stale view.
  const tasks = readTasks(storage);
  if (tasks.some(t => t.id === task.id)) throw new Error('Duplicate task');
  const next = [...tasks, task];
  storage.setItem(storageKey, JSON.stringify({version: 1, tasks: next}));
  return next;
}
export function monthDays(year, month) {
  const start = new Date(year, month, 1);
  const offset = (start.getDay() + 6) % 7;
  const count = new Date(year, month + 1, 0).getDate();
  return Array.from({length: Math.ceil((offset + count) / 7) * 7}, (_, i) =>
    i < offset || i >= offset + count ? null : dateKey(new Date(year, month, i - offset + 1)));
}

export function changeTask(storage, id, change, expected) {
  const tasks = readTasks(storage);
  const index = tasks.findIndex(task => task.id === id);
  if (index === -1 || (expected && JSON.stringify(tasks[index]) !== JSON.stringify(expected))) {
    const error = new Error('Task changed in another tab'); error.code = 'conflict'; throw error;
  }
  const next = [...tasks];
  if (change === null) next.splice(index, 1);
  else {
    const updated = {...tasks[index], ...change, id};
    if (!validateTask(updated)) throw new Error('Invalid task');
    next[index] = updated;
  }
  storage.setItem(storageKey, JSON.stringify({version: 1, tasks: next}));
  return next;
}
