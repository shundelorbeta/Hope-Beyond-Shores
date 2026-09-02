document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  const status = document.getElementById('login-status');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.textContent = 'Signing in...';
      status.style.color = 'var(--earth-brown)';

      const formData = new FormData(form);
      const data = {
        email: formData.get('email'),
        password: formData.get('password')
      };

      try {
        const result = await apiRequest('/api/public/auth/login', {
          method: 'POST',
          body: data
        });

        setAuthToken(result.token);
        window.location.href = '/dashboard/';
      } catch (error) {
        status.textContent = error.message || 'Invalid email or password.';
        status.style.color = '#c0392b';
      }
    });
  }
});
