import Koa, {
  DefaultState, Context, Middleware, ParameterizedContext
} from 'koa';
import { User } from 'models';
import { UserAgentContext } from 'koa-useragent';

// General Koa //

// Add middleware with context
type ContextWithGlobalMiddleware = Context & UserAgentContext;

// Define if custom default state
type StateWithGlobalMiddleware<M = DefaultState> = ParameterizedContext<AuthenticatedMiddleware & M>;

type AugmentedContextAndState<M> = ContextWithGlobalMiddleware & StateWithGlobalMiddleware<M>;

// Koa
type StatefulKoa = Koa<StateWithGlobalMiddleware, ContextWithGlobalMiddleware>;

// Define global Middleware
type AuthenticatedMiddleware = {
  authenticated: {
    user: User,
    token: string
  }
};

// Middleware with state
type StatefulMiddleware<M = DefaultState> = Middleware<AuthenticatedMiddleware & M, ContextWithGlobalMiddleware>;

// Custom contexts
type StatefulContext<
  M extends RequestSchema | RecordsSchema | DefaultState = DefaultState
> = AugmentedContextAndState<M>;

// Possible states //

type WithUuid = {
  requestUuid: string
};

type WithBody<M> = {
  request: {
    body: M
  }
};

type RecordsSchema<
  M extends Record<string, unknown> = Record<string, unknown>
> = {
  records: M
};

type RequestSchema<
  M extends Record<string, unknown> = Record<string, unknown>
> = {
  validatedRequest: M
};
