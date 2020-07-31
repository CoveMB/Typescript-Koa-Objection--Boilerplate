import { Middleware } from 'koa';
import Router from 'koa-router';
import * as controller from './graphql.controller';
import * as requests from './middlewares/graphql.requests';

const graphqlSubRouter = () => {

  const router = new Router({
    prefix: '/graphql',
  });

  router
    .post(
      '/',
      requests.query as Middleware,
      controller.graphql as Middleware
    );

  return router.routes();

};

export default graphqlSubRouter;
