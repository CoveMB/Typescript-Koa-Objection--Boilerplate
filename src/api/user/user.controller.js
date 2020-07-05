const { User, Token } = require('models');
const { sendConfirmationEmail } = require('models/User/Token/token.emails');

// The user the the parameter comes from the authenticated middleware
exports.getProfile = async ctx => {

  try {

    // The authenticated middleware attache the user that made the request to the context
    const { user } = ctx.authenticated;

    ctx.body = {
      status: 'success',
      user
    };

  } catch (error) {

    ctx.throw(error);

  }

};

// The id the the parameter comes from the isSelfOrAdmin middleware
exports.getOne = async ctx => {

  try {

    // The user has been fetch in the records middleware
    const { user } = ctx.records;

    // Send it
    ctx.body = {
      status: 'success', user
    };

  } catch (error) {

    ctx.throw(error);

  }

};

exports.getAll = async ctx => {

  try {

    // The users has been fetch in the records middleware
    const { users } = ctx.records;

    ctx.body = {
      status: 'success', users
    };

  } catch (error) {

    ctx.throw(error);

  }

};

exports.createOne = async ctx => {

  try {

    const { validatedRequest, userAgent } = ctx;

    // Create new user
    const user = await User.query().insert(validatedRequest);

    // Generate JWT token for the new user
    const temporary = true;
    const token = await Token.query()
      .generateAuthToken(user, userAgent, temporary);

    sendConfirmationEmail(ctx, user, token);

    // And send it back
    ctx.status = 201;
    ctx.body = {
      status: 'success'
    };

  } catch (error) {

    ctx.throw(error);

  }

};

// The id the the parameter comes from the isSelfOrAdmin middleware
exports.updateOne = async ctx => {

  try {

    // The user has been fetch in the records middleware
    const { validatedRequest } = ctx;
    const { user } = ctx.records;

    // Update the user
    const updatedUser = await user.$query()
      .patchAndFetch(validatedRequest);

    // And return it
    ctx.body = {
      status: 'success', user: updatedUser
    };

  } catch (error) {

    ctx.throw(error);

  }

};

// The id the the parameter comes from the isSelfOrAdmin middleware
exports.deleteOne = async ctx => {

  try {

    // Get user from records middleware
    const { user } = ctx.records;

    // Delete him/her
    await User.query().deleteById(user.id);

    ctx.body = {
      status: 'success'
    };

  } catch (error) {

    ctx.throw(error);

  }

};
