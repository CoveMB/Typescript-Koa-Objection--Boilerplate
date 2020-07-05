import logger from 'config/logger';
import utils from 'utils';
import { sanitizeExposedBody } from 'utils/sanitizer';

const errorEvent = 'error';

const errorHandler = async(error, ctx) => {

  // Every error are logged
  logger.error(`${utils.getFullDate()} | context:  ${ctx.method} ${ctx.path} ${sanitizeExposedBody(ctx.request.body)} | ${error.name} | ${error.message} | stack: ${error.stack} | `);

};

export { errorHandler, errorEvent };
