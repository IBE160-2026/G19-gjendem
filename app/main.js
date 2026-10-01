import {categories, dateKey, validDate, validTimes, conflictingIds, byTime, upcomingGroups, readTasks, addTask, changeTask, archiveCompleted, monthDays, storageKey} from './model.js';

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
const expandedPeriods = new Set();
let sidebarDate = '';
let completedOpen = false;
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
  const controls = [...document.querySelectorAll('button, input, select, textarea')].map(node => [node, node.disabled]);
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
      for (const task of tasks.filter(t => t.date === date && !t.archived).sort(byTime)) cell.append(taskCard(task, 'month'));
      row.append(cell);
    }
    calendar.append(row);
  }
  if (expandedDate) drawDay();
  drawUpcoming();
  drawCompleted();
}
function drawCompleted() {
  const panel = document.querySelector('#completed-panel');
  panel.hidden = !completedOpen;
  const items = tasks.filter(t => t.completed).sort((a,b) => b.date.localeCompare(a.date) || byTime(a,b));
  const toggle = document.querySelector('#completed-toggle');
  toggle.textContent = `Fullført (${items.length})`; toggle.setAttribute('aria-expanded', String(completedOpen));
  document.querySelector('#tidy').disabled = blocked || !tasks.some(t => t.completed && !t.archived);
  panel.replaceChildren();
  if (!completedOpen) return;
  const heading = element('h3','Fullførte oppgaver'); heading.id = 'completed-heading'; heading.tabIndex = -1;
  panel.append(heading,element('p','Her er alle fullførte oppgaver. Fjern avkryssingen for å legge en oppgave tilbake i kalenderen.','day-help'));
  if (blocked) {panel.append(element('p','Kunne ikke lese oppgavene. Ingen data er endret.','error'));return;}
  if (!items.length) panel.append(element('p','Ingen fullførte oppgaver ennå.','day-help'));
  for (const task of items) panel.append(taskCard(task,'completed-list'));
}
function redrawPreservingEditor() {
  const editor = document.querySelector('#editor'), snapshot = editorSnapshot;
  const scrollTop = document.querySelector('.timeline')?.scrollTop;
  if (editor) editor.remove();
  render();
  if (editor) { document.querySelector('#day-editor').append(editor); editorSnapshot = snapshot; }
  if (scrollTop !== undefined && document.querySelector('.timeline')) document.querySelector('.timeline').scrollTop = scrollTop;
}
function drawUpcoming() {
  const sidebar = document.querySelector('#upcoming');
  const active = sidebar.contains(document.activeElement) ? document.activeElement : null;
  const focusTask = active?.closest('[data-task-id]')?.dataset.taskId;
  const focusPeriod = active?.closest('.period')?.id;
  const focusCheckbox = active?.matches('input[type="checkbox"]');
  const focusToggle = active?.classList.contains('period-toggle');
  sidebarDate = dateKey(new Date());
  sidebar.replaceChildren(element('h2', 'Min oversikt'));
  if (blocked) { sidebar.append(element('p', 'Oppgavene kunne ikke leses. Se meldingen ved kalenderen.', 'error')); return; }
  const groups = upcomingGroups(tasks);
  for (const [key, label, description] of [
    ['today', 'I dag', 'Det du har på planen i dag'],
    ['week', 'Denne uken', 'Resten av uken etter i dag'],
    ['upcoming', 'Kommende', 'Fra neste uke og videre']
  ]) {
    const section = element('section', undefined, 'period'); section.id = `period-${key}`;
    section.setAttribute('aria-labelledby', `period-heading-${key}`);
    const heading = element('h3', label); heading.id = `period-heading-${key}`; heading.tabIndex = -1;
    section.append(heading, element('p', description, 'period-description'));
    const list = element('div'); list.id = `period-list-${key}`;
    const items = groups[key], expanded = expandedPeriods.has(key);
    if (!items.length) list.append(element('p', 'Ingen oppgaver.', 'period-empty'));
    for (const task of expanded ? items : items.slice(0,2)) list.append(taskCard(task, `sidebar-${key}`));
    section.append(list);
    if (items.length > 2) {
      const toggle = element('button', expanded ? 'Vis mindre' : `Vis mer (${items.length - 2})`, 'period-toggle');
      toggle.setAttribute('aria-expanded', String(expanded)); toggle.setAttribute('aria-controls', list.id);
      toggle.addEventListener('click', () => {
        if (saving) return;
        if (expanded) expandedPeriods.delete(key); else expandedPeriods.add(key);
        drawUpcoming();
      });
      section.append(toggle);
    }
    sidebar.append(section);
  }
  if (active) {
    const card = [...sidebar.querySelectorAll('[data-task-id]')].find(node => node.dataset.taskId === focusTask);
    const period = focusPeriod ? document.getElementById(focusPeriod) : null;
    const target = focusTask ? card?.querySelector(focusCheckbox ? 'input' : '.task-edit') : focusToggle ? period?.querySelector('.period-toggle') : null;
    (target ?? period?.querySelector('h3'))?.focus();
  }
}
function taskCard(task, surface) {
  const card = element('div', undefined, `task ${task.category.toLowerCase()}`);
  card.dataset.taskId = task.id; card.dataset.surface = surface;
  const check = element('input'); check.type = 'checkbox'; check.checked = Boolean(task.completed);
  check.setAttribute('aria-label', `Ferdig: ${task.title}`); check.disabled = blocked;
  const edit = element('button', undefined, 'task-edit'); edit.type = 'button'; edit.disabled = blocked;
  edit.setAttribute('aria-label', `Rediger ${task.title}`);
  edit.append(element('span', task.title, 'task-title'), element('small', `${task.start ? `${task.start}–${task.end} · ` : ''}${task.category}`));
  if (surface.startsWith('sidebar-')) {
    edit.title = task.title;
    if (surface !== 'sidebar-today') edit.append(element('small', fullDate(task.date), 'task-date'));
  }
  if (surface === 'completed-list') edit.append(element('small',fullDate(task.date)),element('small',task.archived ? 'Ryddet bort fra kalenderen' : 'Vises fortsatt i kalenderen'));
  card.classList.toggle('completed', Boolean(task.completed));
  if (conflicts.has(task.id)) { card.classList.add('conflict'); edit.append(element('small', 'Overlapper', 'conflict-label')); }
  edit.addEventListener('click', () => openEditor(task.date, null, task, '', surface === 'completed-list'));
  check.addEventListener('change', async () => {
    const completed = check.checked; check.checked = Boolean(task.completed);
    try {
      if (!await persist(() => changeTask(localStorage, task.id, {completed}))) return;
      if (editorSnapshot?.id === task.id) {
        editorSnapshot.completed = completed;
        if (!completed && editorSnapshot.archived) editorSnapshot.archived = false;
      }
      // Rebuild every task view while keeping an unsaved editor and its comparison snapshot intact.
      redrawPreservingEditor();
      announce(completed ? `«${task.title}» er fullført.` : `«${task.title}» er åpnet igjen.`);
      const target = [...document.querySelectorAll('[data-task-id]')].find(node => node.dataset.taskId === task.id && node.dataset.surface === surface)?.querySelector('input');
      (target ?? document.querySelector('#completed-heading') ?? document.querySelector('#completed-toggle')).focus();
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
  const dated = tasks.filter(t => t.date === expandedDate && !t.archived).sort(byTime);
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
  const slot = timeline.querySelector('[data-hour="12"]');
  timeline.scrollTop = slot.offsetTop;
}
function timeField(caption, name, initial) {
  const wrapper = element('div', undefined, 'time-field');
  const label = element('label', caption);
  const input = element('input'); input.type = 'text'; input.name = name;
  input.placeholder = 'Velg klokkeslett'; input.maxLength = 5; input.value = initial;
  input.inputMode = 'numeric'; input.autocomplete = 'off';
  input.setAttribute('aria-describedby', 'time-guidance');
  label.append(input); wrapper.append(label);
  const toggle = element('button', 'Velg klokkeslett', 'time-picker-toggle'); toggle.type = 'button';
  toggle.setAttribute('aria-label', `Velg ${name === 'start' ? 'starttid' : 'sluttid'}`);
  toggle.setAttribute('aria-expanded', 'false');
  wrapper.append(toggle);
  function open() {
    if (saving) return;
    document.querySelectorAll('.time-chooser').forEach(node => node.remove());
    document.querySelectorAll('.time-picker-toggle').forEach(node => node.setAttribute('aria-expanded','false'));
    const chooser = element('div', undefined, 'time-chooser'); chooser.setAttribute('role','group'); chooser.setAttribute('aria-label', `${caption} – velger`);
    chooser.addEventListener('input', event => event.stopPropagation());
    toggle.setAttribute('aria-expanded','true');
    const current = /^([01]\d|2[0-3]):[0-5]\d$/.test(input.value) ? input.value : '12:00';
    if (!input.value) {
      input.value = current;
      input.dispatchEvent(new Event('input', {bubbles:true}));
    }
    const hourLabel = element('label','Time'), minuteLabel = element('label','Minutt');
    const hour = element('select'), minute = element('select');
    hour.setAttribute('aria-label', `${caption}: time`); minute.setAttribute('aria-label', `${caption}: minutt`);
    for (let h=0;h<24;h++) { const value=String(h).padStart(2,'0'); const option=element('option',value); option.value=value; hour.append(option); }
    for (let m=0;m<60;m+=5) { const value=String(m).padStart(2,'0'); const option=element('option',value); option.value=value; minute.append(option); }
    hour.value=current.slice(0,2);
    minute.value=Number(current.slice(3))%5===0 ? current.slice(3) : '00';
    hourLabel.append(hour); minuteLabel.append(minute);
    const choices=element('div',undefined,'fields'); choices.append(hourLabel,minuteLabel);
    const cancel=element('button','Lukk'); cancel.type='button';
    const clear=element('button','Fjern klokkeslett'); clear.type='button';
    const close=()=>{chooser.remove();toggle.setAttribute('aria-expanded','false');input.focus();};
    const update=()=>{input.value=`${hour.value}:${minute.value}`;input.dispatchEvent(new Event('input',{bubbles:true}));};
    hour.addEventListener('change',update);
    minute.addEventListener('change',update);
    clear.addEventListener('click',()=>{input.value='';input.dispatchEvent(new Event('input',{bubbles:true}));close();});
    cancel.addEventListener('click',close);
    chooser.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();close();}});
    const actions=element('div',undefined,'actions');actions.append(clear,cancel);
    chooser.append(choices,actions);wrapper.append(chooser);hour.focus();
  }
  toggle.addEventListener('click',open);
  return {wrapper,input};
}
function openEditor(date, row = null, existing = null, startPrefill = '', fromCompleted = false) {
  if (!canLeave()) return;
  if (fromCompleted) { completedOpen = false; drawCompleted(); }
  if (date.slice(0,7) !== dateKey(shown).slice(0,7)) {
    shown = new Date(`${date}T12:00:00`); expandedDate = null; render();
  }
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
  const descriptionLabel = element('label', 'Beskrivelse (valgfritt)', 'description-field');
  const description = element('textarea'); description.name = 'description'; description.rows = 3;
  description.placeholder = 'Detaljer, huskeliste eller hva oppgaven gjelder';
  description.value = existing?.description ?? ''; descriptionLabel.append(description);
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
  const startField = timeField('Start (valgfritt)', 'start', existing?.start ?? startPrefill);
  const endField = timeField('Slutt (valgfritt)', 'end', existing?.end ?? '');
  const start = startField.input, end = endField.input;
  times.append(startField.wrapper, endField.wrapper);
  const timeHelp = element('p', 'Velg eller skriv HH:mm i femminutterssteg (00, 05, 10 … 55). La begge stå tomme for ingen klokkeslett. Start og slutt må være samme dag.', 'day-help');
  timeHelp.id = 'time-guidance';
  const error = element('p', '', 'error'); error.setAttribute('role', 'alert');
  const actions = element('div', undefined, 'actions');
  const save = element('button', 'Lagre oppgave', 'primary'); save.type = 'submit';
  const cancel = element('button', 'Avbryt'); cancel.type = 'button';
  cancel.addEventListener('click', () => { if (canLeave()) { dirty = false; expandedDate = null; load(); render(); calendar.querySelector(`[data-date="${date}"] .add`)?.focus(); } });
  actions.append(save, cancel); form.append(titleLabel, descriptionLabel, fields, times, timeHelp, error, actions); panel.append(form);
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
    for (const field of [start,end]) {
      if (field.value && field.value !== original?.[field.name] && Number(field.value.slice(3)) % 5 !== 0) {
        error.textContent = 'Velg minutter i femminutterssteg: 00, 05, 10, 15 … 55.'; field.focus(); return;
      }
    }
    if (!validTimes(start.value, end.value)) {
      error.textContent = 'Fyll inn både start og slutt, med slutt senere enn start samme dag, eller la begge stå tomme.';
      (!start.value ? start : end).focus(); return;
    }
    try {
      const task = {id: original?.id ?? crypto.randomUUID(), title: name, description: description.value, date: dateInput.value, category: category.value, start: start.value, end: end.value};
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
document.querySelector('#completed-toggle').addEventListener('click', () => {
  if (saving) return;
  completedOpen = !completedOpen; drawCompleted();
  if (completedOpen) document.querySelector('#completed-heading')?.focus();
});
document.querySelector('#tidy').addEventListener('click', async () => {
  try {
    if (!await persist(() => archiveCompleted(localStorage))) return;
    if (editorSnapshot?.completed && tasks.find(t => t.id === editorSnapshot.id)?.archived) editorSnapshot.archived = true;
    redrawPreservingEditor();
    announce('Fullførte oppgaver er ryddet bort. De er fortsatt lagret under Fullført.');
    document.querySelector('#completed-toggle').focus();
  } catch (error) { announce(writeError(error),true); document.querySelector('#tidy').focus(); }
});
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
  if (!saving && sidebarDate !== today) drawUpcoming();
}
setInterval(refreshToday, 30000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshToday(); });
