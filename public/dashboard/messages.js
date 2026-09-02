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

  await loadMessages();
});

async function loadMessages() {
  const container = document.getElementById('messages-list');
  try {
    const messages = await apiRequest('/api/messages');

    if (!messages || messages.length === 0) {
      container.innerHTML = '<div class="empty-state"><h3>No messages yet</h3><p>Messages from visitors will appear here.</p></div>';
      return;
    }

    container.innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Message</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${messages.map(msg => `
            <tr>
              <td>${msg.visitor_name || 'Anonymous'}</td>
              <td>${msg.visitor_email || '-'}</td>
              <td>${msg.message_content.substring(0, 100)}${msg.message_content.length > 100 ? '...' : ''}</td>
              <td><span class="badge ${msg.is_read ? 'badge-read' : 'badge-unread'}">${msg.is_read ? 'Read' : 'Unread'}</span></td>
              <td>${new Date(msg.created_at).toLocaleDateString()}</td>
              <td>
                <button onclick="markRead('${msg.id}')" class="btn btn-secondary btn-sm">Mark Read</button>
                <button onclick="deleteMessage('${msg.id}')" class="btn btn-danger btn-sm">Delete</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } catch (error) {
    console.error('Failed to load messages:', error);
    container.innerHTML = '<div class="empty-state"><h3>Failed to load messages</h3></div>';
  }
}

async function markRead(id) {
  try {
    await apiRequest(`/api/messages/${id}`, {
      method: 'PUT',
      body: { is_read: true }
    });
    await loadMessages();
  } catch (error) {
    alert('Failed to update message');
  }
}

async function deleteMessage(id) {
  if (!confirm('Are you sure you want to delete this message?')) return;

  try {
    await apiRequest(`/api/messages/${id}`, { method: 'DELETE' });
    await loadMessages();
  } catch (error) {
    alert('Failed to delete message');
  }
}
