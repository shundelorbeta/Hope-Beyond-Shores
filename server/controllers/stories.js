const { supabaseAdmin } = require('../config/supabase');
const { sanitizeObject } = require('../middleware/sanitize');

const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, location, search, all } = req.query;
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('stories')
      .select('*, story_images(*)', { count: 'exact' })
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (all !== 'true') {
      query = query.eq('status', 'published');
    }

    if (category) query = query.eq('category', category);
    if (location) query = query.eq('location', location);
    if (search) query = query.ilike('title', `%${search}%`);

    const { data, error, count } = await query;

    if (error) throw error;

    res.json({
      stories: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get stories error:', error);
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
};

const getBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const { data, error } = await supabaseAdmin
      .from('stories')
      .select('*, story_images(*)')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Story not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Get story error:', error);
    res.status(500).json({ error: 'Failed to fetch story' });
  }
};

const create = async (req, res) => {
  try {
    const sanitized = sanitizeObject(req.body);
    const { data, error } = await supabaseAdmin
      .from('stories')
      .insert([sanitized])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Create story error:', error);
    res.status(500).json({ error: 'Failed to create story' });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const sanitized = sanitizeObject(req.body);

    const { data, error } = await supabaseAdmin
      .from('stories')
      .update(sanitized)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Update story error:', error);
    res.status(500).json({ error: 'Failed to update story' });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('stories')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    console.error('Delete story error:', error);
    res.status(500).json({ error: 'Failed to delete story' });
  }
};

const getFeatured = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('stories')
      .select('*, story_images(*)')
      .eq('status', 'published')
      .eq('is_featured', true)
      .order('published_at', { ascending: false })
      .limit(5);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Get featured error:', error);
    res.status(500).json({ error: 'Failed to fetch featured stories' });
  }
};

const getLatest = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('stories')
      .select('*, story_images(*)')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(6);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Get latest error:', error);
    res.status(500).json({ error: 'Failed to fetch latest stories' });
  }
};

module.exports = { getAll, getBySlug, create, update, remove, getFeatured, getLatest };
