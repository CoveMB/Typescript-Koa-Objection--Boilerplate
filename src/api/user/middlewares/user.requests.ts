import Joi from 'joi';
import { validateRequest } from 'globalMiddlewares';
import { RequestSchema } from 'types';

// Create and Update schema
export type UpdateUserRequest = RequestSchema<{
  email: string
}>;

// Define schema to validate request body
export const updateSchema = validateRequest(Joi.object({
  email: Joi
    .string()
    .email()
    .required()
}));
