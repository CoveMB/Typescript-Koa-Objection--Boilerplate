import logger from 'config/logger';
import { Context, Next } from 'koa';
import { getFullDate, sanitizeExposedBody } from 'utils';

const log = async (ctx: Context, next: Next): Promise<void> => {

  logger.info(`${getFullDate()} | ${ctx.method} | ${ctx.path} | ${sanitizeExposedBody(ctx.request.body)} |`);

  await next();

};

export default log;
