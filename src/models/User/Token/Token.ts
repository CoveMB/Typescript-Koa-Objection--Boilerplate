import BaseModel from 'models/BaseModel';
import { User } from 'models';
import TokenQueryBuilder from './token.queries';

export default class Token extends BaseModel {

  id!: number;
  uuid!: string;
  userId!: number;
  device!: string;
  expiration!: string;
  token!: string;
  user!: User;
  created_at!: string;
  updated_at!: string;

  static get tableName() {

    return 'token';

  }

  static get QueryBuilder() {

    // This register the custom query builder
    return TokenQueryBuilder;

  }

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

  static relationMappings = () => ({

    // // eslint-disable-next-line global-require
    // const { User } = require('models');
    user: {
      relation: BaseModel.BelongsToOneRelation,

      modelClass: User,
      join      : {
        from: 'token.user_id',
        to  : 'user.id'
      }
    },

  });

  // Modifiers are reusable query snippets that can be used in various places.
  static get modifiers() {

    return {
      orderByCreation(builder) {

        builder.orderBy('created_at');

      },

      // This modifier control the data that can be accessed depending of the authenticated user
      graphQLAccessControl(builder, user) {

        // Only the tokens from the authenticated user should be accessible
        builder.where('user_id', user.id);

      }
    };

  }

}
