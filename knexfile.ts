/* eslint-disable import/first */
import { addPath } from 'app-module-path';

addPath(`${__dirname}/src`);

import { ConfigError } from 'config/errors/error.types';
import {
  dbHost, dbName, dbPassword, dbPort, dbUser, dbTestName
} from 'config/variables';
import { knexSnakeCaseMappers } from 'objection';
import { KnexConnectionConfig } from 'types';

const getKnexConfig = (configType: 'production' | 'test' = 'production'): KnexConnectionConfig => {

  if (configType === 'production') {

    return {
      client    : 'pg',
      connection: {
        host    : dbHost || 'localhost',
        port    : dbPort || 5432,
        user    : dbUser || 'postgres',
        password: dbPassword,
        database: dbName
      },
      pool: {
        min: 1, max: 1
      },
      searchPath: [ 'knex', 'public' ],
      ...knexSnakeCaseMappers()
    };

  }

  if (configType === 'test') {

    return {
      client    : 'pg',
      connection: {
        host    : dbHost || 'localhost',
        port    : dbPort || 5432,
        user    : dbUser || 'postgres',
        password: dbPassword,
        database: dbTestName
      },
      searchPath: [ 'knex', 'public' ],
      ...knexSnakeCaseMappers()
    };

  }

  throw new ConfigError('Please select a proper database config type');

};

module.exports = getKnexConfig;
export default getKnexConfig;
