/* eslint-disable import/first */
import { addPath } from 'app-module-path';

addPath(`${__dirname}/src`);

import { ConfigError } from 'config/errors/error.types';
import {
  dbHost, dbPort, dbUser, dbPassword, dbName
} from 'config/variables';

const getKnexConfig = (configType: 'production' | 'test' = 'production') => {

  if (configType === 'production') {

    return {
      client    : 'pg',
      connection: {
        host    : dbHost || 'localhost',
        port    : dbPort || 5432,
        user    : dbUser || 'postgres',
        password: dbPassword || undefined,
        database: dbName
      },
      migrations: {
        directory: 'migrations',
      },
      searchPath: [ 'knex', 'public' ],
    };

  }

  if (configType === 'test') {

    return {
      client    : 'pg',
      connection: {
        host    : dbHost || 'localhost',
        port    : dbPort || 5432,
        user    : dbUser || 'postgres',
        password: dbPassword || undefined,
        database: `${dbName}-test`
      },
      migrations: {
        directory: 'migrations',
      },
      searchPath: [ 'knex', 'public' ],
    };

  }

  throw new ConfigError('Please select a proper database config type');

};

module.exports = getKnexConfig;
export default getKnexConfig;
