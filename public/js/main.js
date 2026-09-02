const API_BASE = '/api';

async function apiRequest(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : endpoint.startsWith('/api') ? endpoint : `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData) && !(config.body instanceof Blob)) {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

function getAuthToken() {
  return localStorage.getItem('hbs_auth_token');
}

function setAuthToken(token) {
  if (token) {
    localStorage.setItem('hbs_auth_token', token);
  } else {
    localStorage.removeItem('hbs_auth_token');
  }
}

function clearAuth() {
  localStorage.removeItem('hbs_auth_token');
}

function getAuthHeaders() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

function initMobileMenu() {
  const btn = document.getElementById('nav-menu-btn');
  const mobile = document.getElementById('nav-mobile');
  if (btn && mobile) {
    btn.addEventListener('click', () => {
      mobile.classList.toggle('open');
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
});
