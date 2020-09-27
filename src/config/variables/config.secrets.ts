import joi from 'joi';
import { ConfigError } from 'config/errors/error.types';
import { Secret } from 'jsonwebtoken';

/**
 * Generate a validation schema using joi to check the type of your environment variables
 */
const envSchema = joi
  .object({
    JWT_SECRET     : joi.string().required(),
    CSRF_SECRET    : joi.string().required(),
    ENCRYPTION_KEY : joi.string().required(),
    SENDGRID_SECRET: joi.string().required(),
    EMAIL_FROM     : joi.string()
      .allow('')
      .optional(),
    SENTRY_DNS: joi.string().uri()
      .allow('')
      .required(),
    SENTRY_ENVIRONMENT: joi.string()
      .allow('')
      .optional()
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

export const jwtSecret: Secret = envVars.JWT_SECRET;
export const csrfSecret: string = envVars.CSRF_SECRET;
export const encryptionKey: string = envVars.ENCRYPTION_KEY;
export const sendGridSecret: string = envVars.SENDGRID_SECRET;
export const sentryDNS: string = envVars.SENTRY_DNS;
export const sentryEnv: string = envVars.SENTRY_ENVIRONMENT;
export const emailFrom: string = envVars.EMAIL_FROM;
