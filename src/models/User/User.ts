/* eslint-disable import/no-cycle */
/* eslint-disable no-multi-spaces */
/* eslint-disable no-param-reassign */
import Token from 'models/User/Token/Token';
import {
  RelationMappings, Modifiers, QueryContext, ModelOptions, ModifierFunction, QueryBuilder
} from 'objection';
import Unique from 'objection-unique';
import Password from 'objection-password';
import BaseModel from 'models/BaseModel';
import validateUserInput from './user.validations';
import UserQueryBuilder from './user.queries';

// This plugin allow for unique validation on model
@Unique({
  identifiers: [ 'id' ],
  fields     : [ 'email' ],
})

// This plugin allow for automatic password hashing, if you want to allow an empty password you need to pass it allowEmptyPassword (this way user can register and set their password after validating their email)
@Password({
  allowEmptyPassword: true
})
export default class User extends BaseModel {

  uuid!: string;
  email!: string;
  password!: string;
  admin!: boolean;

  // Needed until objection-password add types
  verifyPassword?: (password: string) => Promise<boolean>;

  tokens?: Token[];

  QueryBuilderType!: UserQueryBuilder<this>;

  // This register the custom query builder
  static QueryBuilder = UserQueryBuilder;

  static tableName = 'user';

  static jsonSchema = {
    type    : 'object',
    required: [ 'email' ],

    properties: {
      id   : { type: 'integer' },
      uuid : { type: 'string' },
      email: {
        type: 'string', minLength: 1, maxLength: 255
      },
      password: {
        type: 'string', minLength: 1, maxLength: 255
      },
      admin: {
        type: 'boolean'
      }
    }
  };

  static relationMappings = (): RelationMappings => ({
    tokens: {
      relation  : BaseModel.HasManyRelation,
      modelClass: Token,
      join      : {
        from: 'user.id',
        to  : 'token.user_id'
      }
    }
  });

  // Omit fields for json response from model
  $formatJson(user: User): User {

    super.$formatJson(user);

    delete user.password;
    delete user.admin;
    delete user.createdAt;
    delete user.updatedAt;

    return user;

  }

  // This hook triggers before an insert
  async $beforeInsert(queryContext: QueryContext): Promise<void> {

    // Validate before password hashing
    validateUserInput(this);

    // Super will take care of hashing password
    await super.$beforeInsert(queryContext);

  }

  // This hook triggers before an update
  async $beforeUpdate(opt: ModelOptions, queryContext: QueryContext): Promise<void> {

    // Validate before password hashing
    validateUserInput(this);

    // Super will take care of hashing password
    await super.$beforeUpdate(opt, queryContext);

  }

  // Modifiers are reusable query snippets that can be used in various places.
  static modifiers: Modifiers = {

    // Get modifiers from base class
    ...BaseModel.modifiers,

    // This modifier control the data that can be accessed depending of the authenticated user
    graphQLAccessControl(builder: QueryBuilder<User>, user: User) {

      // Only the authenticated user should be accessible
      builder.where('id', user.id);

    }

  };

}