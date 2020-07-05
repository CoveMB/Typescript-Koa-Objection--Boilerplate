import joi from '@hapi/joi';
import { ConfigError } from 'config/errors/error.types';

/**
 * Generate a validation schema using joi to check the type of your environment variables
 */
const envSchema = joi
  .object({
    JWT_SECRET     : joi.string().required(),
    SENDGRID_SECRET: joi.string().required(),
    EMAIL_FROM     : joi.string()
      .allow('')
      .optional(),
    SENTRY_DNS: joi.string().uri()
      .allow('')
      .required(),
    SENTRY_ENVIRONMENT: joi.string()
      .allow('')
      .optional(),
  })
  .unknown()
  .required();

/**
 * Validate the env variables using joi.validate()
 */
const { error, value: envVars } = envSchema.validate(process.env);

if (error) {

  throw new ConfigError(error.message);

}

export const jwtSecret = envVars.JWT_SECRET;
export const sendGridSecret = envVars.SENDGRID_SECRET;
export const sentryDNS = envVars.SENTRY_DNS;
export const sentryEnv = envVars.SENTRY_ENVIRONMENT;
export const emailFrom = envVars.EMAIL_FROM;
