import Joi from '@hapi/joi';
import { validateRequest } from 'globalMiddlewares';

// GraphQl
export type GQLQueryRequest = {
  query: string
};

export const query = validateRequest(Joi.object({
  query: Joi
    .string()
    .required()
}));
