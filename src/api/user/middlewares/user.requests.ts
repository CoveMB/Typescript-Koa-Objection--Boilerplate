import Joi from '@hapi/joi';
import { validateRequest } from 'globalMiddlewares';

// Define schema to validate request body
export const createUpdateSchema = validateRequest(Joi.object({
  email: Joi
    .string()
    .email(),
  password: Joi
    .string()
}));
