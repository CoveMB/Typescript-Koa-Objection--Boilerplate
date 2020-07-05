const Joi = require('@hapi/joi');

exports.query = Joi.object({
  query: Joi
    .string()
    .required()
});
