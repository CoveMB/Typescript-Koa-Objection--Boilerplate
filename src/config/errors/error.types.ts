/* eslint-disable max-classes-per-file */
// Hidden errors //

export class ConfigError extends Error {

  message!: string;
  name!: string;
  status!: number;
  expose!: boolean;
  stack?: string;

  // This error is generated if a configuration fails
  constructor(message: string) {

    super(`The configuration failed: ${message}`);
    this.name = 'ConfigError';
    this.status = 555;
    this.expose = false;

  }

}

export class QueryError extends Error {

  message!: string;
  name!: string;
  status!: number;
  expose!: boolean;
  stack?: string;

  // This error is generated if a query fails
  constructor(message: string) {

    super(`The query failed: ${message}`);
    this.name = 'QueryError';
    this.status = 510;
    this.expose = false;

  }

}

export class ImplementationMissingError extends Error {

  message!: string;
  name!: string;
  status!: number;
  expose!: boolean;
  stack?: string;

  // This error is generated if a query fails
  constructor(message: string) {

    super(`You are missing an implementation: ${message}`);
    this.name = 'ImplementationMissingError';
    this.status = 550;
    this.expose = false;

  }

}

export class EmailNotSentError extends Error {

  message!: string;
  name!: string;
  status!: number;
  expose!: boolean;
  stack?: string;

  // This error is generated if an email could not been sent
  constructor(message: string) {

    super(`Email could not been sent: ${message}`);
    this.name = 'EmailNotSentError';
    this.status = 503;
    this.expose = false;

  }

}

export class ThirdPartyError extends Error {

  message!: string;
  name!: string;
  status!: number;
  expose!: boolean;
  stack?: string;

  // This error is generated if an email could not been sent
  constructor(message: string) {

    super(`A third party involved in the request could not been reach: ${message}`);
    this.name = 'ThirdPartyError';
    this.status = 515;
    this.expose = false;

  }

}

// Exposed errors //

export class NotFoundError extends Error {

  message!: string;
  name!: string;
  status!: number;
  expose!: boolean;
  stack?: string;

  // This error is generated when a record is nopt found in the db
  constructor(message: string) {

    super(`Not found: ${message}`);
    this.name = 'NotFoundError';
    this.status = 400;
    this.expose = true;

  }

}

export class LoginError extends Error {

  message!: string;
  name!: string;
  status!: number;
  expose!: boolean;
  stack?: string;

  // This error is generated when a login failed
  constructor() {

    super('Unable to login');
    this.name = 'LoginError';
    this.status = 401;
    this.expose = true;

  }

}

export class NotAuthenticatedError extends Error {

  message!: string;
  name!: string;
  status!: number;
  expose!: boolean;
  stack?: string;

  // This error is generated when the user is performing an action that require authentication but he/she is not
  constructor() {

    super('You need to be authenticated to perform this action');
    this.name = 'NotAuthenticatedError';
    this.status = 401;
    this.expose = true;

  }

}

export class ExpiredTokenError extends Error {

  message!: string;
  name!: string;
  status!: number;
  expose!: boolean;
  stack?: string;

  // This error is generated when a token sent with the request is expired
  constructor() {

    super('The token sent with the request is expired');
    this.name = 'ExpiredTokenError';
    this.status = 401;
    this.expose = true;

  }

}

export class ValidationError extends Error {

  message!: string;
  name!: string;
  status!: number;
  expose!: boolean;
  stack?: string;

  // This error is generated when a validation have failed
  constructor(message: string) {

    super(`The validation failed: ${message}`);
    this.name = 'ValidationError';
    this.status = 422;
    this.expose = true;

  }

}

export class NotAuthorizeError extends Error {

  message!: string;
  name!: string;
  status!: number;
  expose!: boolean;
  stack?: string;

  // This error is generated when the user is performing an unauthorized action
  constructor() {

    super('You are not authorize to perform this action');
    this.name = 'NotAuthorizeError';
    this.status = 403;
    this.expose = true;

  }

}
