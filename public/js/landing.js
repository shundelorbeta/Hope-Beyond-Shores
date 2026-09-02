document.addEventListener('DOMContentLoaded', async () => {
  await loadHero();
  await loadFeaturedStory();
  await loadLatestStories();
  await loadAboutSection();
  lucide.createIcons();
});

async function loadHero() {
  try {
    const settings = await apiRequest('/api/public/settings');
    document.getElementById('hero-title').textContent = settings.hero_title || 'Hope Beyond Shores';
    document.getElementById('hero-subtitle').textContent = settings.hero_subtitle || '';
    document.getElementById('hero-cta').textContent = settings.hero_cta_text || 'Read Our Stories';
    document.getElementById('hero-cta').href = '/stories.html';

    const heroImage = document.getElementById('hero-image');
    if (settings.hero_image_url) {
      heroImage.innerHTML = `<img src="${settings.hero_image_url}" alt="Hero image">`;
    }
  } catch (error) {
    console.error('Failed to load hero:', error);
  }
}

async function loadFeaturedStory() {
  try {
    const stories = await apiRequest('/api/public/stories/featured');
    const container = document.getElementById('featured-story');

    if (!stories || stories.length === 0) {
      container.innerHTML = '<div class="empty-state"><h3>No featured stories yet</h3><p>Check back soon for new stories.</p></div>';
      return;
    }

    const story = stories[0];
    const coverImage = story.story_images && story.story_images.length > 0
      ? story.story_images[0].url
      : '';

    container.innerHTML = `
      <a href="/story.html?slug=${story.slug}" class="featured-story">
        <div class="featured-story-image">
          <img src="${coverImage || '/images/placeholder.jpg'}" alt="${story.title}">
        </div>
        <div class="featured-story-body">
          <div class="story-card-meta">${story.category} - ${story.location}</div>
          <h2>${story.title}</h2>
          <p>${story.summary}</p>
          <span class="btn btn-secondary">Read Story</span>
        </div>
      </a>
    `;
  } catch (error) {
    console.error('Failed to load featured story:', error);
    document.getElementById('featured-story').innerHTML = '<div class="empty-state"><h3>Failed to load</h3><p>Please try again later.</p></div>';
  }
}

async function loadLatestStories() {
  try {
    const stories = await apiRequest('/api/public/stories/latest');
    const container = document.getElementById('latest-stories');

    if (!stories || stories.length === 0) {
      container.innerHTML = '<div class="empty-state"><h3>No stories yet</h3><p>New stories are coming soon.</p></div>';
      return;
    }

    container.innerHTML = stories.map(story => {
      const coverImage = story.story_images && story.story_images.length > 0
        ? story.story_images[0].url
        : '';
      return `
        <a href="/story.html?slug=${story.slug}" class="story-card">
          <div class="story-card-image">
            <img src="${coverImage || '/images/placeholder.jpg'}" alt="${story.title}">
          </div>
          <div class="story-card-body">
            <div class="story-card-meta">${story.category} - ${story.location}</div>
            <h3 class="story-card-title">${story.title}</h3>
            <p class="story-card-summary">${story.summary}</p>
          </div>
        </a>
      `;
    }).join('');
  } catch (error) {
    console.error('Failed to load latest stories:', error);
    document.getElementById('latest-stories').innerHTML = '<div class="empty-state"><h3>Failed to load</h3><p>Please try again later.</p></div>';
  }
}

async function loadAboutSection() {
  try {
    const settings = await apiRequest('/api/public/settings');
    const container = document.getElementById('about-content');
    const writerImage = document.getElementById('writer-image');

    container.innerHTML = `
      <h3 class="section-title">${settings.about_title || 'About'}</h3>
      <p>${settings.about_content || ''}</p>
      <p><strong>${settings.writer_name || ''}</strong></p>
      <p>${settings.writer_bio || ''}</p>
      ${settings.facebook_url ? `<a href="${settings.facebook_url}" target="_blank" rel="noopener" class="btn btn-secondary" style="margin-top: 16px;">Follow on Facebook</a>` : ''}
    `;

    if (writerImage) {
      writerImage.innerHTML = `<img src="/images/writer-placeholder.jpg" alt="${settings.writer_name || 'Writer'}">`;
    }
  } catch (error) {
    console.error('Failed to load about section:', error);
  }
}
