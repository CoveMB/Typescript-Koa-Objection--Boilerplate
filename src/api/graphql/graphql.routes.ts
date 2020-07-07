import { authenticated, validateRequest } from 'globalMiddlewares';
import * as requests from './middlewares/graphql.requests';
import * as controller from './graphql.controller';

module.exports = Router => {

  const router = new Router({
    prefix: '/graphql',
  });

  router
    .post(
      '/',
      validateRequest(requests.query, 'body'),
      authenticated,
      controller.graphql
    );

  return router;

};
