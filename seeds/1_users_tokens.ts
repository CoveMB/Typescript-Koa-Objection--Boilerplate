/* eslint-disable import/no-extraneous-dependencies */
// bcrypt is included in the objection-password package
import bcrypt from 'bcrypt';
import { ConfigError } from 'config/errors/error.types';
import * as Knex from 'knex';

const {
  ADMIN_TOKEN,
  USER_TOKEN,
} = process.env;

// Set up your initial password in an env
if (!process.env.INITIAL_PASSWORD) throw new ConfigError('You need to set up initial password in an env');
const password = bcrypt.hashSync(process.env.INITIAL_PASSWORD, 12);

export async function seed(knex: Knex): Promise<void> {

  // Deletes ALL existing entries
  return knex('user').del()

  // You need to set your jwt token before
  // Inserts seed entries
    .then(() => knex('user').insert([
      {
        email: 'admin@email.com',
        admin: false,
        password
      },
      {
        email: 'user@email.com',
        admin: false,
        password
      },
    ]))
    .then(() => knex('token').del())

    // Inserts seed entries
    .then(() => knex('token').insert([
      {
        token  : ADMIN_TOKEN,
        user_id: 1
      },
      {
        token  : USER_TOKEN,
        user_id: 2
      }
    ]));

}
