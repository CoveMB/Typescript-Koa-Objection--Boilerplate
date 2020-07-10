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

// GraphQL context
interface GraphqlWithRequestContext extends Context {
  validatedRequest: {
    query: string
  }
}

// User context
interface UserValidatedRequest {
  validatedRequest?: {
    email: string
    password: string
  }
}

export interface UserRecordsAndRequestContext
  extends AuthenticatedContextWithParams, UserValidatedRequest {
  records: {
    user?: User,
    users?: User[]
  }
}
