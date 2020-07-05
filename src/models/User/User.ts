import BaseModel from 'models/BaseModel';
import { capitalize } from 'utils';
import { Token } from 'models';
import validateUserInput from './user.validations';
import UserQueryBuilder from './user.queries';

// This plugin allow for automatic password hashing, if you want to allow an empty password you need to pass it allowEmptyPassword (this way user can register and set their password after validating their email)
const Password = require('objection-password')({
  allowEmptyPassword: true
});

// This plugin allow for unique validation on model
const Unique = require('objection-unique')({
  fields     : [ 'email' ],
  identifiers: [ 'id' ]
});

export default class User extends Password(Unique(BaseModel)) {

  id!: number;
  uuid!: string;
  email!: string;
  token!: Token;

  static get tableName() {

    return 'user';

  }

  static get QueryBuilder() {

    // This register the custom query builder
    return UserQueryBuilder;

  }

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

  static relationMappings = () => ({
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
  $formatJson(user) {

    super.$formatJson(user);

    delete user.password;
    delete user.admin;
    delete user.created_at;
    delete user.updated_at;

    return user;

  }

  // This hook triggers before an insert
  async $beforeInsert(queryContext) {

    // Validate before password hashing
    validateUserInput(this);

    if (this.country) {

      this.country = capitalize(this.country);

    }

    if (this.name) {

      this.name = capitalize(this.name);

    }

    // Super will take care of hashing password
    await super.$beforeInsert(queryContext);

  }

  // This hook triggers before an update
  async $beforeUpdate(opt, queryContext) {

    // Validate before password hashing
    validateUserInput(this);

    if (this.country) {

      this.country = capitalize(this.country);

    }

    if (this.name) {

      this.country = capitalize(this.name);

    }

    // Super will take care of hashing password
    await super.$beforeUpdate(opt, queryContext);

  }

  // Modifiers are reusable query snippets that can be used in various places.
  static get modifiers() {

    return {

      // This modifier control the data that can be accessed depending of the authenticated user
      graphQLAccessControl(builder, user) {

        // Only the authenticated user should be accessible
        builder.where('id', user.id);

      }
    };

  }

}
