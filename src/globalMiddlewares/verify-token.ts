import { NotAuthenticatedError } from 'config/errors/error.types';
import { cookies, encryptionKey, jwtSecret } from 'config/variables';
import jwt from 'jsonwebtoken';
import { Middleware } from 'koa';
import { Token } from 'models';
import { AES, enc } from 'crypto-js';

const { AuthCookieName } = cookies;

// Makes sure request are authenticated
const verifyAuthToken: Middleware = async (ctx, next) => {

  try {

    // Get the auth token from either the auth cookie or authorization header
    const userToken = ctx.cookies.get(AuthCookieName);
    const appToken = ctx.get('Authorization').replace('Bearer ', '');

    // If there is an app token present the auth cookie containing the user info should not be taken in consideration

    if (appToken) {

      // Make sure it's valid and get it's payload
      jwt.verify(appToken, jwtSecret);

      // Attach the found user and current token to the response
      ctx.state.authenticated = {
        token: appToken
      };

    } else if (userToken) {

      // Make sure it's valid and get it's payload
      const userPayload = jwt.verify(userToken, jwtSecret) as string;

      // Decrypt the payload
      const bytes  = AES.decrypt(userPayload, encryptionKey);
      const decryptedUser = JSON.parse(bytes.toString(enc.Utf8));

      // Attach the found user and current token to the response
      ctx.state.authenticated = {
        user : decryptedUser,
        token: userToken
      };

    } else {

      // If no authentication token has been sent raise an error
      throw new NotAuthenticatedError();

    }

  } catch (error) {

    ctx.throw(error);

  }

  await next();

};

export default verifyAuthToken;
