import { apiVersion } from 'config/variables';
import Koa from 'koa';
import Router from 'koa-router';
import { authSubRouter } from './auth/auth.routes';
import { graphqlSubRouter } from './graphql/graphql.routes';
import { userSubRouter } from './user/user.routes';

const registerRouters = (app: Koa): Koa => {

  const router = new Router({
    prefix: `/api/${apiVersion}`,
  });

  router.use(authSubRouter());
  router.use(graphqlSubRouter());
  router.use(userSubRouter());

  app
    .use(router.routes())
    .use(router.allowedMethods());

  return app;

};

export default registerRouters;
