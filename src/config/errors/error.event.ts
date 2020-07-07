import logger from 'config/logger';
import { getFullDate } from 'utils';
import { sanitizeExposedBody } from 'utils/sanitizer';
import { Context } from 'koa';

const errorEvent = 'error';

const errorHandler = async (error: Error, ctx: Context): Promise<void> => {

  // Every error are logged
  logger.error(`${getFullDate()} | context:  ${ctx.method} ${ctx.path} ${sanitizeExposedBody(ctx.request.body)} | ${error.name} | ${error.message} | stack: ${error.stack} | `);

};

export { errorHandler, errorEvent };
