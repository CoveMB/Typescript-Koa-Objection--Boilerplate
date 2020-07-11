import Joi from '@hapi/joi';
import { validateRequest } from 'globalMiddlewares';
import { Middleware } from 'koa';

// Define schema to validate request body
export const createUpdateSchema: Middleware = validateRequest(Joi.object({
  email: Joi
    .string()
    .email(),
  password: Joi
    .string()
}));
