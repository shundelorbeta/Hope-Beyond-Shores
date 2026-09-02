document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('contact-status');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.textContent = 'Sending...';
      status.style.color = 'var(--earth-brown)';

      const formData = new FormData(form);
      const data = {
        visitor_name: formData.get('visitor_name') || '',
        visitor_email: formData.get('visitor_email') || '',
        message_content: formData.get('message_content')
      };

      try {
        await apiRequest('/api/public/messages', {
          method: 'POST',
          body: data
        });
        status.textContent = 'Thank you for your message. We will get back to you soon.';
        status.style.color = 'var(--deep-brown)';
        form.reset();
      } catch (error) {
        status.textContent = 'Sorry, something went wrong. Please try again later.';
        status.style.color = '#c0392b';
      }
    });
  }
});
