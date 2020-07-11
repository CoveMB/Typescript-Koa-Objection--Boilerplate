import logger from 'config/logger';
import { getFullDate } from 'utils';
import { sanitizeExposedBody } from 'utils/sanitizer';
import { Context, Next, Middleware } from 'koa';

const log: Middleware = async (ctx: Context, next: Next): Promise<void> => {

  logger.info(`${getFullDate()} | ${ctx.method} | ${ctx.path} | ${sanitizeExposedBody(ctx.request.body)} |`);

  await next();

};

export default log;
