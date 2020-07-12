import { Context } from 'koa';
import { User } from 'models';

interface AuthenticatedContext
  extends Context {
  authenticated: {
    user: User,
    token: string
  }
}

type RequestWithUuid = {
  requestUuid: string
};

type WithValidatedRequest<M> = {
  validatedRequest: M
};

type WithRecords<M> = {
  records: M
};
