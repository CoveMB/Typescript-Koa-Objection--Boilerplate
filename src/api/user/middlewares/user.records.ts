import { User } from 'models';
import { validateFoundInstances } from 'models/model.utils';
import { StatefulMiddleware, WithUuid, RecordsSchema } from 'types';

// Get by Id
export type GetUserByIdRecords = RecordsSchema<{
  user: User
}>;

export const getByIdRecords: StatefulMiddleware<WithUuid> = async (ctx, next) => {

  try {

    const { requestUuid } = ctx.state;

    // Get the user
    const user = await User.query().findByUuid(requestUuid);

    validateFoundInstances([
      {
        instance: user, type: 'User', search: requestUuid
      }
    ]);

    ctx.state.records = { user };

  } catch (error) {

    ctx.throw(error);

  }

  await next();

};

// Get All Records
export type GetAllUserRecords = RecordsSchema<{
  users: User[]
}>;

export const getAllRecords: StatefulMiddleware =  async (ctx, next) => {

  try {

    // Get all the users
    const users = await User.query();

    ctx.state.records = { users };

  } catch (error) {

    ctx.throw(error);

  }

  await next();

};
