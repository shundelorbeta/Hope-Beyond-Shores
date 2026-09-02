document.addEventListener('DOMContentLoaded', () => {
  let currentPage = 1;
  let currentCategory = null;
  let currentLocation = null;
  let searchTimeout;

  const searchInput = document.getElementById('search-input');
  const loadMoreBtn = document.getElementById('load-more');

  loadStories();

  if (searchInput) {
    searchInput.addEventListener('input', debounce((e) => {
      currentPage = 1;
      loadStories(e.target.value);
    }, 300));
  }

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      currentPage++;
      loadStories(searchInput.value, currentPage);
    });
  }

  async function loadStories(search = '', page = 1) {
    const container = document.getElementById('stories-grid');
    container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

    try {
      const params = new URLSearchParams({ page, limit: 9 });
      if (search) params.set('search', search);
      if (currentCategory) params.set('category', currentCategory);
      if (currentLocation) params.set('location', currentLocation);

      const data = await apiRequest(`/api/public/stories?${params.toString()}`);

      if (page === 1) {
        container.innerHTML = '';
      }

      if (!data.stories || data.stories.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>No stories found</h3><p>Try adjusting your search or check back later.</p></div>';
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
        return;
      }

      data.stories.forEach(story => {
        const coverImage = story.story_images && story.story_images.length > 0
          ? story.story_images[0].url
          : '';

        const card = document.createElement('a');
        card.href = `/story.html?slug=${story.slug}`;
        card.className = 'story-card';
        card.innerHTML = `
          <div class="story-card-image">
            <img src="${coverImage || '/images/placeholder.jpg'}" alt="${story.title}">
          </div>
          <div class="story-card-body">
            <div class="story-card-meta">${story.category} - ${story.location}</div>
            <h3 class="story-card-title">${story.title}</h3>
            <p class="story-card-summary">${story.summary}</p>
          </div>
        `;
        container.appendChild(card);
      });

      if (loadMoreBtn) {
        loadMoreBtn.style.display = page < data.pagination.pages ? 'inline-flex' : 'none';
      }
    } catch (error) {
      console.error('Failed to load stories:', error);
      container.innerHTML = '<div class="empty-state"><h3>Failed to load stories</h3><p>Please try again later.</p></div>';
    }
  }
});
