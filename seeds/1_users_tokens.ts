// bcrypt is included in the objection-password package
import bcrypt from 'bcrypt';
import * as Knex from 'knex';

const {
  ADMIN_TOKEN,
  USER_TOKEN,
} = process.env;

const password = bcrypt.hashSync(process.env.INITIAL_PASSWORD, 12);

export async function seed(knex: Knex): Promise<any> {

  // Deletes ALL existing entries
  return knex('user').del()
    .then(() =>

    // You need to set your jwt token before
      // Inserts seed entries
      knex('user').insert([
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
    .then(() =>

    // Inserts seed entries
      knex('token').insert([
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
