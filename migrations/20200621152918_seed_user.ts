
import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {

  return knex.seed.run({ specific: '1_users_tokens.js' });

}

export async function down(knex: Knex): Promise<any> {

  return knex('token').truncate()
    .then(() => {

      knex('user').truncate();

    });

}
