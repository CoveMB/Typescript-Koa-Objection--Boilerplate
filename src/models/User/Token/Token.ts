
import { cookies, isDevelopment } from 'config/variables';
import BaseModel from 'models/BaseModel';
import User from 'models/User/User';
import { Modifiers, RelationMappings, QueryBuilder } from 'objection';
import { Context } from 'vm';
import TokenQueryBuilder from './token.queries';

export default class Token extends BaseModel {

  // Properties types
  userId!: number;
  device!: string;
  expiration!: Date;
  token!: string;

  // Relationships types
  user!: User;

  // Query type
  QueryBuilderType!: TokenQueryBuilder<this>;

  // This register the custom query builder
  static QueryBuilder = TokenQueryBuilder;

  static tableName = 'token';

  static jsonSchema = {

    type    : 'object',
    required: [ 'token' ],

    properties: {
      id    : { type: 'integer' },
      uuid  : { type: 'string' },
      userId: { type: 'integer' },
      device: {
        type: 'string', minLength: 1, maxLength: 255
      },

      // expiration: { type: 'format' },
      token: {
        type: 'string', minLength: 1, maxLength: 255
      },
    }
  };

  static relationMappings = (): RelationMappings => ({
    user: {
      relation  : BaseModel.BelongsToOneRelation,
      modelClass: User,
      join      : {
        from: 'token.userId',
        to  : 'user.id'
      }
    },
  });

  static setCookies = (
    ctx: Context,
    token: string,
    user: User,
    temporary: boolean
  ): void => {

    // If it is a long term token we can set them in a cookie
    if (!temporary) {

      // Set the new token in a cookie not accessible from javascript
      ctx.cookies.set(cookies.AuthCookieName, token, {
        sameSite: 'lax',
        httpOnly: true,
        secure  : !isDevelopment
      });

      // Set the user in a cookie accessible from javascript
      ctx.cookies.set(cookies.UserCookieName, JSON.stringify({
        uuid: user.uuid, email: user.email, profilePicture: user.profilePicture
      }), {
        sameSite: 'lax',
        httpOnly: false,
        secure  : !isDevelopment
      });

    }

  };

  static removeCookies = (ctx: Context): void => {

    // Delete auth and user cookie
    ctx.cookies.set(cookies.AuthCookieName);
    ctx.cookies.set(cookies.UserCookieName);

  };

  static modifiers: Modifiers = {

    // Get modifiers from base class
    ...BaseModel.modifiers,

    // This modifier control the data that can be accessed depending of the authenticated user
    graphQLAccessControl(builder: QueryBuilder<Token>, user: User) {

      // Only the tokens from the authenticated user should be accessible
      builder.where('userId', user.id);

    }
  };

}
