import { ValidationError } from 'config/errors/error.types';
import { Context, Next } from 'koa';
import { ObjectSchema } from '@hapi/joi';

const validateRequest = (
  schema: ObjectSchema
) => async (ctx: Context, next: Next): Promise<void> => {

  try {

    const toValidate = ctx.request.body;

    await schema.validateAsync(toValidate);

    ctx.validatedRequest = toValidate;

  } catch (error) {

    const validationError = new ValidationError(error.details[0].message);

    ctx.throw(validationError);

  }

  await next();

};

export default validateRequest;
