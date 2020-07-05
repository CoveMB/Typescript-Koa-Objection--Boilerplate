const { Model } = require('objection');
const knexConfig = require('../../knexfile')('test');
const knex = require('knex')(knexConfig);
const { User } = require('models');
const { getUserData } = require('./helper');

const setUpDb = async () => {

  await knex.migrate.latest();
  await Model.knex(knex);

  const { credentials } = getUserData();

  await User.query().insert(credentials);

};

const tearDownDb = async done => {

  await knex.migrate.rollback();
  await knex.destroy();
  done();

};

module.exports = {
  setUpDb,
  tearDownDb
};
