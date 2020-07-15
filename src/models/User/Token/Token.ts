/* eslint-disable import/no-cycle */
import BaseModel from 'models/BaseModel';
import User from 'models/User/User';
import { Modifiers, RelationMappings } from 'objection';
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
        from: 'token.user_id',
        to  : 'user.id'
      }
    },
  });

  // Modifiers are reusable query snippets that can be used in various places.
  static modifiers: Modifiers = {

    // Get modifiers from base class
    ...BaseModel.modifiers,

    // This modifier control the data that can be accessed depending of the authenticated user
    graphQLAccessControl(builder, user) {

      // Only the tokens from the authenticated user should be accessible
      builder.where('user_id', user.id);

    }
  };

}
