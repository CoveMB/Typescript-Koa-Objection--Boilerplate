import { Context } from 'koa';
import { User } from 'models';

export interface AuthenticatedContext
  extends Context {
  authenticated: {
    user: User,
    token: string
  }
}

export interface AuthenticatedContextWithParams
  extends AuthenticatedContext {
  requestUuid: string
}

// User context
interface UserValidatedRequest {
  validatedRequest: {
    email: string
    password: string
  }
}

export interface ContextWithUserRecords
  extends AuthenticatedContextWithParams {
  validatedRequest?: {
    email: string
    password: string
  }
  records: {
    user?: User,
    users?: User[]
  }
}
