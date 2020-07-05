const appRoot = require('app-root-path');
const winston = require('winston');
const { isDevelopment, sentryDNS, sentryEnv } = require('./variables');
const Sentry = require('winston-sentry-log');

// Base logger
const logger = winston.createLogger({
  datePattern: 'yyyy-MM-dd.',
  level      : 'info',
  format     : winston.format.json(),
  colorize   : false,
  defaultMeta: { service: 'api-service' },
});

// Log to the console
logger.add(new winston.transports.Console({
  name    : 'console',
  format  : winston.format.simple(),
  colorize: true,
  level   : 'debug'
}));

if (!isDevelopment) {

  // Write to all logs with level `info` and below to `combined.log`
  logger.add(new winston.transports.File({
    name    : 'app.log',
    filename: `${appRoot}/logs/app.log`,
    level   : 'error'
  }));

  // Write all logs error (and below) to `error.log`.
  logger.add(new winston.transports.File({
    name: 'error.log', filename: `${appRoot}/logs/combined.log`
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

module.exports = logger;
