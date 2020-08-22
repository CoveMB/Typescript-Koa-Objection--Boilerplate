import { Context } from 'koa';
import { UserAgentContext } from 'koa-useragent';
import { Token, User } from 'models';
import { sendResetPasswordEmail } from 'models/User/Token/token.emails';
import { AuthenticatedContext } from 'types';

export const logIn = async (
  ctx: Context & WithRecords<{user: User}> & UserAgentContext
): Promise<void> => {

  try {

    const { userAgent, records: { user } } = ctx;

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
export const logOut = async (
  ctx: Context & WithValidatedRequest<{token: string}>
): Promise<void> => {

  try {

    // The authenticated middleware attache the user that made the request to the context
    const { token } = ctx.validatedRequest;

    await Token.query().revokeAuthToken(token);

    ctx.body = {
      status: 'success'
    };

  } catch (error) {

    ctx.throw(error);

  }

};

// The user the the parameter comes back from the authenticated middleware
export const logOutAll = async (
  ctx: AuthenticatedContext
): Promise<void> => {

  try {

    // The authenticated middleware attache the user that made the request to the context
    const { user } = ctx.authenticated;

    await Token.query().revokeAllAuthTokens(user);

    ctx.body = {
      status: 'success'
    };

  } catch (error) {

    ctx.throw(error);

  }

};

// Check if the token sent is still valid
export const checkToken = async (ctx: Context): Promise<void> => {

  try {

    // The token is still valid
    ctx.body = {
      status: 'success'
    };

  } catch (error) {

    ctx.throw(error);

  }

};

export const requestResetPassword = async (
  ctx: Context & WithRecords<{user: User}> & UserAgentContext
): Promise<void> => {

  try {

    const { userAgent, records: { user } } = ctx;

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

export const setPassword = async (
  ctx: AuthenticatedContext & WithValidatedRequest<{password: string}> & UserAgentContext
): Promise<void> => {

  try {

    const { validatedRequest: password, userAgent, authenticated: { user } } = ctx;

    // Update the user
    await user.$query()
      .patch(password);

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

export const registerThirdParty = async (
  ctx: Context &
  WithRecords<{
    user: User
  }> & UserAgentContext
): Promise<void> => {

  try {

    const { validatedRequest, records: { user }, userAgent } = ctx;

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
