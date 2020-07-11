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

// GraphQL context
type GraphqlWithRequest = {
  validatedRequest: {
    query: string
  }
};

// User context
type UserValidatedRequest = {
  validatedRequest: {
    email: string
    password: string
  }
};

type UserRecords = {
  records: {
    user: User,
    users: User[]
  }
};

// Auth context
type AuthValidatedRequest = {
  validatedRequest: {
    email: string,
    password: string,
    token: string
  }
};

type AuthRecords = {
  records: {
    user: User
  }
};
