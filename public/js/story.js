document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');

  if (!slug) {
    document.getElementById('story-content').innerHTML = '<div class="empty-state"><h3>Story not found</h3></div>';
    return;
  }

  try {
    const story = await apiRequest(`/api/public/stories/${encodeURIComponent(slug)}`);
    renderStory(story);
  } catch (error) {
    console.error('Failed to load story:', error);
    document.getElementById('story-content').innerHTML = '<div class="empty-state"><h3>Story not found</h3><p>The story you are looking for does not exist or has been unpublished.</p></div>';
  }
});

function renderStory(story) {
  const container = document.getElementById('story-content');
  const coverImage = story.story_images && story.story_images.length > 0
    ? story.story_images[0].url
    : '/images/placeholder.jpg';

  const otherImages = story.story_images ? story.story_images.slice(1) : [];

  let imagesHtml = '';
  if (coverImage) {
    imagesHtml += `<figure><img src="${coverImage}" alt="${story.title}"><figcaption>${story.title}</figcaption></figure>`;
  }
  otherImages.forEach(img => {
    imagesHtml += `<figure><img src="${img.url}" alt="${img.caption || ''}"><figcaption>${img.caption || ''}</figcaption></figure>`;
  });

  container.innerHTML = `
    <div class="story-page-header">
      <div class="story-page-meta">${story.category} - ${story.location}</div>
      <h1 class="story-page-title">${story.title}</h1>
      <p class="story-page-summary">${story.summary}</p>
    </div>
    <article class="story-page-content">
      ${imagesHtml}
      ${story.content}
    </article>
    <div class="text-center mt-32">
      <a href="/stories.html" class="btn btn-secondary">Back to Stories</a>
    </div>
  `;
}
