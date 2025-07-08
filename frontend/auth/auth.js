// save JWT tokens returned from the backend
function setTokens(data) {
  if (!data) return;
  const access = data.access || data.access_token;
  const refresh = data.refresh || data.refresh_token;
  if (access) localStorage.setItem('access', access);
  if (refresh) localStorage.setItem('refresh', refresh);
}

function getToken() {
  const access = localStorage.getItem('access');
  if (access) return access;
  return null;
}

function loginUrl() {
  const path = window.location.pathname;
  const base = path.includes('/frontend/') ? '/frontend/' : '/';
  if (path.includes('/frontend/auth/') || path.includes('/auth/')) {
    return 'login.html';
  }
  return base + 'auth/login.html';
}

function updateNavbarUser() {
  const name = localStorage.getItem('userName');
  const loginEls = ['loginIcon', 'drawerLogin']
    .map(id => document.getElementById(id))
    .filter(Boolean);
  const userEls = ['navUser', 'drawerUser']
    .map(id => document.getElementById(id))
    .filter(Boolean);
  if (getToken() && name) {
    userEls.forEach(el => {
      el.textContent = name;
      el.classList.remove('hidden');
    });
    loginEls.forEach(el => el.classList.add('hidden'));
  } else {
    userEls.forEach(el => el.classList.add('hidden'));
    loginEls.forEach(el => el.classList.remove('hidden'));
  }
}

function logout() {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  localStorage.removeItem('userName');
  updateNavbarUser();
}

function showLoginForm() {
  const modal = document.getElementById('modal');
  if (!modal) { window.location.href = loginUrl(); return; }
  document.getElementById('modalBody').innerHTML = `
    <h2>Login</h2>
    <form id="loginForm" class="mobile-login">
      <input type="email" id="email" placeholder="Email" required />
      <input type="password" id="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
    <p>New user? <a href="#" id="regLink">Register here</a></p>
  `;
  modal.classList.remove('hidden');
  document.getElementById('loginForm').onsubmit = async e => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('userName', email);
        setTokens(data);
        closeModal();
        updateNavbarUser();
        toast('Logged in');
      } else {
        toast(data.message || data.detail || 'Login failed');
      }
    } catch (err) {
      toast('Login failed');
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
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value.trim();
    fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
      .then(async res => {
        const data = await res.json();
        if (res.ok) {
          toast('Account created!', 'success');
          showLoginForm();
        } else {
          toast(data.message || data.detail || 'Registration failed');
        }
      })
      .catch(() => toast('Registration failed'));
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
  const toggle = document.getElementById('darkToggle') ||
                 document.getElementById('drawerDarkToggle');
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
  const icon = document.getElementById('loginIcon') ||
               document.getElementById('drawerLogin');
  if (icon) icon.onclick = showLoginForm;
  updateNavbarUser();
});
