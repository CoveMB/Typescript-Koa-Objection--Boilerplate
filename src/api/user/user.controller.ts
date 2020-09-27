import { User } from 'models';
import { StatefulMiddleware } from 'types';
import { UpdateUserRequest } from './middlewares/user.requests';
import { GetUserByIdRecords, GetAllUserRecords } from './middlewares/user.records';

// The user the the parameter comes from the authenticated middleware
export const getProfile: StatefulMiddleware<GetUserByIdRecords> = async ctx => {

  try {

    // The authenticated middleware attache the user that made the request to the context
    const { user } = ctx.state.authenticated;

    ctx.body = {
      status: 'success',
      user
    };

  } catch (error) {

    ctx.throw(error);

  }

};

// The id the the parameter comes from the isSelfOrAdmin middleware
export const getOne: StatefulMiddleware<GetUserByIdRecords> = async ctx => {

  try {

    // The user has been fetch in the records middleware
    const { user } = ctx.state.records;

    // Send it
    ctx.body = {
      status: 'success', user
    };

  } catch (error) {

    ctx.throw(error);

  }

};

export const getAll: StatefulMiddleware<GetAllUserRecords> = async ctx => {

  try {

    // The users has been fetch in the records middleware
    const { users } = ctx.state.records;

    ctx.body = {
      status: 'success', users
    };

  } catch (error) {

    ctx.throw(error);

  }

};

// The id the the parameter comes from the isSelfOrAdmin middleware
export const updateOne: StatefulMiddleware<
UpdateUserRequest & GetUserByIdRecords
> = async ctx => {

  try {

    // The user has been fetch in the records middleware
    const { validatedRequest, records: { user } } = ctx.state;

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
export const deleteOne: StatefulMiddleware<GetUserByIdRecords> = async ctx => {

  try {

    // Get user from records middleware
    const { user } = ctx.state.records;

    // Delete him/her
    await User.query().deleteById(user.id);

    ctx.body = {
      status: 'success'
    };

  } catch (error) {

    ctx.throw(error);

  }

};
