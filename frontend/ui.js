import { categories } from './categories.js';

const sheet = document.getElementById('categorySheet');
const list = document.getElementById('catList');
const backBtn = document.getElementById('catBack');
const catBtn = document.querySelector('[data-page="categories"]');

function iconSVG(name) {
  const icons = {
    earphones: '<svg viewBox="0 0 24 24"><path d="M5 12v3a2 2 0 0 0 4 0v-3M15 12v3a2 2 0 0 0 4 0v-3M5 12a7 7 0 0 1 14 0" stroke="currentColor" fill="none"/></svg>',
    tshirt: '<svg viewBox="0 0 24 24"><path d="M4 5l4-2 4 2 4-2 4 2v3l-2 3v9h-8v-9l-2-3V5z" stroke="currentColor" fill="none"/></svg>',
    bowl: '<svg viewBox="0 0 24 24"><path d="M4 10h16a8 8 0 0 1-16 0z" stroke="currentColor" fill="none"/><path d="M2 10h20" stroke="currentColor"/></svg>',
    pill: '<svg viewBox="0 0 24 24"><rect x="3" y="9" width="8" height="8" rx="4" stroke="currentColor" fill="none"/><rect x="13" y="7" width="8" height="10" rx="5" stroke="currentColor" fill="none"/></svg>',
    apple: '<svg viewBox="0 0 24 24"><path d="M12 2c1.5 0 2.5 1 2.5 2.5S13 7 12 7 9.5 6 9.5 4.5 10.5 2 12 2zM8 9c-2 2-2 5 0 7s4 3 4 3 2-1 4-3 2-5 0-7-3.6-2-4-2-2 0-4 2z" stroke="currentColor" fill="none"/></svg>',
    bottle: '<svg viewBox="0 0 24 24"><path d="M10 2h4v4l2 3v11a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V9l2-3V2z" stroke="currentColor" fill="none"/></svg>',
    home: '<svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-5H9v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" fill="none"/></svg>',
    lipstick: '<svg viewBox="0 0 24 24"><path d="M8 15v5h8v-5M10 15v-4l2-6 2 6v4" stroke="currentColor" fill="none"/></svg>',
    bread: '<svg viewBox="0 0 24 24"><path d="M3 11a9 9 0 0 1 18 0v7H3v-7z" stroke="currentColor" fill="none"/><path d="M3 16h18" stroke="currentColor"/></svg>',
    pacifier: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3" stroke="currentColor" fill="none"/><path d="M9 11l-2 7h10l-2-7" stroke="currentColor" fill="none"/></svg>',
    fish: '<svg viewBox="0 0 24 24"><path d="M2 12s3-5 10-5 10 5 10 5-3 5-10 5S2 12 2 12z" stroke="currentColor" fill="none"/><circle cx="14" cy="12" r="1" fill="currentColor"/></svg>',
    cheese: '<svg viewBox="0 0 24 24"><path d="M3 14l9-5 9 5v5H3v-5z" stroke="currentColor" fill="none"/><circle cx="9" cy="15" r="1" fill="currentColor"/><circle cx="15" cy="17" r="1" fill="currentColor"/></svg>'
  };
  return icons[name] || '';
}

if (list) {
  list.innerHTML = categories
    .map(c => `<li><button class="catItem" data-slug="${c.id}">` +
               `<span class="icon">${iconSVG(c.icon)}</span>` +
               `<span class="label">${c.label}</span>` +
               `</button></li>`)
    .join('');

  list.addEventListener('click', e => {
    const item = e.target.closest('.catItem');
    if (!item) return;
    const label = item.querySelector('.label').textContent;
    const filter = document.getElementById('categoryFilter');
    if (filter) {
      filter.value = label;
      if (typeof applyFilters === 'function') applyFilters();
    }
    closeSheet();
  });
}

function openSheet() {
  sheet.classList.remove('hidden');
}

function closeSheet() {
  sheet.classList.add('hidden');
}

if (catBtn) catBtn.onclick = e => { e.preventDefault(); openSheet(); };
if (backBtn) backBtn.onclick = closeSheet;


