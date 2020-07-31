/* eslint-disable import/first */
import { addPath } from 'app-module-path';

addPath('/node/app/src');
import connectDB from 'config/database';
import { Model } from 'objection';

const setup = async (): Promise<void> => {

  /**
    * Connect database
    * It's important that the database is initialized first
    * to bind the Objection's model to the knex instance
    */
  const knex = await connectDB();

  /**
   * Bind knex instance config with Objection's model
   */
  Model.knex(knex);

};

const tearDown = (): void => {

  process.exit();

};

const executeCommand: CommandExecuter = async command => {

  await setup();
  await command();
  tearDown();

};

export default executeCommand;
