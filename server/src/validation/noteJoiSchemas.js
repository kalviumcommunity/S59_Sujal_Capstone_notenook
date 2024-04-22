const Joi = require("joi");

const newNoteJoiSchema = Joi.object({
  title: Joi.string().required().min(3),
  subject: Joi.string().required().min(3),
});

module.exports = { newNoteJoiSchema };
