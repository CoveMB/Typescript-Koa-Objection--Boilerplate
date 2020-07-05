const jwt = require('jsonwebtoken');
const { Token } = require('models');
const { NotAuthenticatedError } = require('config/errors/error.types');
const { jwtSecret } = require('config/variables');

exports.authenticated = async (ctx, next) => {

  try {

    // Get the bearer token
    const token = ctx.get('Authorization').replace('Bearer ', '');

    let decoded = {};

    try {

      // Make sure it's valid and get the user id from it
      decoded = await jwt.verify(token, jwtSecret);

    } catch {

      ctx.throw(new NotAuthenticatedError());

    }

    // Find the appropriate user attached to the token if the token is valid
    const foundToken = await Token.query()
      .tokenWithUserGraphIfValid(token);

    if (!foundToken) {

      ctx.throw(new NotAuthenticatedError());

    }

    // Attach the found user and current token to the response
    ctx.authenticated = {
      user: foundToken.user, token
    };

  } catch (error) {

    ctx.throw(error);

  }

  await next();

};
