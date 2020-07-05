const logger = require('config/logger');
const { getFullDate } = require('utils');
const { sanitizeExposedBody } = require('utils/sanitizer');

exports.log = async(ctx, next) => {

  logger.info(`${getFullDate()} | ${ctx.method} | ${ctx.path} | ${sanitizeExposedBody(ctx.request.body)} |`);

  await next();

};
