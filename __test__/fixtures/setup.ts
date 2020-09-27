import { Model } from 'objection';
import Knex from 'knex';
import { User } from 'models';
import { SuperTest, Test } from 'supertest';
import getKnexConfig from '../../knexfile';
import { getNotAuthenticatedToken, getUserData, setCsrfAndSess } from './helper';

const knexConfig = getKnexConfig('test');
const knex = Knex(knexConfig);

const setUp = async (request: SuperTest<Test>): Promise<void> => {

  // Set up Knex and Objection binding
  await knex.migrate.latest();
  Model.knex(knex);

  const serviceConsumerToken = getNotAuthenticatedToken();

  // Make request to get csrf token and session cookie
  const response = await request
    .get('/api/v1/get-csrf')
    .set('Authorization', `Bearer ${serviceConsumerToken}`);

  setCsrfAndSess(response);

};

const resetUserDB = async (): Promise<void> => {

  await User.query().delete();

  // Create default user
  const { credentials } = getUserData();

  await User.query().insert(credentials);

};

const tearDownDb = async (done: () => void): Promise<void> => {

  await knex.migrate.rollback();
  await knex.destroy();
  done();

};

export {
  resetUserDB,
  setUp,
  tearDownDb
};
