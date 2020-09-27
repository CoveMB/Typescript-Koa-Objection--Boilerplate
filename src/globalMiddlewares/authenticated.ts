import { NotAuthorizeError } from 'config/errors/error.types';
import { StatefulMiddleware } from 'types';

// Makes sure request are authenticated
const authenticated: StatefulMiddleware = async (ctx, next) => {

  try {

    // Make sure a user is carried in the authenticated state
    if (!ctx.state.authenticated.user) throw new NotAuthorizeError();

  } catch (error) {

    ctx.throw(NotAuthorizeError);

  }

  await next();

};

export default authenticated;
