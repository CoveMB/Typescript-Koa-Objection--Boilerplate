import Joi from '@hapi/joi';

export const loginSchema = Joi.object({
  email: Joi
    .string()
    .email()
    .required(),
  password: Joi
    .string()
    .required()
});

export const logoutSchema = Joi.object({
  token: Joi
    .string()
    .required()
});

export const logoutAllSchema = Joi.object({
});

export const setPasswordSchema = Joi.object({
  password: Joi
    .string()
    .required()
});

export const requestResetPasswordSchema = Joi.object({
  email: Joi
    .string()
    .email()
    .required()
});
