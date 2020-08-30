import { Token } from 'models';
import { sendResetPasswordEmail } from 'models/User/Token/token.emails';
import { StatefulMiddleware } from 'types';
import { LogoutRequest, SetPasswordRequest, RegisterThirdPartyRequest } from './middlewares/auth.requests';
import { LoginRecords, RequestResetPasswordRecords, RegisterThirdPartyRecords } from './middlewares/auth.records';

export const logIn: StatefulMiddleware<LoginRecords> = async ctx => {

  try {

    const { userAgent, state: { records: { user } } } = ctx;

    // Generate JWT token for authentication
    const token = await Token.query()
      .generateAuthToken(user, userAgent);

    // Send back the token
    ctx.body = {
      status: 'success', user, token
    };

  } catch (error) {

    ctx.throw(error);

  }

};

// The user the the parameter comes back from the authenticated middleware
export const logOut: StatefulMiddleware<LogoutRequest> = async ctx => {

  try {

    // The authenticated middleware attache the user that made the request to the context
    const { validatedRequest: { token } } = ctx.state;

    await Token.query().revokeAuthToken(token);

    ctx.body = {
      status: 'success'
    };

  } catch (error) {

    ctx.throw(error);

  }

};

// The user the the parameter comes back from the authenticated middleware
export const logOutAll: StatefulMiddleware = async ctx => {

  try {

    // The authenticated middleware attache the user that made the request to the context
    const { user } = ctx.state.authenticated;

    await Token.query().revokeAllAuthTokens(user);

    ctx.body = {
      status: 'success'
    };

  } catch (error) {

    ctx.throw(error);

  }

};

// Check if the token sent is still valid
export const checkToken: StatefulMiddleware = async ctx => {

  try {

    // The token is still valid
    ctx.body = {
      status: 'success'
    };

  } catch (error) {

    ctx.throw(error);

  }

};

export const requestResetPassword: StatefulMiddleware<RequestResetPasswordRecords> = async ctx => {

  try {

    const { userAgent, state: { records: { user } } } = ctx;

    // Generate JWT token for to send to the email to able password reset
    const temporary = true;
    const token = await Token.query()
      .generateAuthToken(user, userAgent, temporary);

    sendResetPasswordEmail(ctx, user, token);

    ctx.body = {
      status: 'success'
    };

  } catch (error) {

    ctx.throw(error);

  }

};

export const setPassword: StatefulMiddleware<SetPasswordRequest> = async ctx => {

  try {

    const { state: { validatedRequest: credentials, authenticated: { user } }, userAgent } = ctx;

    // Update the user
    await user.$query()
      .patch(credentials);

    // Revoke other tokens
    await Token.query()
      .revokeAllAuthTokens(user);

    // Send fresh one
    const newToken = await Token.query()
      .generateAuthToken(user, userAgent);

    ctx.body = {
      status: 'success',
      user,
      token : newToken
    };

  } catch (error) {

    ctx.throw(error);

  }

};

export const registerThirdParty: StatefulMiddleware<RegisterThirdPartyRecords & RegisterThirdPartyRequest> = async ctx => {

  try {

    const { state: { validatedRequest, records: { user } }, userAgent } = ctx;

    // Update with latest google info
    const updatedUser = await user.$query()
      .patchAndFetch(validatedRequest.user);

    // Generate JWT token for authentication
    const token = await Token.query()
      .generateAuthToken(user, userAgent);

    // And send it back
    ctx.status = 200;
    ctx.body = {
      status: 'success',
      user  : updatedUser,
      token
    };

  } catch (error) {

    ctx.throw(error);

  }

};
