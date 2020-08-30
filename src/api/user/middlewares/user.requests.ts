import Joi from '@hapi/joi';
import { validateRequest } from 'globalMiddlewares';
import { RequestSchema } from 'types';

// Create and Update schema
export type CreateUpdateUserRequest = RequestSchema<{
  email: string,
  password: string
}>;

// Define schema to validate request body
export const createUpdateSchema = validateRequest(Joi.object({
  email: Joi
    .string()
    .email(),
  password: Joi
    .string()
}));
