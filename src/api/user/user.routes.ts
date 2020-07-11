import { authenticated } from 'globalMiddlewares';
import KoaRouter from 'koa-router';
import { Constructable } from 'types/global';
import { Middleware } from 'koa';
import * as controller from './user.controller';
import * as requests from './middlewares/user.requests';
import * as access from './middlewares/user.access';
import * as records from './middlewares/user.records';

module.exports = (Router: Constructable<KoaRouter>) => {

  const router = new Router({
    prefix: '/users',
  });

  router
    .get(
      '/profile',
      authenticated as Middleware,
      controller.getProfile as unknown as Middleware
    )
    .get(
      '/:uuid',
      authenticated,
      access.isSelfOrAdmin as Middleware,
      records.getByIdRecords as Middleware,
      controller.getOne as unknown as Middleware
    )
    .get(
      '/',
      authenticated,
      access.isSelfOrAdmin as Middleware,
      records.getAllRecords as Middleware,
      controller.getAll as unknown as Middleware
    )
    .post(
      '/',
      requests.createUpdateSchema,
      controller.createOne as Middleware
    )
    .patch(
      '/:uuid',
      requests.createUpdateSchema,
      authenticated,
      access.isSelfOrAdmin as Middleware,
      records.getByIdRecords as Middleware,
      controller.updateOne as unknown as Middleware
    )
    .delete(
      '/:uuid',
      authenticated,
      access.isSelfOrAdmin as Middleware,
      records.getByIdRecords as Middleware,
      controller.deleteOne as unknown as Middleware
    );

  return router;

};
