import { authenticated } from 'globalMiddlewares';
import { Middleware } from 'koa';
import Router from 'koa-router';
import * as controller from './graphql.controller';
import * as requests from './middlewares/graphql.requests';

export const graphqlSubRouter = () => {

  const router = new Router({
    prefix: '/graphql',
  });

  router
    .post(
      '/',
      authenticated as Middleware,
      requests.query as Middleware,
      controller.graphql as Middleware
    );

  return router.routes();

};
