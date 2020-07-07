import { NotAuthenticatedError, ExpiredTokenError } from 'config/errors/error.types';
import jwt from 'jsonwebtoken';
import { jwtSecret } from 'config/variables';
import BaseQueryBuilder from 'models/Base.queries';
import { Model, Page } from 'objection';
import Token from './Token';

export default class TokenQueryBuilder<M extends (Model | Token), R = M[]>
  extends BaseQueryBuilder<M, R> {

  // These are necessary.
  ArrayQueryBuilderType!: TokenQueryBuilder<M, M[]>;
  SingleQueryBuilderType!: TokenQueryBuilder<M, M>;
  NumberQueryBuilderType!: TokenQueryBuilder<M, number>;
  PageQueryBuilderType!: TokenQueryBuilder<M, Page<M>>;

  // Validate token, if it exist and if it is not expired than return it with the attached user
  async tokenWithUserGraphIfValid(token) {

    const foundToken = await this
      .findOne('token', token)
      .withGraphFetched('user');

    if (!foundToken || !foundToken.user) {

      // If no user is found throw a NotAuthenticatedError user
      throw new NotAuthenticatedError();

    }

    if (foundToken.expiration && foundToken.expiration < new Date()) {

      // If the token is expired throw a NotAuthenticatedError user
      throw new ExpiredTokenError();

    }

    return foundToken;

  }

  // Generate an auth token for the user
  // By default the token will be temporary
  // If temporary it will have an expiration date
  async generateAuthToken(user, { _agent }, temporary) {

    const token = await jwt.sign({ id: user.id }, jwtSecret);

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
        device    : `${_agent.os || 'unknown'} - ${_agent.browser || 'unknown'}`,
        user,
      }, {
        relate: true
      }
    );

    return {
      token, expiration: date
    };

  }

  // Revoke an auth token from the user
  async revokeAuthToken(token) {

    return this
      .findOne({ token })
      .delete();

  }

  // Revoke all auth tokens from the user
  async revokeAllAuthTokens(user) {

    return this
      .where({ user_id: user.id })
      .delete();

  }

}
