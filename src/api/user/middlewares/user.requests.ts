import Joi from '@hapi/joi';

// Define schema to validate request body
export const createUpdateSchema = Joi.object({
  email: Joi
    .string()
    .email(),
  password: Joi
    .string()
});
