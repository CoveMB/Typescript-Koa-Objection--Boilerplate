const controller = require('./user.controller');
const { authenticated, validateRequest } = require('globalMiddlewares');
const requests = require('./middlewares/user.requests');
const access = require('./middlewares/user.access');
const records = require('./middlewares/user.records');

module.exports = Router => {

  const router = new Router({
    prefix: '/users',
  });

  router
    .get(
      '/profile',
      authenticated,
      controller.getProfile
    )
    .get(
      '/:uuid',
      authenticated,
      access.isSelfOrAdmin,
      records.getByIdRecords,
      controller.getOne
    )
    .get(
      '/',
      authenticated,
      access.isSelfOrAdmin,
      records.getAllRecords,
      controller.getAll
    )
    .post(
      '/',
      validateRequest(requests.createUpdateSchema, 'body'),
      controller.createOne
    )
    .patch(
      '/:uuid',
      validateRequest(requests.createUpdateSchema, 'body'),
      authenticated,
      access.isSelfOrAdmin,
      records.getByIdRecords,
      controller.updateOne
    )
    .delete(
      '/:uuid',
      authenticated,
      access.isSelfOrAdmin,
      records.getByIdRecords,
      controller.deleteOne
    );

  return router;

};
