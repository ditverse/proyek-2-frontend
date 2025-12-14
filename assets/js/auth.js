import { post } from './api.js';

const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const errorDiv = document.getElementById('errorMessage');
const loginButton = document.getElementById('loginButton');

// Helper function to show error on a field
function showFieldError(input, errorElement, message) {
  if (input && errorElement) {
    input.classList.add('border-red-400', 'bg-red-50');
    input.classList.remove('border-orange-100');
    errorElement.classList.remove('hidden');
    const span = errorElement.querySelector('span');
    if (span) span.textContent = message;
  }
}

// Helper function to clear error from a field
function clearFieldError(input, errorElement) {
  if (input && errorElement) {
    input.classList.remove('border-red-400', 'bg-red-50');
    input.classList.add('border-orange-100');
    errorElement.classList.add('hidden');
    const span = errorElement.querySelector('span');
    if (span) span.textContent = '';
  }
}

// Clear all errors
function clearAllErrors() {
  clearFieldError(emailInput, emailError);
  clearFieldError(passwordInput, passwordError);
  if (errorDiv) {
    errorDiv.classList.add('hidden');
    errorDiv.textContent = '';
  }
}

// Clear errors when user starts typing
if (emailInput) {
  emailInput.addEventListener('input', () => clearFieldError(emailInput, emailError));
}
if (passwordInput) {
  passwordInput.addEventListener('input', () => clearFieldError(passwordInput, passwordError));
}

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAllErrors();

    const email = emailInput.value;
    const password = passwordInput.value;

    // Disable button during login
    if (loginButton) {
      loginButton.disabled = true;
      loginButton.textContent = 'Memproses...';
    }

    try {
      const data = await post('/auth/login', { email, password }, true);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // redirect berdasarkan role
      const role = data.user.role?.toLowerCase?.() || '';
      if (role.includes('mahasiswa')) {
        window.location.href = '/dashboard-mahasiswa.html';
      } else if (role.includes('sarpras')) {
        window.location.href = '/sarpras.html';
      } else if (role.includes('security')) {
        window.location.href = '/dashboard-security.html';
      } else {
        window.location.href = '/sarpras.html';
      }
    } catch (err) {
      // Re-enable button
      if (loginButton) {
        loginButton.disabled = false;
        loginButton.textContent = 'Login';
      }

      const errorMessage = (err.message || '').toLowerCase();

      // Check for specific error types and show appropriate messages
      if (errorMessage.includes('email') || errorMessage.includes('tidak ditemukan') || errorMessage.includes('not found') || errorMessage.includes('user')) {
        showFieldError(emailInput, emailError, 'Email tidak terdaftar');
      } else if (errorMessage.includes('password') || errorMessage.includes('salah') || errorMessage.includes('wrong') || errorMessage.includes('invalid')) {
        showFieldError(passwordInput, passwordError, 'Password salah');
      } else if (err.status === 401 || err.status === 404) {
        // Generic 401/404 - could be email or password
        // Default to showing email error for user not found scenarios
        showFieldError(emailInput, emailError, 'Email atau password salah');
      } else {
        // Show general error for other cases
        if (errorDiv) {
          errorDiv.textContent = err.message || 'Login gagal. Silakan coba lagi.';
          errorDiv.classList.remove('hidden');
        }
      }
    }
  });
}
