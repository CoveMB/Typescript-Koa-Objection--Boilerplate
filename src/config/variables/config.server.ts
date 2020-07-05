import joi from '@hapi/joi';
import { ConfigError } from 'config/errors/error.types';

/**
 * Generate a validation schema using joi to check the type of your environment variables
 */
const envSchema = joi
  .object({
    NODE_ENV: joi.string().allow(
      'development',
      'production',
      'test'
    ),
    ROOT_URL   : joi.string(),
    CLIENT_URL : joi.string(),
    PORT       : joi.number(),
    API_VERSION: joi.number(),
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

export const appName = envVars.APP_NAME;
export const clientUrl = envVars.CLIENT_URL || 'http://localhost';
export const env = envVars.NODE_ENV;
export const isTest = envVars.NODE_ENV === 'test';
export const isDevelopment = envVars.NODE_ENV === 'development';
export const isProduction = envVars.NODE_ENV === 'production';
export const rootUrl = envVars.ROOT_URL || 'http://localhost';
export const port = envVars.PORT || 3000;
export const apiVersion = `v${envVars.API_VERSION}` || 'v1';
