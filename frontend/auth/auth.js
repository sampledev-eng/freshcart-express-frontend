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

function updateNavbarUser() {
  const name = localStorage.getItem('userName');
  const userEl = document.getElementById('navUser');
  const iconEl = document.getElementById('loginIcon');
  if (!userEl || !iconEl) return;
  if (getToken() && name) {
    userEl.textContent = name;
    userEl.classList.remove('hidden');
    iconEl.classList.add('hidden');
  } else {
    userEl.classList.add('hidden');
    iconEl.classList.remove('hidden');
  }
}

function showLoginForm() {
  const modal = document.getElementById('modal');
  if (!modal) { window.location.href = loginUrl(); return; }
  document.getElementById('modalBody').innerHTML = `
    <h2>Login</h2>
    <form id="loginForm">
      <input type="email" id="email" placeholder="Email" required />
      <input type="password" id="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
    <p>New user? <a href="#" id="regLink">Register here</a></p>
  `;
  modal.classList.remove('hidden');
  document.getElementById('loginForm').onsubmit = e => {
    e.preventDefault();
    const em = document.getElementById('email').value;
    const pw = document.getElementById('password').value;
    if (em === 'user@example.com' && pw === 'demo') {
      localStorage.setItem('userName', em.split('@')[0]);
      setTokens();
      closeModal();
      updateNavbarUser();
      toast('Logged in');
    } else {
      toast('Invalid credentials');
    }
  };
  document.getElementById('regLink').onclick = e => { e.preventDefault(); showRegisterForm(); };
}

function showRegisterForm() {
  const modal = document.getElementById('modal');
  if (!modal) { window.location.href = loginUrl(); return; }
  document.getElementById('modalBody').innerHTML = `
    <h2>Register</h2>
    <form id="registerForm">
      <input type="email" id="regEmail" placeholder="Email" required />
      <input type="password" id="regPassword" placeholder="Password" required />
      <button type="submit">Register</button>
    </form>
    <p><a href="#" id="loginLink">Back to login</a></p>
  `;
  modal.classList.remove('hidden');
  document.getElementById('registerForm').onsubmit = e => {
    e.preventDefault();
    toast('Account created! (demo)');
    showLoginForm();
  };
  document.getElementById('loginLink').onclick = e => { e.preventDefault(); showLoginForm(); };
}

function requireAuth() {
  if (!getToken()) {
    if (typeof showLoginForm === 'function') {
      showLoginForm();
    } else {
      window.location.href = loginUrl();
    }
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
  const icon = document.getElementById('loginIcon');
  if (icon) icon.onclick = showLoginForm;
  updateNavbarUser();
});
