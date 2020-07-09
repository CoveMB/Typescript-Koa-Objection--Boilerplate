import appRoot from 'app-root-path';
import winston from 'winston';
import Sentry from 'winston-sentry-log';
import { isDevelopment, sentryDNS, sentryEnv } from './variables';

// Base logger
const logger = winston.createLogger({
  level      : 'info',
  format     : winston.format.json(),
  defaultMeta: { service: 'api-service' },
});

// Log to the console
logger.add(new winston.transports.Console({
  format: winston.format.simple(),
  level : 'debug'
}));

if (!isDevelopment) {

  // Write to all logs with level `info` and below to `error.log`
  logger.add(new winston.transports.File({
    filename: `${appRoot}/logs/error.log`,
    level   : 'error'
  }));

  // Send errors to Sentry
  logger.add(new Sentry({
    config: {
      dsn        : sentryDNS,
      environment: sentryEnv
    },
    name : 'sentry',
    level: 'error'
  }));

}

export default logger;
