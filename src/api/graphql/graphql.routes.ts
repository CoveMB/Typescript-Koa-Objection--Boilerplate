import { authenticated } from 'globalMiddlewares';
import KoaRouter from 'koa-router';
import { Constructable } from 'types/global';
import { Middleware } from 'koa';
import * as requests from './middlewares/graphql.requests';
import * as controller from './graphql.controller';

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
