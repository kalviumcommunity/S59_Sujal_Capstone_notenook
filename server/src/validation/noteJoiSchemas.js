const Joi = require("joi");

const newNoteJoiSchema = Joi.object({
  title: Joi.string(),
  subject: Joi.string(),
  chapter: Joi.string().optional(),
});

module.exports = { newNoteJoiSchema };
