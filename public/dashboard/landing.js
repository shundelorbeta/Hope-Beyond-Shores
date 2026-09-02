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

  await loadSettings();

  document.getElementById('settings-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveSettings();
  });
});

async function loadSettings() {
  try {
    const settings = await apiRequest('/api/landing');
    document.getElementById('hero_title').value = settings.hero_title || '';
    document.getElementById('hero_subtitle').value = settings.hero_subtitle || '';
    document.getElementById('hero_cta_text').value = settings.hero_cta_text || '';
    document.getElementById('hero_image_url').value = settings.hero_image_url || '';
    document.getElementById('about_title').value = settings.about_title || '';
    document.getElementById('about_content').value = settings.about_content || '';
    document.getElementById('writer_name').value = settings.writer_name || '';
    document.getElementById('writer_bio').value = settings.writer_bio || '';
    document.getElementById('facebook_url').value = settings.facebook_url || '';
    document.getElementById('contact_email').value = settings.contact_email || '';
    document.getElementById('contact_phone').value = settings.contact_phone || '';
  } catch (error) {
    alert('Failed to load settings');
  }
}

async function saveSettings() {
  const statusEl = document.getElementById('settings-status');
  statusEl.textContent = 'Saving...';
  statusEl.style.color = 'var(--earth-brown)';

  const formData = {
    hero_title: document.getElementById('hero_title').value,
    hero_subtitle: document.getElementById('hero_subtitle').value,
    hero_cta_text: document.getElementById('hero_cta_text').value,
    hero_image_url: document.getElementById('hero_image_url').value || null,
    about_title: document.getElementById('about_title').value,
    about_content: document.getElementById('about_content').value,
    writer_name: document.getElementById('writer_name').value,
    writer_bio: document.getElementById('writer_bio').value,
    facebook_url: document.getElementById('facebook_url').value || null,
    contact_email: document.getElementById('contact_email').value || null,
    contact_phone: document.getElementById('contact_phone').value || null
  };

  try {
    await apiRequest('/api/landing', {
      method: 'PUT',
      body: formData
    });
    statusEl.textContent = 'Settings saved successfully!';
    statusEl.style.color = 'var(--deep-brown)';
  } catch (error) {
    statusEl.textContent = 'Failed to save: ' + error.message;
    statusEl.style.color = '#c0392b';
  }
}
