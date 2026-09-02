document.addEventListener('DOMContentLoaded', () => {
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

  loadDashboardStats();
});

async function loadDashboardStats() {
  try {
    const [storiesRes, messagesRes] = await Promise.all([
      apiRequest('/api/stories'),
      apiRequest('/api/messages')
    ]);

    const publishedCount = storiesRes.stories ? storiesRes.stories.filter(s => s.status === 'published').length : 0;
    const draftCount = storiesRes.stories ? storiesRes.stories.filter(s => s.status === 'draft').length : 0;
    const unreadCount = messagesRes ? messagesRes.filter(m => !m.is_read).length : 0;

    document.getElementById('stat-stories').textContent = publishedCount;
    document.getElementById('stat-drafts').textContent = draftCount;
    document.getElementById('stat-messages').textContent = unreadCount;
  } catch (error) {
    console.error('Failed to load stats:', error);
  }
}
