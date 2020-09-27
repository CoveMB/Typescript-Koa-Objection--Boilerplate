
import { NotAuthenticatedError } from 'config/errors/error.types';
import { encryptionKey, jwtSecret } from 'config/variables';
import jwt from 'jsonwebtoken';
import { User } from 'models';
import BaseQueryBuilder from 'models/Base.queries';
import { Model, Page, PartialModelGraph } from 'objection';
import { EncodedJWTData, ReturnToken, StatefulNotAuthContext } from 'types';
import { getDevice } from 'utils/userAgent';
import { AES } from 'crypto-js';
import Token from './Token';

export default class TokenQueryBuilder<M extends Model, R = M[]>
  extends BaseQueryBuilder<M, R> {

  // These are necessary.
  ArrayQueryBuilderType!: TokenQueryBuilder<M, M[]>;
  SingleQueryBuilderType!: TokenQueryBuilder<M, M>;
  NumberQueryBuilderType!: TokenQueryBuilder<M, number>;
  PageQueryBuilderType!: TokenQueryBuilder<M, Page<M>>;

  // Validate token, if it exist and if it is not expired than return it with the attached user
  async validateToken(token: string): Promise<Token> {

    const foundToken = (await this
      .findOne('token', token)
      .withGraphFetched('user')) as unknown as Token;

    if (!foundToken || !foundToken.user) {

      // If no user is found throw a NotAuthenticatedError user
      throw new NotAuthenticatedError();

    }

    if (foundToken.expiration && foundToken.expiration < new Date()) {

      // If the token is expired throw a NotAuthenticatedError user
      throw new NotAuthenticatedError();

    }

    return foundToken;

  }

  // Generate an auth token for the user
  // By default the token will be temporary
  // If temporary it will have an expiration date
  async generateAuthToken(
    ctx: StatefulNotAuthContext,
    user: User,
    temporary = true
  ): Promise<ReturnToken> {

    const { userAgent } = ctx;

    // Encrypt user data stored in the JWT token
    const encryptedJWTData = AES.encrypt(
      JSON.stringify(
        {
          id   : user.id,
          uuid : user.uuid,
          admin: user.admin
        } as EncodedJWTData
      ), encryptionKey
    ).toString();

    const token = jwt.sign(encryptedJWTData, jwtSecret);

    // If the token is temporary it will expire in one hour
    let date = null;

    date = new Date();

    if (temporary) {

      // If temporary the token will expire in an hour
      date.setHours(date.getHours() + 1);

    } else {

      // Else it will expire in 6 month
      date.setMonth(date.getMonth() + 6);

    }

    // Insert the token and relate it to the user
    await this.insertGraph(
      {
        token,
        expiration: date,
        device    : getDevice(userAgent),
        user      : { id: user.id },
      } as unknown as PartialModelGraph<M>, {
        relate: true
      }
    );

    Token.setCookies(ctx, token, user, temporary);

    return {
      token, expiration: date
    };

  }

  // Revoke an auth token from the user
  async revokeAuthToken(token: string): Promise<number> {

    return this
      .findOne({ token })
      .delete();

  }

  // Revoke all auth tokens from the user
  async revokeAllAuthTokens(currentUser: User): Promise<number> {

    return this
      .where({ userId: currentUser.id })
      .delete();

  }

}
