// const controller = require('./graphql.controller');
const { authenticated, validateRequest } = require('globalMiddlewares');
const requests = require('./middlewares/graphql.requests');
const controller = require('./graphql.controller');

module.exports = Router => {

  const router = new Router({
    prefix: '/graphql',
  });

  router
    .post(
      '/',
      validateRequest(requests.query, 'body'),
      authenticated,
      controller.graphql);

  return router;

};
