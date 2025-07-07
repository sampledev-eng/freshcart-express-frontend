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
  const pathParts = location.pathname.split('/');
  const srcIndex = pathParts.indexOf('src');
  if (srcIndex !== -1) {
    return (
      '/' + pathParts.slice(0, srcIndex + 1).join('/') + '/auth/login.html'
    );
  }
  return '/src/auth/login.html';
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
  window.addEventListener('online', () => document.getElementById('offline').classList.add('hidden'));
  window.addEventListener('offline', () => document.getElementById('offline').classList.remove('hidden'));
});
