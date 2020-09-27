import { Token, User } from 'models';
import { sendConfirmationEmail, sendResetPasswordEmail } from 'models/User/Token/token.emails';
import { StatefulMiddleware, StatefulNotAuthMiddleware } from 'types';
import { NotAuthorizeError } from 'config/errors/error.types';
import {
  LogoutRequest, SetPasswordRequest, RegisterThirdPartyRequest, RegisterRequest
} from './middlewares/auth.requests';
import {
  LoginRecords, RequestResetPasswordRecords, RegisterThirdPartyRecords, SetPasswordRecords
} from './middlewares/auth.records';

export const logIn: StatefulNotAuthMiddleware<LoginRecords> = async (ctx) => {

  try {

    const { state: { records: { user } } } = ctx;

    // Generate a non temporary JWT token for authentication
    const temporary = false;

    await Token.query()
      .generateAuthToken(ctx, user, temporary);

    // Send back the token
    ctx.body = {
      status: 'success', user
    };

  } catch (error) {

    ctx.throw(error);

  }

};

// The user the the parameter comes back from the authenticated middleware
export const logOut: StatefulMiddleware<LogoutRequest> = async (ctx) => {

  try {

    // The authenticated middleware attache the user that made the request to the context
    const {
      validatedRequest: { token: requestToken },
      authenticated : { token: userToken }
    } = ctx.state;

    if (requestToken) {

      // If the request contain a specific token we log out this one
      await Token.query().revokeAuthToken(requestToken);

    } else {

      // Else we log the currently used one
      await Token.query().revokeAuthToken(userToken);

      Token.removeCookies(ctx);

    }

    ctx.body = {
      status: 'success'
    };

  } catch (error) {

    ctx.throw(error);

  }

};

// The user the the parameter comes back from the authenticated middleware
export const logOutAll: StatefulMiddleware = async (ctx) => {

  try {

    // The authenticated middleware attache the user that made the request to the context
    const { user } = ctx.state.authenticated;

    await Token.query().revokeAllAuthTokens(user);

    Token.removeCookies(ctx);

    ctx.body = {
      status: 'success'
    };

  } catch (error) {

    ctx.throw(error);

  }

};

export const register: StatefulNotAuthMiddleware<RegisterRequest> = async (ctx) => {

  try {

    const { state: { validatedRequest: userData } } = ctx;

    // Create new user
    const user = await User.query().insertAndFetch(userData);

    // Generate JWT token for the new user
    const token = await Token.query()
      .generateAuthToken(ctx, user);

    sendConfirmationEmail(ctx, user, token);

    // And send it back
    ctx.status = 201;
    ctx.body = {
      status: 'success'
    };

  } catch (error) {

    ctx.throw(error);

  }

};

// Check if the token sent is still valid
export const getCsrf: StatefulMiddleware = async (ctx) => {

  try {

    // The token is still valid
    ctx.body = {
      status: 'success',
      csrf  : ctx.csrf
    };

  } catch (error) {

    ctx.throw(error);

  }

};

// Check if the token sent is still valid
export const checkToken: StatefulMiddleware = async (ctx) => {

  try {

    const { user, token } = ctx.state.authenticated;

    if (!user) {

      Token.removeCookies(ctx);
      throw new NotAuthorizeError();

    }

    await Token.query().validateToken(token);

    // The token is still valid
    ctx.body = {
      status: 'success'
    };

  } catch (error) {

    ctx.throw(error);

  }

};

export const requestResetPassword:
StatefulNotAuthMiddleware<RequestResetPasswordRecords> = async (ctx) => {

  try {

    const { state: { records: { user } } } = ctx;

    // Generate a temporary JWT token for to send to the email to able password reset
    const token = await Token.query()
      .generateAuthToken(ctx, user);

    sendResetPasswordEmail(ctx, user, token);

    // Destroy session
    ctx.session = null;

    ctx.body = {
      status: 'success'
    };

  } catch (error) {

    ctx.throw(error);

  }

};

export const setPassword:
StatefulNotAuthMiddleware<SetPasswordRequest & SetPasswordRecords> = async (ctx) => {

  try {

    const {
      state: {
        validatedRequest: { password },
        records: { user }
      }
    } = ctx;

    // Update the user
    await user.$query()
      .patch({ password });

    // Revoke other tokens
    await Token.query()
      .revokeAllAuthTokens(user);

    // Send a fresh non temporary token
    const temporary = false;

    await Token.query()
      .generateAuthToken(ctx, user, temporary);

    ctx.status = 204;
    ctx.body = {
      status: 'success',
      user
    };

  } catch (error) {

    ctx.throw(error);

  }

};

export const registerThirdParty: StatefulNotAuthMiddleware<
RegisterThirdPartyRecords & RegisterThirdPartyRequest
> = async (ctx) => {

  try {

    const { state: { validatedRequest, records: { user } } } = ctx;

    // Update with latest google info
    const updatedUser = await user.$query()
      .patchAndFetch(validatedRequest.user);

    // Generate JWT token for authentication
    const temporary = false;

    await Token.query()
      .generateAuthToken(ctx, updatedUser, temporary);

    // And send it back
    ctx.status = 200;
    ctx.body = {
      status: 'success',
      user  : updatedUser
    };

  } catch (error) {

    ctx.throw(error);

  }

};
