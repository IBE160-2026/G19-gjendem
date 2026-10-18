export const categories = ['Jobb', 'Skole', 'Familie', 'Ellers'];
export const storageKey = 'smart-todo.v1';
export const holidayMinYear=1900, holidayMaxYear=2099;
export function norwegianHolidays(year) {
  const result=new Map();
  if(!Number.isInteger(year)||year<holidayMinYear||year>holidayMaxYear)return result;
  // Gregorian Easter: Oudin algorithm published by the US Naval Observatory.
  // https://aa.usno.navy.mil/faq/easter — all divisions use integer truncation.
  const div=(a,b)=>Math.trunc(a/b),c=div(year,100),n=year-19*div(year,19),k=div(c-17,25);
  let i=c-div(c,4)-div(c-k,3)+19*n+15;
  i-=30*div(i,30);
  i-=div(i,28)*(1-div(i,28)*div(29,i+1)*div(21-n,11));
  let j=year+div(year,4)+i+2-c+div(c,4);j-=7*div(j,7);
  const l=i-j,month=3+div(l+40,44),day=l+28-31*div(month,4);
  const add=(date,name)=>result.set(date,[...(result.get(date)||[]),name]);
  for(const [date,name] of [['01-01','Første nyttårsdag'],['05-01','Arbeidernes dag'],['05-17','Grunnlovsdagen'],['12-25','Første juledag'],['12-26','Andre juledag']])add(`${year}-${date}`,name);
  for(const [offset,name] of [[-3,'Skjærtorsdag'],[-2,'Langfredag'],[0,'Første påskedag'],[1,'Andre påskedag'],[39,'Kristi himmelfartsdag'],[49,'Første pinsedag'],[50,'Andre pinsedag']]) {
    const date=new Date(Date.UTC(year,month-1,day+offset));
    add(`${year}-${String(date.getUTCMonth()+1).padStart(2,'0')}-${String(date.getUTCDate()).padStart(2,'0')}`,name);
  }
  return result;
}
export function validTimes(start, end) {
  if ((start === undefined || start === '') && (end === undefined || end === '')) return true;
  return typeof start === 'string' && typeof end === 'string' &&
    /^([01]\d|2[0-3]):[0-5]\d$/.test(start) && /^([01]\d|2[0-3]):[0-5]\d$/.test(end) && start < end;
}
export function conflictingIds(tasks) {
  const timed = tasks.filter(t => t.start && t.end && !t.completed);
  const conflicts = new Set();
  for (let i = 0; i < timed.length; i++) for (let j = i + 1; j < timed.length; j++) {
    const a = timed[i], b = timed[j];
    if (a.date === b.date && a.start < b.end && b.start < a.end) { conflicts.add(a.id); conflicts.add(b.id); }
  }
  return conflicts;
}
export function byTime(a, b) {
  return (a.start || '99:99').localeCompare(b.start || '99:99') || a.title.localeCompare(b.title, 'nb');
}
export function upcomingGroups(tasks, now = new Date()) {
  const today = dateKey(now);
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7 - (now.getDay() + 6) % 7);
  const nextWeek = dateKey(monday);
  const result = {today: [], week: [], upcoming: []};
  for (const task of tasks) {
    if (task.archived || !task.date) continue;
    if (task.date === today) result.today.push(task);
    else if (task.date > today && task.date < nextWeek) result.week.push(task);
    else if (task.date >= nextWeek) result.upcoming.push(task);
  }
  for (const list of Object.values(result)) list.sort((a,b) => a.date.localeCompare(b.date) || byTime(a,b));
  return result;
}
export function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return y >= 1000 && y <= 9999 && dateKey(date) === value;
}
export function validateTask(task, names = categories) {
  return typeof task.id === 'string' && task.id.length > 0 &&
    typeof task.title === 'string' && task.title.trim().length > 0 && task.title.length <= 200 &&
    (validDate(task.date) || task.date === '') && (task.date !== '' || (!task.start && !task.end)) && names.includes(task.category) &&
    (task.description === undefined || typeof task.description === 'string') &&
    (task.archived === undefined || typeof task.archived === 'boolean') && (!task.archived || task.completed === true) &&
    (task.completed === undefined || typeof task.completed === 'boolean') && validTimes(task.start, task.end);
}
const defaultColors = ['#4a7fc5', '#b99a26', '#538759', '#a27c55'];
const categoryKey = name => name.normalize('NFKC').toLocaleLowerCase('nb-NO');
function categoryDefinitions(state) {
  return [...categories.map((id,i)=>({id,name:id,color:defaultColors[i]})),
    ...(state.customCategories ?? []).map(c=>({id:c.name,name:c.name,color:c.color}))]
    .map(c=>({...c,...(Object.hasOwn(state.categoryOverrides ?? {},c.id) ? state.categoryOverrides[c.id] : {})}));
}
export function readState(storage) {
  const raw = storage.getItem(storageKey);
  const data = raw === null ? {version:1, tasks:[]} : JSON.parse(raw);
  if (!data || data.version !== 1 || !Array.isArray(data.tasks)) throw new Error('Invalid saved data');
  const custom = data.customCategories === undefined ? [] : data.customCategories;
  if (!Array.isArray(custom) || !custom.every(c => c && typeof c.name === 'string' && c.name === c.name.trim() && c.name.length > 0 && c.name.length <= 40 && /^#[0-9a-f]{6}$/i.test(c.color))) throw new Error('Invalid categories');
  const names = [...categories, ...custom.map(c => c.name)];
  if (data.categoryOverrides !== undefined) {
    const overrides=data.categoryOverrides;
    if (!overrides || typeof overrides!=='object' || Array.isArray(overrides) || Object.entries(overrides).some(([id,c])=>!names.includes(id) || !c || typeof c.name!=='string' || c.name!==c.name.trim() || !c.name || c.name.length>40 || !/^#[0-9a-f]{6}$/i.test(c.color) || Object.keys(c).some(key=>!['name','color'].includes(key)))) throw new Error('Invalid category overrides');
  }
  const displayNames=categoryDefinitions(data).map(c=>categoryKey(c.name));
  if (new Set(displayNames).size!==displayNames.length) throw new Error('Duplicate categories');
  if (new Set(names.map(categoryKey)).size !== names.length || !data.tasks.every(t => t && validateTask(t, names)) || new Set(data.tasks.map(t=>t.id)).size !== data.tasks.length) throw new Error('Invalid saved data');
  return data;
}
export function readCategories(storage) {
  return categoryDefinitions(readState(storage));
}
export function editCategory(storage,id,name,color,expected) {
  const state=readState(storage), list=categoryDefinitions(state), current=list.find(c=>c.id===id);
  if (!current || (expected && JSON.stringify(current)!==JSON.stringify(expected))) throw new Error('Kategorien er endret i en annen fane. Avbryt og åpne listen på nytt.');
  name=name.trim();
  if (!name || name.length>40) throw new Error('Skriv et kategorinavn på 1–40 tegn.');
  if (list.some(c=>c.id!==id && categoryKey(c.name)===categoryKey(name))) throw new Error('En kategori med dette navnet finnes allerede.');
  if (!/^#[0-9a-f]{6}$/i.test(color)) throw new Error('Velg en gyldig farge.');
  storage.setItem(storageKey,JSON.stringify({...state,categoryOverrides:{...state.categoryOverrides,[id]:{name,color}}}));
  return state.tasks;
}
export function readTasks(storage) { return readState(storage).tasks; }
function writeTasks(storage, state, tasks) {
  storage.setItem(storageKey, JSON.stringify({...state,tasks}));
  return tasks;
}
export function addCategory(storage, name, color) {
  const state = readState(storage);
  name = name.trim();
  const list=categoryDefinitions(state), names=list.map(c=>c.name);
  if (!name || name.length > 40) throw new Error('Skriv et kategorinavn på 1–40 tegn.');
  if (names.some(n=>categoryKey(n)===categoryKey(name))) throw new Error('En kategori med dette navnet finnes allerede.');
  if (!/^#[0-9a-f]{6}$/i.test(color)) throw new Error('Velg en gyldig farge.');
  let id=name;
  for(let suffix=2;list.some(c=>categoryKey(c.id)===categoryKey(id));suffix++) id=`${name.slice(0,30)}~${suffix}`;
  const next={...state,customCategories:[...(state.customCategories ?? []),{name:id,color}]};
  if(id!==name) next.categoryOverrides={...state.categoryOverrides,[id]:{name,color}};
  storage.setItem(storageKey,JSON.stringify(next));
  return state.tasks;
}
export function addTask(storage, task) {
  const state = readState(storage);
  if (!validateTask(task,[...categories,...(state.customCategories ?? []).map(c=>c.name)])) throw new Error('Invalid task');
  if (state.tasks.some(t => t.id === task.id)) throw new Error('Duplicate task');
  return writeTasks(storage,state,[...state.tasks,task]);
}
export function monthDays(year, month) {
  const start = new Date(year, month, 1);
  const offset = (start.getDay() + 6) % 7;
  const count = new Date(year, month + 1, 0).getDate();
  return Array.from({length: Math.ceil((offset + count) / 7) * 7}, (_, i) =>
    i < offset || i >= offset + count ? null : dateKey(new Date(year, month, i - offset + 1)));
}

export function changeTask(storage, id, change, expected) {
  const state = readState(storage), tasks = state.tasks;
  const index = tasks.findIndex(task => task.id === id);
  if (index === -1 || (expected && JSON.stringify(tasks[index]) !== JSON.stringify(expected))) {
    const error = new Error('Task changed in another tab'); error.code = 'conflict'; throw error;
  }
  const next = [...tasks];
  if (change === null) next.splice(index, 1);
  else {
    const updated = {...tasks[index], ...change, id};
    if (change.completed === false && updated.archived) updated.archived = false;
    if (!validateTask(updated,[...categories,...(state.customCategories ?? []).map(c=>c.name)])) throw new Error('Invalid task');
    next[index] = updated;
  }
  return writeTasks(storage,state,next);
}

export function archiveCompleted(storage) {
  const state = readState(storage), tasks = state.tasks;
  const next = tasks.map(task => task.completed && !task.archived ? {...task, archived:true} : task);
  return writeTasks(storage,state,next);
}
