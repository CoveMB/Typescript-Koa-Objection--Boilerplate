import { User } from 'models';
import { validateFoundInstances } from 'models/model.utils';
import { Next, Context } from 'koa';
import { AuthenticatedContextWithParams } from 'types';

export const getByIdRecords = async (
  ctx: AuthenticatedContextWithParams,
  next: Next
): Promise<void> => {

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

export const getAllRecords =  async (
  ctx: AuthenticatedContextWithParams,
  next: Next
): Promise<void> => {

  try {

    // Get all the users
    const users = await User.query();

    ctx.records = { users };

  } catch (error) {

    ctx.throw(error);

  }

  await next();

};
