import { User } from 'models';
import { validateFoundInstances } from 'models/model.utils';
import { RecordsSchema, StatefulMiddleware } from 'types';
import { RequestResetPasswordRequest, RegisterThirdPartyRequest, LoginRequest } from './auth.requests';

// Login
export type LoginRecords = RecordsSchema<{
  user: User
}>;

export const loginRecords: StatefulMiddleware<LoginRequest> = async (ctx, next
) => {

  try {

    const { validatedRequest : credentials } = ctx.state;

    // Find the user from the send credentials
    const user = await User.query().findByCredentials(credentials);

    ctx.state.records = { user };

  } catch (error) {

    ctx.throw(error);

  }

  await next();

};

// Request reset Password
export type RequestResetPasswordRecords = RecordsSchema<{
  user: User
}>;

export const requestResetPasswordRecords: StatefulMiddleware<RequestResetPasswordRequest> = async (ctx, next) => {

  try {

    const { validatedRequest: credentials } = ctx.state;

    // Find the user from the email
    const user = await User.query().findOne(credentials);

    // Validate that a user was found
    validateFoundInstances([
      {
        instance: user, type: 'User', search: 'email'
      }
    ]);

    // Attach it to the context
    ctx.state.records = { user };

  } catch (error) {

    ctx.throw(error);

  }

  await next();

};

// Register third party
export type RegisterThirdPartyRecords = RecordsSchema<{
  user: User
}>;

export const registerThirdPartyRecords: StatefulMiddleware<RegisterThirdPartyRequest> = async (ctx, next) => {

  try {

    const { validatedRequest: userInfo } = ctx.state;

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
    ctx.state.records = { user };

  } catch (error) {

    ctx.throw(error);

  }

  await next();

};
