import cors from '@koa/cors';
import corsOptions from 'config/cors';
import { errorEvent, errorHandler } from 'config/errors/error.event';
import { error, log, authenticated } from 'globalMiddlewares';
import Koa, { DefaultState } from 'koa';
import bodyParser from 'koa-bodyparser';
import compress from 'koa-compress';
import helmet from 'koa-helmet';
import { userAgent } from 'koa-useragent';
import registerRouters from 'api';
import { ContextWithGlobalMiddleware, StatefulKoa } from 'types';

const configServer = (): StatefulKoa => {

  /**
   * Create app
  */
  const app = new Koa<DefaultState, ContextWithGlobalMiddleware>();

  /**
   * Register global middlewares
  */

  app.use(helmet())            // Provides security headers
    .use(cors(corsOptions))    // Configure cors
    .use(userAgent)            // Attach user agent to the context
    .use(bodyParser())         // Parse the body request
    .use(log)                  // Log every logRequests
    .use(error)                // Handle trowed errors
    .use(compress())           // Allow compress
    .use(authenticated);       // Makes sure every request are authenticated

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
