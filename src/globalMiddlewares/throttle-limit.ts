import rateLimit from 'koa-ratelimit';

// DB for the rate limit middleware
// You can replace it with a redis client
const db = new Map();

export default rateLimit({
  driver      : 'memory',
  db,
  duration    : 30000,
  errorMessage: 'You reached the rate limit',
  id          : (ctx) => ctx.ip,
  headers     : {
    remaining: 'Rate-Limit-Remaining',
    reset    : 'Rate-Limit-Reset',
    total    : 'Rate-Limit-Total'
  },
  max          : 60,
  disableHeader: false,
});
