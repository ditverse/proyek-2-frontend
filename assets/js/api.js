import { API_BASE_URL } from './config.js';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

async function apiCall(path, options = {}, skipAuthRedirect = false) {
  const url = `${API_BASE_URL}${path}`;
  const config = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {})
    }
  };

  const response = await fetch(url, config);

  if (response.status === 401 && !skipAuthRedirect) {
    // Unauthorized, redirect to login (skip for login attempts)
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/index.html';
    return null;
  }

  const contentType = response.headers.get('content-type') || '';
  let payload;

  if (contentType.includes('application/json')) {
    payload = await response.json();
  } else {
    payload = await response.text();
  }

  if (!response.ok) {
    const message = typeof payload === 'string' ? payload : payload?.error || 'Request failed';
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return payload;
}

export async function get(path) {
  return apiCall(path, { method: 'GET' });
}

export async function post(path, body, skipAuthRedirect = false) {
  return apiCall(path, { method: 'POST', body: JSON.stringify(body) }, skipAuthRedirect);
}

export async function patch(path, body) {
  return apiCall(path, { method: 'PATCH', body: JSON.stringify(body) });
}

export function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

export function checkAuth() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/index.html';
    return false;
  }
  return true;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/index.html';
}
