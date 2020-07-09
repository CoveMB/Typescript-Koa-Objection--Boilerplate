
import * as Knex from 'knex';

export async function up(knex: Knex): Promise<[string[]]> {

  return knex.seed.run({ specific: '1_users_tokens.ts' });

}

export async function down(knex: Knex): Promise<void> {

  return knex('token').truncate()
    .then(() => {

      knex('user').truncate();

    });

}
