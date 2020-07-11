import { errorEvent } from 'config/errors/error.event';
import { ForeignKeyViolationError, ValidationError } from 'objection';
import { capitalize } from 'utils';
import { Next, Context, Middleware } from 'koa';

const error: Middleware = async (ctx: Context, next: Next): Promise<void> => {

  try {

    await next();

  } catch (err) {

    // Emit the error at the app level
    ctx.app.emit(errorEvent, err, ctx);

    // Return errors from objection orm
    if (err instanceof ValidationError) {

      ctx.status = 400;
      ctx.body = {
        status: 'failed',
        error : 'ValidationError',
        errors: err.data,

        // Will construct a message concatenating all the Objection validation errors
        message: Object.keys(err.data).reduce((acc, validationErrors) => ` ${acc + err.data[validationErrors].reduce((_: string, validationError: Record<string, string>) => `${capitalize(validationError.message)}`, '')}`, '')
      };

      // Return errors from objection orm

    } else if (err instanceof ForeignKeyViolationError) {

      ctx.status = 409;
      ctx.body = {
        status: 'failed',
        error : 'ForeignKeyViolationError'
      };

    } else {

      // Return other errors
      ctx.status = err.status || 500;
      ctx.body = {
        status : 'failed',
        error  : err.expose ? err.name : 'ServerError',
        message: err.expose ? err.message : 'Internal server error',
      };

    }

  }

};

export default error;
