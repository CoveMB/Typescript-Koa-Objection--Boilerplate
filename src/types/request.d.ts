import { Context, ParameterizedContext } from 'koa';
import { User } from 'models';

export interface AuthenticatedContext
  extends Context {
  authenticated: {
    user: User,
    token: string
  }
}

export interface AuthenticatedContextWithUuid
  extends AuthenticatedContext {
  requestUuid: string
}

// GraphQL context
interface GraphqlWithRequestContext extends AuthenticatedContext {
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

export interface UserRecordsContext extends Context {
  records: {
    user?: User,
    users?: User[]
  }
}

// Auth context
interface AuthValidatedRequestContext
  extends Context {
  validatedRequest: {
    email: string,
    password: string,
    token?: string
  }
}

export interface AuthRecordsAndRequestContext
  extends ParameterizedContext {
  records?: {
    user?: User
  }
}
