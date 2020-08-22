import { Context, Next } from 'koa';
import { User } from 'models';
import { validateFoundInstances } from 'models/model.utils';
import { PartialModelObject } from 'objection';

export const loginRecords = async (
  ctx: Context & WithValidatedRequest<Credentials>,
  next: Next
): Promise<void> => {

  try {

    const { validatedRequest: credentials } = ctx;

    // Find the user from the send credentials
    const user = await User.query().findByCredentials(credentials);

    ctx.records = { user };

  } catch (error) {

    ctx.throw(error);

  }

  await next();

};

export const requestResetPasswordRecords = async (
  ctx: Context & WithValidatedRequest<{email: string}>,
  next: Next
): Promise<void> => {

  try {

    const { validatedRequest: email } = ctx;

    // Find the user from the email
    const user = await User.query().findOne(email);

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

export const registerThirdPartyRecords = async (
  ctx: Context & WithValidatedRequest<{user: PartialModelObject<User>}>,
  next: Next
): Promise<void> => {

  try {

    const { validatedRequest: userInfo } = ctx;

    // Find existing user with email or create it
    const user = await User
      .query()
      .findOrCreate({ email: userInfo.user.email });

    // Validate that a user was found
    validateFoundInstances([
      {
        instance: user, type: 'User', search: userInfo.user.email as string
      }
    ]);

    // Attach it to the context
    ctx.records = { user };

  } catch (error) {

    ctx.throw(error);

  }

  await next();

};
