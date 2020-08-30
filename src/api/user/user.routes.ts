import { Middleware } from 'koa';
import Router from 'koa-router';
import * as access from './middlewares/user.access';
import * as records from './middlewares/user.records';
import * as requests from './middlewares/user.requests';
import * as controller from './user.controller';

export const userSubRouter = () => {

  const router = new Router({
    prefix: '/users',
  });

  router
    .get(
      '/profile',
      controller.getProfile as Middleware
    )
    .get(
      '/:uuid',
      access.isSelfOrAdmin as Middleware,
      records.getByIdRecords as Middleware,
      controller.getOne as Middleware
    )
    .get(
      '/',
      access.isSelfOrAdmin as Middleware,
      records.getAllRecords as Middleware,
      controller.getAll as Middleware
    )
    .post(
      '/',
      requests.createUpdateSchema as Middleware,
      controller.createOne as unknown as Middleware
    )
    .patch(
      '/:uuid',
      requests.createUpdateSchema as Middleware,
      access.isSelfOrAdmin as Middleware,
      records.getByIdRecords as Middleware,
      controller.updateOne as Middleware
    )
    .delete(
      '/:uuid',
      access.isSelfOrAdmin as Middleware,
      records.getByIdRecords as Middleware,
      controller.deleteOne as Middleware
    );

  return router.routes();

};
