import { User } from 'models';
import { validateFoundInstances } from 'models/model.utils';
import { AuthValidatedRequestContext } from 'types';
import { Next } from 'koa';

export const loginRecords = async (
  ctx: AuthValidatedRequestContext,
  next: Next
): Promise<void> => {

  try {

    const { validatedRequest } = ctx;

    // Find the user from the send credentials
    const user = await User.query().findByCredentials(validatedRequest);

    ctx.records = { user };

  } catch (error) {

    ctx.throw(error);

  }

  await next();

};

export const requestResetPasswordRecords = async (
  ctx: AuthValidatedRequestContext,
  next: Next
): Promise<void> => {

  try {

    const { validatedRequest } = ctx;

    // Find the user from the email
    const user = await User.query().findOne(validatedRequest);

    // Validate that a user was found
    validateFoundInstances([
      {
        instance: user, type: 'User', search: 'email'
      }
    ]);

    // Attach it to the context
    ctx.records = { user };

  } catch (error) {

    ctx.throw(error);

  }

  await next();

};
