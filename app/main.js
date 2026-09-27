import {categories, dateKey, validDate, readTasks, addTask, monthDays, storageKey} from './model.js';

const calendar = document.querySelector('#calendar');
const message = document.querySelector('#message');
let shown = new Date();
let tasks = [];
let blocked = false;
let dirty = false;
let saving = false;
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
function render() {
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
      const label = element('span', String(Number(date.slice(-2))), 'day-number');
      heading.append(label);
      if (date === today) heading.append(element('span', 'I dag', 'today-label'));
      const plus = element('button', '+', 'add');
      plus.setAttribute('aria-label', `Legg til oppgave ${fullDate(date)}`);
      plus.disabled = blocked;
      plus.addEventListener('click', () => openEditor(date, row));
      heading.append(plus); cell.append(heading);
      for (const task of tasks.filter(t => t.date === date)) {
        const card = element('div', undefined, `task ${task.category.toLowerCase()}`);
        card.append(element('span', task.title, 'task-title'), element('small', task.category));
        cell.append(card);
      }
      row.append(cell);
    }
    calendar.append(row);
  }
}
function openEditor(date, row) {
  if (!canLeave()) return;
  document.querySelector('#editor')?.remove();
  dirty = false;
  const panel = element('section', undefined, 'editor'); panel.id = 'editor';
  panel.append(element('h3', `Ny oppgave · ${fullDate(date)}`));
  const form = element('form');
  const titleLabel = element('label', 'Hva skal du gjøre?');
  const title = element('input'); title.name = 'title'; title.required = true; title.maxLength = 200;
  title.placeholder = 'For eksempel: Levere rapport'; titleLabel.append(title);
  const fields = element('div', undefined, 'fields');
  const dateLabel = element('label', 'Dato');
  const dateInput = element('input'); dateInput.type = 'date'; dateInput.name = 'date'; dateInput.required = true;
  dateInput.min = '1000-01-01'; dateInput.max = '9999-12-31'; dateInput.value = date; dateLabel.append(dateInput);
  const categoryLabel = element('label', 'Kategori');
  const category = element('select'); category.name = 'category';
  category.setAttribute('aria-label', 'Kategori');
  for (const name of categories) { const option = element('option', name); option.value = name; category.append(option); }
  category.value = 'Ellers'; categoryLabel.append(category); fields.append(dateLabel, categoryLabel);
  const error = element('p', '', 'error'); error.setAttribute('role', 'alert');
  const actions = element('div', undefined, 'actions');
  const save = element('button', 'Lagre oppgave', 'primary'); save.type = 'submit';
  const cancel = element('button', 'Avbryt'); cancel.type = 'button';
  cancel.addEventListener('click', () => { if (canLeave()) { dirty = false; load(); render(); calendar.querySelector(`[data-date="${date}"] .add`)?.focus(); } });
  actions.append(save, cancel); form.append(titleLabel, fields, error, actions); panel.append(form);
  row.after(panel); title.focus();
  form.addEventListener('input', () => { dirty = true; });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const name = title.value.trim();
    if (!name) { error.textContent = 'Skriv en tittel på oppgaven.'; title.focus(); return; }
    if (!validDate(dateInput.value)) { error.textContent = 'Velg en gyldig dato.'; return; }
    save.disabled = true;
    saving = true;
    for (const field of [title, dateInput, category, cancel]) field.disabled = true;
    try {
      const task = {id: crypto.randomUUID(), title: name, date: dateInput.value, category: category.value};
      const persist = () => { tasks = addTask(localStorage, task); };
      // Serialize writes across tabs on supported browsers; do not claim success on failure.
      if (navigator.locks) await navigator.locks.request('smart-todo-save', persist);
      else persist();
      shown = new Date(`${task.date}T12:00:00`); dirty = false;
      render(); announce(`«${name}» er lagret.`);
      document.querySelector('#today').focus();
    } catch { error.textContent = 'Oppgaven ble ikke lagret. Teksten din er beholdt. Sjekk at nettleseren tillater lagring, og prøv igjen.'; }
    finally { saving = false; save.disabled = false; for (const field of [title, dateInput, category, cancel]) field.disabled = false; }
  });
}
function navigate(delta) {
  if (!canLeave()) return;
  const target = delta === null ? new Date() : new Date(shown.getFullYear(), shown.getMonth() + delta, 1);
  if (target.getFullYear() < 1000 || target.getFullYear() > 9999) return;
  shown = target; dirty = false; load(); render();
}
document.querySelector('#previous').addEventListener('click', () => navigate(-1));
document.querySelector('#next').addEventListener('click', () => navigate(1));
document.querySelector('#today').addEventListener('click', () => navigate(null));
window.addEventListener('beforeunload', event => { if (dirty) { event.preventDefault(); event.returnValue = ''; } });
window.addEventListener('storage', event => {
  if (event.key !== storageKey && event.key !== null) return;
  if (document.querySelector('#editor')) { announce('Oppgavene er endret i en annen fane. Oversikten oppdateres når du lagrer eller laster siden på nytt.'); return; }
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
