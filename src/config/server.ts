import { errorEvent, errorHandler } from 'config/errors/error.event';
import {
  cors, csrf, error, log, session, throttleLimit, verifyAuthToken
} from 'globalMiddlewares';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import compress from 'koa-compress';
import helmet from 'koa-helmet';
import { userAgent } from 'koa-useragent';
import registerRouters from 'api';
import { csrfSecret } from './variables';

const configServer = (): Koa => {

  /**
   * Create app
  */
  const app = new Koa();

  // Keys to be used to encrypt cookies
  app.keys = [ csrfSecret as string ];

  /**
   * Register global middlewares
  */

  app

    // Provides security headers
    .use(helmet())

    // Handle trowed errors
    .use(error)

    // Configure cors
    .use(cors)

    // Throttle policy to prevent brute force attacks
    .use(throttleLimit)

    // Verify the validity of auth token
    .use(verifyAuthToken)

    // Attach user agent to the context
    .use(userAgent)

    // Parse the body request
    .use(bodyParser())

    // Log every logRequests
    .use(log)

    // Allow compress
    .use(compress())

    // Set up sessions tokens sent only through http
    .use(session(app))

    // Set up CSRF token to prevent attacks
    // it rely on sessions Middleware
    .use(csrf);

  /**
   * Register events
  */
  app.on(errorEvent, errorHandler);

  /**
   * Apply global router
  */
  registerRouters(app);

  return app;

};

export default configServer;
