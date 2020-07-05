const Joi = require('@hapi/joi');

// Define schema to validate request body
exports.createUpdateSchema = Joi.object({
  email: Joi
    .string()
    .email(),
  password: Joi
    .string()
});
