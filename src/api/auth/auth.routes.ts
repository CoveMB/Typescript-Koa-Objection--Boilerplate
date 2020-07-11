import { authenticated } from 'globalMiddlewares';
import KoaRouter from 'koa-router';
import { Constructable } from 'types/global';
import { Middleware } from 'koa';
import * as requests from './middlewares/auth.requests';
import * as records from './middlewares/auth.records';
import * as controller from './auth.controller';

// as unknown is needed because of the missing next paramter in controller

module.exports = (Router: Constructable<KoaRouter>) => {

  const router = new Router();

  router
    .post(
      '/login',
      requests.loginSchema as Middleware,
      records.loginRecords as Middleware,
      controller.logIn as unknown as Middleware
    )
    .post(
      '/logout',
      requests.logoutSchema as Middleware,
      authenticated as Middleware,
      controller.logOut as unknown as Middleware
    )
    .post(
      '/logout-all',
      requests.logoutAllSchema as Middleware,
      authenticated as Middleware,
      controller.logOutAll as unknown as Middleware
    )
    .post(
      '/check-token',
      authenticated as Middleware,
      controller.checkToken as Middleware
    )
    .post(
      '/request-password-reset',
      requests.requestResetPasswordSchema as Middleware,
      records.requestResetPasswordRecords as Middleware,
      controller.requestResetPassword as unknown as Middleware
    )
    .post(
      '/set-password',
      requests.setPasswordSchema as Middleware,
      authenticated as Middleware,
      controller.setPassword as unknown as Middleware
    );

  return router;

};
