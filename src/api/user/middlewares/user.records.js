const { User } = require('models');
const { validateFoundInstances } = require('models/model.utils');

exports.getByIdRecords = async(ctx, next) => {

  try {

    const { requestUuid } = ctx;

    // Get the user
    const user = await User.query().findByUuid(requestUuid);

    validateFoundInstances([
      {
        instance: user, type: 'User', search: requestUuid
      }
    ]);

    ctx.records = { user };

  } catch (error) {

    ctx.throw(error);

  }

  await next();

};

exports.getAllRecords = async(ctx, next) => {

  try {

    // Get all the users
    const users = await User.query();

    ctx.records = { users };

  } catch (error) {

    ctx.throw(error);

  }

  await next();

};
