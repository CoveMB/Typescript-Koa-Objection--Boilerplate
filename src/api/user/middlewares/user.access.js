const { NotAuthorizeError } = require('config/errors/error.types');

exports.isSelfOrAdmin = async(ctx, next) => {

  try {

    const { params, authenticated } = ctx;
    const { user } = authenticated;

    if (user.uuid === params.uuid || user.admin) {

      ctx.requestUuid = params.uuid;

    } else {

      throw new NotAuthorizeError();

    }

  } catch (error) {

    ctx.throw(error);

  }

  await next();

};
