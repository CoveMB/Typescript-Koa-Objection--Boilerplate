/* eslint-disable max-classes-per-file */
// Hidden errors //

abstract class CustomError extends Error {

  abstract message: string;
  abstract name: string;
  abstract status: number;
  abstract expose: boolean;

}

export class ConfigError extends CustomError {

  message!: string;
  name = 'ConfigError';
  status = 555;
  expose = false;

  // This error is generated if a configuration fails
  constructor(message: string) {

    super(`The configuration failed: ${message}`);

  }

}

export class QueryError extends CustomError {

  message!: string;
  name = 'QueryError';
  status = 510;
  expose = false;

  // This error is generated if a query fails
  constructor(message: string) {

    super(`The query failed: ${message}`);

  }

}

export class ImplementationMissingError extends CustomError {

  message!: string;
  name = 'ImplementationMissingError';
  status = 550;
  expose = false;

  // This error is generated if a query fails
  constructor(message: string) {

    super(`You are missing an implementation: ${message}`);

  }

}

export class EmailNotSentError extends CustomError {

  message!: string;
  name = 'EmailNotSentError';
  status = 503;
  expose = false;

  // This error is generated if an email could not been sent
  constructor(message: string) {

    super(`Email could not been sent: ${message}`);

  }

}

export class ThirdPartyError extends CustomError {

  message!: string;
  name = 'ThirdPartyError';
  status = 515;
  expose = false;

  // This error is generated if an email could not been sent
  constructor(message: string) {

    super(`A third party involved in the request could not been reach: ${message}`);

  }

}

// Exposed errors //

export class NotFoundError extends CustomError {

  message!: string;
  name = 'NotFoundError';
  status = 400;
  expose = true;

  // This error is generated when a record is nopt found in the db
  constructor(message: string) {

    super(`Not found: ${message}`);

  }

}

export class LoginError extends CustomError {

  message!: string;
  name = 'LoginError';
  status = 401;
  expose = true;

  // This error is generated when a login failed
  constructor() {

    super('Unable to login');

  }

}

export class NotAuthenticatedError extends CustomError {

  message!: string;
  name = 'NotAuthenticatedError';
  status = 401;
  expose = true;

  // This error is generated when the user is performing an action that require authentication but he/she is not
  constructor() {

    super('You need to be authenticated to perform this action');

  }

}

export class ExpiredTokenError extends CustomError {

  message!: string;
  name = 'ExpiredTokenError';
  status = 401;
  expose = true;

  // This error is generated when a token sent with the request is expired
  constructor() {

    super('The token sent with the request is expired');

  }

}

export class ValidationError extends CustomError {

  message!: string;
  name = 'ValidationError';
  status = 422;
  expose = true;

  // This error is generated when a validation have failed
  constructor(message: string) {

    super(`The validation failed: ${message}`);

  }

}

export class NotAuthorizeError extends CustomError {

  message!: string;
  name = 'NotAuthorizeError';
  status = 403;
  expose = true;

  // This error is generated when the user is performing an unauthorized action
  constructor() {

    super('You are not authorize to perform this action');

  }

}
