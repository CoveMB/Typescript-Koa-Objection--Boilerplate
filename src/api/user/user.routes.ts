import { authenticated, validateRequest } from 'globalMiddlewares';
import * as controller from './user.controller';
import * as requests from './middlewares/user.requests';
import * as access from './middlewares/user.access';
import * as records from './middlewares/user.records';

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
