import Joi from '@hapi/joi';

export const query = Joi.object({
  query: Joi
    .string()
    .required()
});
