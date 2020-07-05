const requests = require('./middlewares/auth.requests');
const { authenticated, validateRequest } = require('globalMiddlewares');
const records = require('./middlewares/auth.records');
const controller = require('./auth.controller');

module.exports = Router => {

  const router = new Router();

  router
    .post(
      '/login',
      validateRequest(requests.loginSchema, 'body'),
      records.loginRecords,
      controller.logIn
    )
    .post(
      '/logout',
      validateRequest(requests.logoutSchema, 'body'),
      authenticated,
      controller.logOut
    )
    .post(
      '/logoutAll',
      validateRequest(requests.logoutAllSchema, 'body'),
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
      validateRequest(requests.requestResetPasswordSchema, 'body'),
      records.requestResetPasswordRecords,
      controller.requestResetPassword
    )
    .post(
      '/set-password',
      validateRequest(requests.setPasswordSchema, 'body'),
      authenticated,
      controller.setPassword
    );

  return router;

};
