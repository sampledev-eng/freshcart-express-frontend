function toggleMenu() {
  const menu = document.getElementById('sideMenu');
  const backdrop = document.getElementById('backdrop');
  if (!menu || !backdrop) return;
  const isOpen = menu.classList.contains('open');
  if (isOpen) {
    menu.classList.remove('open');
    backdrop.classList.remove('open');
  } else {
    menu.classList.add('open');
    backdrop.classList.add('open');
  }
}

function closeMenu() {
  const menu = document.getElementById('sideMenu');
  const backdrop = document.getElementById('backdrop');
  if (!menu || !backdrop) return;
  menu.classList.remove('open');
  backdrop.classList.remove('open');
}

document.getElementById('menuBtn').onclick = toggleMenu;
document.getElementById('backdrop').onclick = closeMenu;
