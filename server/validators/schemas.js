const Joi = require('joi');

const schemas = {
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  story: Joi.object({
    title: Joi.string().max(200).required(),
    slug: Joi.string().max(200).required(),
    summary: Joi.string().max(500).required(),
    content: Joi.string().required(),
    category: Joi.string().max(100).required(),
    location: Joi.string().max(200).required(),
    status: Joi.string().valid('draft', 'published', 'archived').default('draft'),
    is_featured: Joi.boolean().default(false),
    cover_image_url: Joi.string().uri().allow(null, ''),
    published_at: Joi.date().allow(null)
  }),

  siteSettings: Joi.object({
    hero_title: Joi.string().max(200).required(),
    hero_subtitle: Joi.string().max(500).required(),
    hero_cta_text: Joi.string().max(100).required(),
    hero_image_url: Joi.string().uri().allow(null, ''),
    about_title: Joi.string().max(200).required(),
    about_content: Joi.string().required(),
    writer_name: Joi.string().max(100).required(),
    writer_bio: Joi.string().required(),
    facebook_url: Joi.string().uri().allow(null, ''),
    contact_email: Joi.string().email().allow(null, ''),
    contact_phone: Joi.string().max(50).allow(null, '')
  }),

  message: Joi.object({
    visitor_name: Joi.string().max(100).allow(null, ''),
    visitor_email: Joi.string().email().allow(null, ''),
    message_content: Joi.string().max(2000).required()
  }),

  category: Joi.object({
    name: Joi.string().max(100).required(),
    slug: Joi.string().max(100).required()
  }),

  location: Joi.object({
    name: Joi.string().max(200).required(),
    slug: Joi.string().max(200).required(),
    description: Joi.string().allow(null, '')
  })
};

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
};

module.exports = { schemas, validate };
