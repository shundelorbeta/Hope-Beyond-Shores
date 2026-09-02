const { supabaseAdmin } = require('../config/supabase');
const { sanitizeObject } = require('../middleware/sanitize');

const getAll = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

const create = async (req, res) => {
  try {
    const sanitized = sanitizeObject(req.body);
    const { data, error } = await supabaseAdmin
      .from('messages')
      .insert([sanitized])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Create message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const sanitized = sanitizeObject(req.body);

    const { data, error } = await supabaseAdmin
      .from('messages')
      .update(sanitized)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Update message error:', error);
    res.status(500).json({ error: 'Failed to update message' });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('messages')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
};

module.exports = { getAll, create, update, remove };
