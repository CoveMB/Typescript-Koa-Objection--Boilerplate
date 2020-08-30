import { NotAuthorizeError } from 'config/errors/error.types';
import { StatefulMiddleware } from 'types';

export const isSelfOrAdmin: StatefulMiddleware = async (ctx, next) => {

  try {

    const { params, state: { authenticated: { user } } } = ctx;

    if (user.uuid === params.uuid || user.admin) {

      ctx.state.requestUuid = params.uuid;

    } else {

      throw new NotAuthorizeError();

    }

  } catch (error) {

    ctx.throw(error);

  }

  await next();

};
