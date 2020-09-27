import Koa, {
  DefaultState, Context, Middleware, ParameterizedContext
} from 'koa';
import { UserAgentContext } from 'koa-useragent';
import { User } from 'models';

// General Koa //

// Add global middlewares with context
type ContextWithGlobalMiddleware = Context & UserAgentContext;

// Define global Middleware
type AuthenticatedMiddleware<M = undefined> = {
  authenticated: {
    user: M,
    token: string
  }
};

// Define if custom default state
type StateWithGlobalMiddleware<M = DefaultState> = ParameterizedContext<
AuthenticatedMiddleware<User> & M
>;

type StateNotAuthWithGlobalMiddleware<M = DefaultState> = ParameterizedContext<
AuthenticatedMiddleware & M
>;

type AugmentedContextAndState<M> = ContextWithGlobalMiddleware &
StateWithGlobalMiddleware<M>;

type AugmentedNotAuthContextAndState<M> = ContextWithGlobalMiddleware &
StateNotAuthWithGlobalMiddleware<M>;

// Koa
type StatefulKoa = Koa<StateWithGlobalMiddleware, ContextWithGlobalMiddleware>;

// Middleware with state
type StatefulMiddleware<M = DefaultState> = Middleware<
AuthenticatedMiddleware<User> & M, ContextWithGlobalMiddleware
>;

type StatefulNotAuthMiddleware<M = DefaultState> = Middleware<AuthenticatedMiddleware &
M, ContextWithGlobalMiddleware
>;

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

// Custom contexts
type StatefulContext<
  M extends RequestSchema | RecordsSchema | DefaultState = DefaultState
> = AugmentedContextAndState<M>;

type StatefulNotAuthContext<
  M extends RequestSchema | RecordsSchema | DefaultState = DefaultState
> = AugmentedNotAuthContextAndState<M>;

// Possible states //

type WithUuid = {
  requestUuid: string
};

type WithBody<M> = {
  request: {
    body: M
  }
};
