import cors from '@koa/cors';
import corsOptions from 'config/cors';
import { errorEvent, errorHandler } from 'config/errors/error.event';
import { error, log } from 'globalMiddlewares';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import compress from 'koa-compress';
import helmet from 'koa-helmet';
import { userAgent } from 'koa-useragent';
import registerRouters from 'api';

const configServer = () => {

  /**
   * Create app
  */
  const app = new Koa();

  /**
   * Register global middlewares
  */

  app.use(helmet())            // Provides security headers
    .use(cors(corsOptions))    // Configure cors
    .use(userAgent)            // Attach user agent to the context
    .use(bodyParser())         // Parse the body request
    .use(log)                  // Log every logRequests
    .use(error)                // Handle trowed errors
    .use(compress());          // Allow compress

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
