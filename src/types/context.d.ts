import { Context } from 'koa';
import { User } from 'models';

export interface AuthenticatedContext
  extends Context {
  authenticated: {
    user: User,
    token: string
  }
}
