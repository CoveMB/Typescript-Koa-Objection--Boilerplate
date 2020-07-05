import { ConfigError } from 'config/errors/error.types';
import Knex from 'knex';
import getKnexConfig from '../../knexfile';

const connect = (): () => Promise<Knex> => {

  const knexConfig = getKnexConfig();

  return async () => {

    try {

      // Connect knex to db
      const knex = Knex(knexConfig);

      // This little query make sure the connection is established
      await knex.select(knex.raw('1'));

      return knex;

    } catch (error) {

      throw new ConfigError(`Could not connect to the db, ${error}`);

    }

  };

};

const connectDB = connect();

export default connectDB;
