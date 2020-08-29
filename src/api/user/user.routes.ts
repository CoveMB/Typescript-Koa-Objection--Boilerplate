import { authenticated } from 'globalMiddlewares';
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
      controller.getProfile as unknown as Middleware
    )
    .get(
      '/:uuid',
      access.isSelfOrAdmin as Middleware,
      records.getByIdRecords as Middleware,
      controller.getOne as unknown as Middleware
    )
    .get(
      '/',
      access.isSelfOrAdmin as Middleware,
      records.getAllRecords as Middleware,
      controller.getAll as unknown as Middleware
    )
    .post(
      '/',
      requests.createUpdateSchema as Middleware,
      controller.createOne as Middleware
    )
    .patch(
      '/:uuid',
      requests.createUpdateSchema as Middleware,
      access.isSelfOrAdmin as Middleware,
      records.getByIdRecords as Middleware,
      controller.updateOne as unknown as Middleware
    )
    .delete(
      '/:uuid',
      access.isSelfOrAdmin as Middleware,
      records.getByIdRecords as Middleware,
      controller.deleteOne as unknown as Middleware
    );

  return router.routes();

};
