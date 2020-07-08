import { NotAuthorizeError } from 'config/errors/error.types';
import { Context, Next } from 'koa';

export const isSelfOrAdmin = async (ctx: Context, next: Next): Promise<void> => {

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
