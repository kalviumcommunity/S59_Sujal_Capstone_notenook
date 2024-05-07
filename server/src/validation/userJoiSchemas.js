const Joi = require("joi");

const userJoiSchema = Joi.object({
  username: Joi.string().min(3).required(),
  fullname: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const userUpdateJoiSchema = Joi.object({
  username: Joi.string().min(3).optional(),
  fullname: Joi.string().required(),
  password: Joi.string().required(),
  newPassword: Joi.string().min(6).optional(),
});

module.exports = {
  userUpdateJoiSchema,
  userJoiSchema,
};
