import { apiVersion } from 'config/variables';
import Router from 'koa-router';
import { StatefulKoa } from 'types';
import { authSubRouter } from './auth/auth.routes';
import { graphqlSubRouter } from './graphql/graphql.routes';
import { userSubRouter } from './user/user.routes';

const registerRouters = (app: StatefulKoa): StatefulKoa => {

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
