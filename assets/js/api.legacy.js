// Compatibility API helpers copied from original monolith view/js/api.js
// Uses window.API_BASE_URL if available, otherwise defaults to localhost dev
const API_BASE = (typeof window !== 'undefined' && window.API_BASE_URL) ? window.API_BASE_URL : 'http://localhost:8000/api';

function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
}

async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config = {
        ...options,
        headers: {
            ...getAuthHeaders(),
            ...options.headers
        }
    };

    const response = await fetch(url, config);

    if (response.status === 401) {
        // Unauthorized, redirect to login
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
        const message = typeof payload === 'string'
            ? payload
            : payload?.error || 'Request failed';
        throw new Error(message);
    }

    return payload;
}

function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/index.html';
        return false;
    }
    return true;
}
