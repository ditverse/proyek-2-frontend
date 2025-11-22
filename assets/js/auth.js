import { post } from './api.js';

const loginForm = document.getElementById('loginForm');
const errorDiv = document.getElementById('errorMessage');

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const data = await post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // redirect berdasarkan role
      const role = data.user.role?.toLowerCase?.() || '';
      if (role.includes('mahasiswa')) {
        window.location.href = '/mahasiswa.html';
      } else if (role.includes('sarpras')) {
        window.location.href = '/sarpras.html';
      } else if (role.includes('security')) {
        window.location.href = '/security.html';
      } else {
        window.location.href = '/sarpras.html';
      }
    } catch (err) {
      if (errorDiv) {
        errorDiv.textContent = err.message || 'Login gagal';
        errorDiv.classList.remove('hidden');
      }
    }
  });
}
