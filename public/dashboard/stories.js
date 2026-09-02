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

  await loadStories();
});

async function loadStories() {
  const container = document.getElementById('stories-list');
  try {
    const data = await apiRequest('/api/stories');

    if (!data.stories || data.stories.length === 0) {
      container.innerHTML = '<div class="empty-state"><h3>No stories yet</h3><p>Create your first story to get started.</p></div>';
      return;
    }

    container.innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Location</th>
            <th>Status</th>
            <th>Featured</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${data.stories.map(story => `
            <tr>
              <td><strong>${story.title}</strong></td>
              <td>${story.category}</td>
              <td>${story.location}</td>
              <td><span class="badge badge-${story.status}">${story.status}</span></td>
              <td>${story.is_featured ? 'Yes' : 'No'}</td>
              <td>
                <a href="/dashboard/editor.html?id=${story.id}" class="btn btn-secondary btn-sm">Edit</a>
                <button onclick="deleteStory('${story.id}')" class="btn btn-danger btn-sm">Delete</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } catch (error) {
    console.error('Failed to load stories:', error);
    container.innerHTML = '<div class="empty-state"><h3>Failed to load stories</h3></div>';
  }
}

async function deleteStory(id) {
  if (!confirm('Are you sure you want to delete this story?')) return;

  try {
    await apiRequest(`/api/stories/${id}`, { method: 'DELETE' });
    await loadStories();
  } catch (error) {
    alert('Failed to delete story: ' + error.message);
  }
}
