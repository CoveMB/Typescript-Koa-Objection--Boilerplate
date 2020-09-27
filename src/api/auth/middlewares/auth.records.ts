import { NotFoundError } from 'config/errors/error.types';
import { Token, User } from 'models';
import { validateFoundInstances } from 'models/model.utils';
import { RecordsSchema, StatefulNotAuthMiddleware } from 'types';
import {
  RequestResetPasswordRequest, RegisterThirdPartyRequest, LoginRequest, SetPasswordRequest
} from './auth.requests';

// Login
export type LoginRecords = RecordsSchema<{
  user: User
}>;

export const loginRecords: StatefulNotAuthMiddleware<LoginRequest> = async (ctx, next
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

export const requestResetPasswordRecords:
StatefulNotAuthMiddleware<RequestResetPasswordRequest> = async (ctx, next) => {

  try {

    const { validatedRequest: { email } } = ctx.state;

    // Find the user from the email
    const user = await User.query().findOne({ email });

    // Validate that a user was found
    if (!user) {

      throw new NotFoundError('We did not found any user with this email address');

    }

    // Attach it to the context
    ctx.state.records = { user };

  } catch (error) {

    ctx.throw(error);

  }

  await next();

};

// Set password
export type SetPasswordRecords = RecordsSchema<{
  user: User
}>;

export const setPasswordRecords:
StatefulNotAuthMiddleware<SetPasswordRequest> = async (ctx, next) => {

  try {

    const { validatedRequest: { token } } = ctx.state;

    // Validate that the token still exist and is not expired
    const { user } = await Token.query().validateToken(token);

    // Validate that a user was found
    validateFoundInstances([
      {
        instance: user, type: 'User', search: 'token'
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

export const registerThirdPartyRecords:
StatefulNotAuthMiddleware<RegisterThirdPartyRequest> = async (ctx, next) => {

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
