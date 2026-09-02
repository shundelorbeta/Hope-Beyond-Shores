const { supabaseAdmin } = require('../config/supabase');
const { sanitizeObject } = require('../middleware/sanitize');

const getAll = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('locations')
      .select('*')
      .order('name');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Get locations error:', error);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
};

const create = async (req, res) => {
  try {
    const sanitized = sanitizeObject(req.body);
    const { data, error } = await supabaseAdmin
      .from('locations')
      .insert([sanitized])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Create location error:', error);
    res.status(500).json({ error: 'Failed to create location' });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabaseAdmin
      .from('locations')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    console.error('Delete location error:', error);
    res.status(500).json({ error: 'Failed to delete location' });
  }
};

module.exports = { getAll, create, remove };
