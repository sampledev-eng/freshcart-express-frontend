function setTokens() {
  const access = { token: 'access123', exp: Date.now() + 60000 };
  const refresh = { token: 'refresh123', exp: Date.now() + 600000 };
  localStorage.setItem('access', JSON.stringify(access));
  localStorage.setItem('refresh', JSON.stringify(refresh));
}

function getToken() {
  const access = JSON.parse(localStorage.getItem('access') || 'null');
  if (access && access.exp > Date.now()) return access.token;
  const refresh = JSON.parse(localStorage.getItem('refresh') || 'null');
  if (refresh && refresh.exp > Date.now()) {
    // simulate refresh
    setTokens();
    return 'access123';
  }
  return null;
}

function loginUrl() {
  // Always redirect to the root auth login page to avoid
  // duplicated path segments like "auth/auth/login.html".
  return '/auth/login.html';
}

function requireAuth() {
  if (!getToken()) {
    window.location.href = loginUrl();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('darkToggle');
  if (toggle) {
    toggle.checked = localStorage.getItem('dark') === 'true';
    document.body.classList.toggle('dark', toggle.checked);
    toggle.onchange = () => {
      localStorage.setItem('dark', toggle.checked);
      document.body.classList.toggle('dark', toggle.checked);
    };
  }
  const offline = document.getElementById('offline');
  function updateOffline() {
    if (!offline) return;
    offline.classList.toggle('hidden', navigator.onLine);
  }
  window.addEventListener('load', updateOffline);
  window.addEventListener('online', updateOffline);
  window.addEventListener('offline', updateOffline);
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/frontend/sw.js').catch(() => {});
  }
});
