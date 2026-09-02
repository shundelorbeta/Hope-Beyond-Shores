const { supabaseAdmin } = require('../config/supabase');

const getAllStories = async ({ page = 1, limit = 10, category, location, search }) => {
  const offset = (page - 1) * limit;
  let query = supabaseAdmin
    .from('stories')
    .select('*, story_images(*)', { count: 'exact' })
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (category) query = query.eq('category', category);
  if (location) query = query.eq('location', location);
  if (search) query = query.ilike('title', `%${search}%`);

  return await query;
};

const getStoryBySlug = async (slug) => {
  return await supabaseAdmin
    .from('stories')
    .select('*, story_images(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
};

module.exports = { getAllStories, getStoryBySlug };
