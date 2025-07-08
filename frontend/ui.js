import { categories } from './categories.js';

const $ = s => document.querySelector(s);

const sheet    = $('#catSheet');
const catList  = $('#catList');
const backdrop = $('#sheetBackdrop');

catList.innerHTML = categories.map(c => `
  <li><button class="catItem" data-slug="${c.slug}">
    <img src="assets/icons/${c.icon}" alt="">
    <span>${c.label}</span>
  </button></li>`).join('');

$('#hamburger').onclick = () => openSheet(true);
$('#catBack').onclick   = () => openSheet(false);
backdrop.onclick        = () => openSheet(false);

function openSheet(on) {
  sheet.classList.toggle('hidden', !on);
  sheet.classList.toggle('open',   on);
  backdrop.classList.toggle('hidden', !on);
}

catList.addEventListener('click', e => {
  const btn = e.target.closest('.catItem');
  if (!btn) return;
  location.href = `category.html?c=${btn.dataset.slug}`;
  openSheet(false);
});
