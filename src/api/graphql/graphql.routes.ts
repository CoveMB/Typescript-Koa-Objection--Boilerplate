import { authenticated } from 'globalMiddlewares';
import { Middleware } from 'koa';
import KoaRouter from 'koa-router';
import { Constructable } from 'types';
import * as controller from './graphql.controller';
import * as requests from './middlewares/graphql.requests';

module.exports = (Router: Constructable<KoaRouter>) => {

  const router = new Router({
    prefix: '/graphql',
  });

  router
    .post(
      '/',
      requests.query as Middleware,
      authenticated as Middleware,
      controller.graphql as Middleware
    );

  return router;

};
