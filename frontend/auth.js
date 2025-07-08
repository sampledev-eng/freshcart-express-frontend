// auth.js - handles user registration

// utility to close the register modal
function closeRegister() {
  const m = document.getElementById('registerModal');
  if (m) m.classList.add('hidden');
}

// update header/drawer links after successful auth
function showProfile() {
  const icon = document.getElementById('profileIcon');
  if (icon) {
    icon.textContent = 'Profile';
    icon.href = 'auth/profile.html';
  }
  const drawer = document.getElementById('drawerLogin');
  if (drawer) {
    drawer.textContent = 'Profile';
    drawer.href = 'auth/profile.html';
  }
}

// handle registration
async function handleRegister() {
  const emailEl = document.getElementById('register-email');
  const passEl = document.getElementById('register-password');
  if (!emailEl || !passEl) return;
  const email = emailEl.value.trim();
  const password = passEl.value.trim();
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !password || !validEmail.test(email)) {
    toast('Enter valid email and password', 'error');
    return;
  }
  try {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      const access = data.access || data.access_token;
      const refresh = data.refresh || data.refresh_token;
      if (access) localStorage.setItem('access', access);
      if (refresh) localStorage.setItem('refresh', refresh);
      closeRegister();
      toast('Welcome to FreshCart!', 'success');
      showProfile();
    } else {
      toast(data.message || data.detail || 'Registration failed', 'error');
    }
  } catch (e) {
    toast('Registration failed', 'error');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('registerBtn');
  if (btn) btn.addEventListener('click', handleRegister);
  const cls = document.getElementById('regClose');
  if (cls) cls.addEventListener('click', closeRegister);
});
