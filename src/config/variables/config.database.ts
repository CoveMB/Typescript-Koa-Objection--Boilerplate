import joi from '@hapi/joi';
import { ConfigError } from 'config/errors/error.types';

/**
 * Generate a validation schema using joi to check the type of your environment variables
 */
const envSchema = joi
  .object({
    DB_USER    : joi.string(),
    DB_HOST    : joi.string(),
    DB_PASSWORD: joi
      .string()
      .optional()
      .empty(''),
    DB_NAME: joi.string(),
    DB_PORT: joi.number(),
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

export const dbName = envVars.DB_NAME;
export const dbHost = envVars.DB_HOST;
export const dbPort = envVars.DB_PORT;
export const dbUser = envVars.DB_USER;
export const dbPassword = envVars.DB_PASSWORD;
