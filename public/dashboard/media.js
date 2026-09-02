document.addEventListener('DOMContentLoaded', async () => {
  lucide.createIcons();

  const token = getAuthToken();
  if (!token) {
    window.location.href = '/login.html';
    return;
  }

  document.getElementById('logout-btn').addEventListener('click', () => {
    clearAuth();
    window.location.href = '/login.html';
  });

  const form = document.getElementById('upload-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const statusEl = document.getElementById('upload-status');
      statusEl.textContent = 'Uploading...';
      statusEl.style.color = 'var(--earth-brown)';

      const fileInput = document.getElementById('file');
      const file = fileInput.files[0];
      if (!file) {
        statusEl.textContent = 'Please select a file.';
        statusEl.style.color = '#c0392b';
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        const result = await apiRequest('/api/media?bucket=story-images', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${getAuthToken()}`
          },
          body: formData
        });
        statusEl.textContent = 'Uploaded successfully! URL: ' + result.url;
        statusEl.style.color = 'var(--deep-brown)';
        fileInput.value = '';
      } catch (error) {
        statusEl.textContent = 'Upload failed: ' + error.message;
        statusEl.style.color = '#c0392b';
      }
    });
  }
});
