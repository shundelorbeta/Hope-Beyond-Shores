document.addEventListener('DOMContentLoaded', async () => {
  const token = getAuthToken();
  if (!token) {
    window.location.href = '/login.html';
    return;
  }

  document.getElementById('logout-btn').addEventListener('click', () => {
    clearAuth();
    window.location.href = '/login.html';
  });

  const params = new URLSearchParams(window.location.search);
  const storyId = params.get('id');

  if (storyId) {
    document.getElementById('editor-title').textContent = 'Edit Story';
    await loadStory(storyId);
  }

  document.getElementById('story-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveStory(storyId);
  });
});

async function loadStory(id) {
  try {
    const data = await apiRequest(`/api/stories?all=true`);
    const story = data.stories.find(s => s.id === id);
    if (!story) {
      alert('Story not found');
      return;
    }

    document.getElementById('title').value = story.title;
    document.getElementById('slug').value = story.slug;
    document.getElementById('summary').value = story.summary;
    document.getElementById('category').value = story.category;
    document.getElementById('location').value = story.location;
    document.getElementById('status').value = story.status;
    document.getElementById('cover_image_url').value = story.cover_image_url || '';
    document.getElementById('content').value = story.content;
  } catch (error) {
    alert('Failed to load story');
  }
}

async function saveStory(id) {
  const statusEl = document.getElementById('editor-status');
  statusEl.textContent = 'Saving...';
  statusEl.style.color = 'var(--earth-brown)';

  const formData = {
    title: document.getElementById('title').value,
    slug: document.getElementById('slug').value,
    summary: document.getElementById('summary').value,
    category: document.getElementById('category').value,
    location: document.getElementById('location').value,
    status: document.getElementById('status').value,
    cover_image_url: document.getElementById('cover_image_url').value || null,
    content: document.getElementById('content').value
  };

  try {
    if (id) {
      await apiRequest(`/api/stories/${id}`, {
        method: 'PUT',
        body: formData
      });
    } else {
      await apiRequest('/api/stories', {
        method: 'POST',
        body: formData
      });
    }
    statusEl.textContent = 'Story saved successfully!';
    statusEl.style.color = 'var(--deep-brown)';
    setTimeout(() => {
      window.location.href = '/dashboard/stories.html';
    }, 1000);
  } catch (error) {
    statusEl.textContent = 'Failed to save: ' + error.message;
    statusEl.style.color = '#c0392b';
  }
}
