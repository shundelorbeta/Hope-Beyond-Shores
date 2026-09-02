const { supabaseAdmin } = require('../config/supabase');
const { sanitizeObject } = require('../middleware/sanitize');

const getSettings = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('site_settings')
      .select('*')
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

const updateSettings = async (req, res) => {
  try {
    const sanitized = sanitizeObject(req.body);

    const { data, error } = await supabaseAdmin
      .from('site_settings')
      .upsert(sanitized)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
};

module.exports = { getSettings, updateSettings };
