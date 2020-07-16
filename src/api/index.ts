import { apiVersion } from 'config/variables';
import Koa from 'koa';
import Router from 'koa-router';
import authRouter from './auth/auth.routes';
import graphqlRouter from './graphql/graphql.routes';
import userRouter from './user/user.routes';

const registerRouters = (app: Koa): Koa => {

  const router = new Router({
    prefix: `/api/${apiVersion}`,
  });

  router.use(authRouter());
  router.use(graphqlRouter());
  router.use(userRouter());

  app
    .use(router.routes())
    .use(router.allowedMethods());

  return app;

};

export default registerRouters;
