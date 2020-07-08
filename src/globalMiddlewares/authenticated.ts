import { NotAuthenticatedError } from 'config/errors/error.types';
import { jwtSecret } from 'config/variables';
import jwt from 'jsonwebtoken';
import { Token } from 'models';
import { Context, Next } from 'koa';

const authenticated = async (ctx: Context, next: Next): Promise<void> => {

  try {

    // Get the bearer token
    const token = ctx.get('Authorization').replace('Bearer ', '');

    try {

      // Make sure it's valid and get the user id from it
      await jwt.verify(token, jwtSecret);

    } catch {

      ctx.throw(new NotAuthenticatedError());

    }

    // Find the appropriate user attached to the token if the token is valid
    const foundToken = await Token.query()
      .tokenWithUserGraphIfValid(token);

    if (!foundToken) {

      ctx.throw(new NotAuthenticatedError());

    }

    // Attach the found user and current token to the response
    ctx.authenticated = {
      user: foundToken.user, token
    };

  } catch (error) {

    ctx.throw(error);

  }

  await next();

};

export default authenticated;
