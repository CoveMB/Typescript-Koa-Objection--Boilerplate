import { authenticated, validateRequest } from 'globalMiddlewares';
import * as controller from './user.controller';
import requests from './middlewares/user.requests';
import access from './middlewares/user.access';
import records from './middlewares/user.records';

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
