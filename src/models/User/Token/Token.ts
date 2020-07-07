import BaseModel from 'models/BaseModel';
import User from 'models/User/User';
import { RelationMappings, Modifiers, Model } from 'objection';
import BaseQueryBuilder from 'models/Base.queries';
import TokenQueryBuilder from './token.queries';

export default class Token extends BaseModel {

  uuid!: string;
  userId!: number;
  device!: string;
  expiration!: Date;
  token!: string;
  user!: User;

  QueryBuilderType!: TokenQueryBuilder<this>;

  static tableName = 'token';

  static QueryBuilder = TokenQueryBuilder;

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
        from: 'token.user_id',
        to  : 'user.id'
      }
    },
  });

  // Modifiers are reusable query snippets that can be used in various places.
  static modifiers: Modifiers = {

    // This modifier control the data that can be accessed depending of the authenticated user
    graphQLAccessControl(builder, user) {

      // Only the tokens from the authenticated user should be accessible
      builder.where('user_id', user.id);

    }
  };

}
