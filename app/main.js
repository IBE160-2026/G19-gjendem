import {categories, dateKey, validDate, validTimes, conflictingIds, byTime, readTasks, addTask, changeTask, monthDays, storageKey} from './model.js';

const calendar = document.querySelector('#calendar');
const message = document.querySelector('#message');
let shown = new Date();
let tasks = [];
let blocked = false;
let dirty = false;
let saving = false;
let editorSnapshot = null;
let expandedDate = null;
let conflicts = new Set();
const fullDate = value => new Intl.DateTimeFormat('nb-NO', {day: 'numeric', month: 'long', year: 'numeric'}).format(new Date(`${value}T12:00:00`));
const element = (tag, text, className) => {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
};
function announce(text, error = false) {
  message.textContent = text;
  message.classList.toggle('error', error);
}
function load() {
  try { tasks = readTasks(localStorage); blocked = false; }
  catch { blocked = true; announce('Vi kunne ikke lese de lagrede oppgavene. Ingen data er overskrevet. Prøv å laste siden på nytt eller sjekk nettleserens lagringsinnstillinger.', true); }
}
function canLeave() {
  if (saving) { announce('Vent litt mens oppgaven lagres.'); return false; }
  return !dirty || confirm('Du har en oppgave som ikke er lagret. Vil du forkaste den?');
}
async function persist(operation) {
  if (saving) return false;
  saving = true;
  const controls = [...document.querySelectorAll('button, input, select')].map(node => [node, node.disabled]);
  controls.forEach(([node]) => { node.disabled = true; });
  try {
    const write = () => { tasks = operation(); };
    if (navigator.locks) await navigator.locks.request('smart-todo-save', write); else write();
    return true;
  } finally {
    controls.forEach(([node, disabled]) => { node.disabled = disabled; });
    saving = false;
  }
}
function writeError(error) {
  return error.code === 'conflict'
    ? 'Oppgaven er endret eller slettet i en annen fane. Endringen din er ikke lagret. Avbryt og åpne oppgaven på nytt for å se siste versjon.'
    : 'Endringen ble ikke lagret. Teksten din er beholdt. Sjekk at nettleseren tillater lagring, og prøv igjen.';
}
function render() {
  editorSnapshot = null;
  conflicts = conflictingIds(tasks);
  const year = shown.getFullYear(), month = shown.getMonth();
  document.querySelector('#month').textContent = new Intl.DateTimeFormat('nb-NO', {month: 'long', year: 'numeric'}).format(shown);
  calendar.replaceChildren();
  const week = element('div', undefined, 'weekdays');
  for (const day of ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag']) week.append(element('span', day));
  calendar.append(week);
  const days = monthDays(year, month);
  const today = dateKey(new Date());
  for (let i = 0; i < days.length; i += 7) {
    const row = element('div', undefined, 'week');
    for (const date of days.slice(i, i + 7)) {
      const cell = element('section', undefined, date ? 'day' : 'day empty');
      if (!date) { cell.setAttribute('aria-hidden', 'true'); row.append(cell); continue; }
      cell.setAttribute('aria-label', fullDate(date));
      cell.dataset.date = date;
      if (date === today) { cell.classList.add('is-today'); cell.setAttribute('aria-current', 'date'); }
      const heading = element('div', undefined, 'day-heading');
      const label = element('button', String(Number(date.slice(-2))), 'day-number');
      label.setAttribute('aria-label', `Vis dagen ${fullDate(date)}`);
      label.setAttribute('aria-expanded', String(date === expandedDate));
      label.addEventListener('click', () => {
        if (!canLeave()) return;
        dirty = false; expandedDate = expandedDate === date ? null : date; load(); render();
        if (expandedDate) document.querySelector('#day-heading')?.focus();
        else calendar.querySelector(`[data-date="${date}"] .day-number`)?.focus();
      });
      heading.append(label);
      if (date === today) heading.append(element('span', 'I dag', 'today-label'));
      const plus = element('button', '+', 'add');
      plus.setAttribute('aria-label', `Legg til oppgave ${fullDate(date)}`);
      plus.disabled = blocked;
      plus.addEventListener('click', () => openEditor(date, row));
      heading.append(plus); cell.append(heading);
      for (const task of tasks.filter(t => t.date === date).sort(byTime)) cell.append(taskCard(task, 'month'));
      row.append(cell);
    }
    calendar.append(row);
  }
  if (expandedDate) drawDay();
}
function taskCard(task, surface) {
  const card = element('div', undefined, `task ${task.category.toLowerCase()}`);
  card.dataset.taskId = task.id; card.dataset.surface = surface;
  const check = element('input'); check.type = 'checkbox'; check.checked = Boolean(task.completed);
  check.setAttribute('aria-label', `Ferdig: ${task.title}`); check.disabled = blocked;
  const edit = element('button', undefined, 'task-edit'); edit.type = 'button'; edit.disabled = blocked;
  edit.setAttribute('aria-label', `Rediger ${task.title}`);
  edit.append(element('span', task.title, 'task-title'), element('small', `${task.start ? `${task.start}–${task.end} · ` : ''}${task.category}`));
  card.classList.toggle('completed', Boolean(task.completed));
  if (conflicts.has(task.id)) { card.classList.add('conflict'); edit.append(element('small', 'Overlapper', 'conflict-label')); }
  edit.addEventListener('click', () => openEditor(task.date, null, task));
  check.addEventListener('change', async () => {
    const completed = check.checked; check.checked = Boolean(task.completed);
    try {
      if (!await persist(() => changeTask(localStorage, task.id, {completed}))) return;
      if (editorSnapshot?.id === task.id) editorSnapshot.completed = completed;
      // Rebuild every task view while keeping an unsaved editor and its comparison snapshot intact.
      const editor = document.querySelector('#editor'); const snapshot = editorSnapshot;
      const scrollTop = document.querySelector('.timeline')?.scrollTop;
      if (editor) editor.remove();
      render();
      if (editor) { document.querySelector('#day-editor').append(editor); editorSnapshot = snapshot; }
      if (scrollTop !== undefined && document.querySelector('.timeline')) document.querySelector('.timeline').scrollTop = scrollTop;
      announce(completed ? `«${task.title}» er fullført.` : `«${task.title}» er åpnet igjen.`);
      [...calendar.querySelectorAll('[data-task-id]')].find(node => node.dataset.taskId === task.id && node.dataset.surface === surface)?.querySelector('input').focus();
    } catch (error) { announce(writeError(error), true); check.focus(); }
  });
  card.append(check, edit); return card;
}
function drawDay() {
  document.querySelector('#expanded-day')?.remove();
  for (const cell of calendar.querySelectorAll('[data-date]')) cell.querySelector('.day-number').setAttribute('aria-expanded', String(cell.dataset.date === expandedDate));
  const row = calendar.querySelector(`[data-date="${expandedDate}"]`)?.parentElement;
  if (!row) return;
  const panel = element('section', undefined, 'expanded-day'); panel.id = 'expanded-day';
  panel.setAttribute('aria-labelledby', 'day-heading');
  const header = element('div', undefined, 'day-toolbar');
  const heading = element('h3', fullDate(expandedDate)); heading.id = 'day-heading'; heading.tabIndex = -1;
  const close = element('button', 'Lukk dagen'); close.addEventListener('click', () => {
    if (!canLeave()) return;
    const date = expandedDate; dirty = false; expandedDate = null; load(); render();
    calendar.querySelector(`[data-date="${date}"] .day-number`)?.focus();
  });
  header.append(heading, close); panel.append(header);
  const editorHost = element('div'); editorHost.id = 'day-editor'; panel.append(editorHost);
  const layout = element('div', undefined, 'day-layout');
  const timetable = element('section'); timetable.append(element('h4', 'Timeplan'));
  timetable.append(element('p', 'Trykk på et klokkeslett for å legge til. Du velger sluttiden selv.', 'day-help'));
  const timeline = element('div', undefined, 'timeline'); timeline.tabIndex = 0; timeline.setAttribute('aria-label', 'Timeplan for hele dagen');
  const dated = tasks.filter(t => t.date === expandedDate).sort(byTime);
  for (let hour = 0; hour < 24; hour++) {
    const time = `${String(hour).padStart(2, '0')}:00`;
    const slot = element('div', undefined, 'time-slot'); slot.dataset.hour = String(hour);
    const add = element('button', `${time} +`, 'time-add'); add.disabled = blocked;
    add.setAttribute('aria-label', `Ny oppgave klokken ${time}`);
    const date = expandedDate; add.addEventListener('click', () => openEditor(date, null, null, time));
    const list = element('div');
    for (const task of dated.filter(t => t.start && Number(t.start.slice(0, 2)) === hour)) list.append(taskCard(task, 'timeline'));
    slot.append(add, list); timeline.append(slot);
  }
  timetable.append(timeline);
  const untimed = element('section', undefined, 'untimed'); untimed.append(element('h4', 'Uten klokkeslett'));
  const list = dated.filter(t => !t.start);
  if (!list.length) untimed.append(element('p', 'Ingen oppgaver uten klokkeslett.', 'day-help'));
  for (const task of list) untimed.append(taskCard(task, 'untimed'));
  const addUntimed = element('button', '+ Ny oppgave'); addUntimed.disabled = blocked;
  const date = expandedDate; addUntimed.addEventListener('click', () => openEditor(date)); untimed.append(addUntimed);
  layout.append(timetable, untimed); panel.append(layout); row.after(panel);
  const firstHour = dated.find(t => t.start)?.start.slice(0, 2) ?? '08';
  const slot = timeline.querySelector(`[data-hour="${Number(firstHour)}"]`);
  timeline.scrollTop = slot.offsetTop;
}
function openEditor(date, row = null, existing = null, startPrefill = '') {
  if (!canLeave()) return;
  expandedDate = date; drawDay();
  dirty = false;
  const panel = element('section', undefined, 'editor'); panel.id = 'editor';
  // Snapshot prevents an old editor from overwriting a newer value from another tab.
  const original = existing ? structuredClone(existing) : null;
  editorSnapshot = original;
  panel.append(element('h3', `${existing ? 'Rediger oppgave' : 'Ny oppgave'} · ${fullDate(date)}`));
  const form = element('form');
  const titleLabel = element('label', 'Hva skal du gjøre?');
  const title = element('input'); title.name = 'title'; title.required = true; title.maxLength = 200;
  title.placeholder = 'For eksempel: Levere rapport'; titleLabel.append(title);
  title.value = existing?.title ?? '';
  const fields = element('div', undefined, 'fields');
  const dateLabel = element('label', 'Dato');
  const dateInput = element('input'); dateInput.type = 'date'; dateInput.name = 'date'; dateInput.required = true;
  dateInput.min = '1000-01-01'; dateInput.max = '9999-12-31'; dateInput.value = date; dateLabel.append(dateInput);
  const categoryLabel = element('label', 'Kategori');
  const category = element('select'); category.name = 'category';
  category.setAttribute('aria-label', 'Kategori');
  for (const name of categories) { const option = element('option', name); option.value = name; category.append(option); }
  category.value = existing?.category ?? 'Ellers'; categoryLabel.append(category); fields.append(dateLabel, categoryLabel);
  const times = element('div', undefined, 'fields');
  const startLabel = element('label', 'Start (valgfritt)');
  const start = element('input'); start.type = 'time'; start.name = 'start'; start.step = '60'; start.value = existing?.start ?? startPrefill; startLabel.append(start);
  const endLabel = element('label', 'Slutt (valgfritt)');
  const end = element('input'); end.type = 'time'; end.name = 'end'; end.step = '60'; end.value = existing?.end ?? ''; endLabel.append(end);
  times.append(startLabel, endLabel);
  const timeHelp = element('p', 'La begge stå tomme for en oppgave uten klokkeslett. Start og slutt må være samme dag.', 'day-help');
  const error = element('p', '', 'error'); error.setAttribute('role', 'alert');
  const actions = element('div', undefined, 'actions');
  const save = element('button', 'Lagre oppgave', 'primary'); save.type = 'submit';
  const cancel = element('button', 'Avbryt'); cancel.type = 'button';
  cancel.addEventListener('click', () => { if (canLeave()) { dirty = false; expandedDate = null; load(); render(); calendar.querySelector(`[data-date="${date}"] .add`)?.focus(); } });
  actions.append(save, cancel); form.append(titleLabel, fields, times, timeHelp, error, actions); panel.append(form);
  if (existing) {
    const remove = element('button', 'Slett oppgave', 'danger'); remove.type = 'button';
    remove.addEventListener('click', async () => {
      if (saving || !confirm(`Vil du slette «${original.title}»? Oppgaven fjernes permanent.`)) return;
      try {
        if (!await persist(() => changeTask(localStorage, original.id, null, original))) return;
        dirty = false; expandedDate = null; render(); announce(`«${original.title}» er slettet.`);
        calendar.querySelector(`[data-date="${date}"] .add`)?.focus();
      } catch (failure) { error.textContent = writeError(failure); }
    });
    actions.append(remove);
  }
  document.querySelector('#day-editor').append(panel); title.focus();
  form.addEventListener('input', () => { dirty = true; });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const name = title.value.trim();
    if (!name) { error.textContent = 'Skriv en tittel på oppgaven.'; title.focus(); return; }
    if (!validDate(dateInput.value)) { error.textContent = 'Velg en gyldig dato.'; return; }
    if (!validTimes(start.value, end.value)) {
      error.textContent = 'Fyll inn både start og slutt, med slutt senere enn start samme dag, eller la begge stå tomme.';
      (!start.value ? start : end).focus(); return;
    }
    try {
      const task = {id: original?.id ?? crypto.randomUUID(), title: name, date: dateInput.value, category: category.value, start: start.value, end: end.value};
      if (!await persist(() => original
        ? changeTask(localStorage, task.id, task, original)
        : addTask(localStorage, task))) return;
      shown = new Date(`${task.date}T12:00:00`); dirty = false; expandedDate = null;
      render(); announce(`«${name}» er lagret.`);
      document.querySelector('#today').focus();
    } catch (failure) { error.textContent = writeError(failure); }
  });
}
function navigate(delta) {
  if (!canLeave()) return;
  const target = delta === null ? new Date() : new Date(shown.getFullYear(), shown.getMonth() + delta, 1);
  if (target.getFullYear() < 1000 || target.getFullYear() > 9999) return;
  shown = target; dirty = false; expandedDate = null; load(); render();
}
document.querySelector('#previous').addEventListener('click', () => navigate(-1));
document.querySelector('#next').addEventListener('click', () => navigate(1));
document.querySelector('#today').addEventListener('click', () => navigate(null));
window.addEventListener('beforeunload', event => { if (dirty) { event.preventDefault(); event.returnValue = ''; } });
window.addEventListener('storage', event => {
  if (event.key !== storageKey && event.key !== null) return;
  if (saving || document.querySelector('#editor')) { announce('Oppgavene er endret i en annen fane. Oversikten oppdateres når du lagrer eller laster siden på nytt.'); return; }
  load(); render();
});
load(); render();
function refreshToday() {
  const today = dateKey(new Date());
  for (const cell of calendar.querySelectorAll('[data-date]')) {
    const current = cell.dataset.date === today;
    cell.classList.toggle('is-today', current);
    if (current) cell.setAttribute('aria-current', 'date'); else cell.removeAttribute('aria-current');
    cell.querySelector('.today-label')?.remove();
    if (current) cell.querySelector('.day-number').after(element('span', 'I dag', 'today-label'));
  }
}
setInterval(refreshToday, 30000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshToday(); });
