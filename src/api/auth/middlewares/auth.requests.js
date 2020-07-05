const Joi = require('@hapi/joi');

exports.loginSchema = Joi.object({
  email: Joi
    .string()
    .email()
    .required(),
  password: Joi
    .string()
    .required()
});

exports.logoutSchema = Joi.object({
  token: Joi
    .string()
    .required()
});

exports.logoutAllSchema = Joi.object({
});

exports.setPasswordSchema = Joi.object({
  password: Joi
    .string()
    .required()
});

exports.requestResetPasswordSchema = Joi.object({
  email: Joi
    .string()
    .email()
    .required()
});
