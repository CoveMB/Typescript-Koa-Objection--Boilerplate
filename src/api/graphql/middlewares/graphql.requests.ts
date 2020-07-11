import Joi from '@hapi/joi';
import { validateRequest } from 'globalMiddlewares';

export const query = validateRequest(Joi.object({
  query: Joi
    .string()
    .required()
}));
