import { Model } from 'objection';
import Knex from 'knex';
import { User } from 'models';
import getKnexConfig from '../../knexfile';
import { getUserData } from './helper';

const knexConfig = getKnexConfig('test');
const knex = Knex(knexConfig);

const setUpDb = async (): Promise<void> => {

  await knex.migrate.latest();
  Model.knex(knex);

  const { credentials } = getUserData();

  await User.query().insert(credentials);

};

const tearDownDb = async (done: () => void): Promise<void> => {

  await knex.migrate.rollback();
  await knex.destroy();
  done();

};

export {
  setUpDb,
  tearDownDb
};
