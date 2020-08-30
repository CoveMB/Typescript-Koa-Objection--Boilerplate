import { Middleware } from 'koa';
import Router from 'koa-router';
import * as controller from './auth.controller';
import * as records from './middlewares/auth.records';
import * as requests from './middlewares/auth.requests';

export const authSubRouter = () => {

  const router = new Router();

  router
    .post(
      '/login',
      requests.loginSchema as Middleware,
      records.loginRecords as Middleware,
      controller.logIn as Middleware
    )
    .post(
      '/logout',
      requests.logoutSchema as Middleware,
      controller.logOut as Middleware
    )
    .post(
      '/logout-all',
      requests.logoutAllSchema as Middleware,
      controller.logOutAll as Middleware
    )
    .post(
      '/check-token',
      controller.checkToken as Middleware
    )
    .post(
      '/request-password-reset',
      requests.requestResetPasswordSchema as Middleware,
      records.requestResetPasswordRecords as Middleware,
      controller.requestResetPassword as Middleware
    )
    .post(
      '/set-password',
      requests.setPasswordSchema as Middleware,
      controller.setPassword as Middleware
    )
    .post(
      '/register-third-party',
      requests.registerThirdPartySchema as Middleware,
      records.registerThirdPartyRecords as Middleware,
      controller.registerThirdParty as Middleware

    );

  return router.routes();

};
