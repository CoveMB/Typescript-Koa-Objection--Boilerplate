import { authenticated, validateRequest } from 'globalMiddlewares';
import KoaRouter from 'koa-router';
import { Constructable } from 'types/global';
import * as requests from './middlewares/auth.requests';
import * as records from './middlewares/auth.records';
import * as controller from './auth.controller';

module.exports = (Router: Constructable<KoaRouter>) => {

  const router = new Router();

  router
    .post(
      '/login',
      requests.loginSchema,
      records.loginRecords,
      controller.logIn
    )
    .post(
      '/logout',
      requests.logoutSchema,
      authenticated,
      controller.logOut
    )
    .post(
      '/logout-all',
      requests.logoutAllSchema,
      authenticated,
      controller.logOutAll
    )
    .post(
      '/check-token',
      authenticated,
      controller.checkToken
    )
    .post(
      '/request-password-reset',
      requests.requestResetPasswordSchema,
      records.requestResetPasswordRecords,
      controller.requestResetPassword
    )
    .post(
      '/set-password',
      requests.setPasswordSchema,
      authenticated,
      controller.setPassword
    );

  return router;

};
