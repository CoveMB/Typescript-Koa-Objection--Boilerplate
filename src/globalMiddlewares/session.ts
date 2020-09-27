import { cookies, isProduction } from 'config/variables';
import Koa, { Middleware } from 'koa';
import session from 'koa-session';

export default (app: Koa): Middleware => session({
  key     : cookies.SessionCookieName,
  maxAge  : 9000,
  httpOnly: true,
  signed  : true,
  renew   : true,
  sameSite: 'lax',
  secure  : isProduction
}, app);
