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

function requireAuth() {
  if (!getToken()) {
    // Always redirect to the login page relative to the repository root so
    // nested pages like `auth/profile.html` don't resolve to `auth/auth/login.html`.
    window.location.href = '/src/auth/login.html';
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
