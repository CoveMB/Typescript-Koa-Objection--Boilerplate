import configServer from 'config/server';
import requestSetUp from 'supertest';
import { NotAuthenticatedError } from 'config/errors/error.types';
import { getFreshToken } from './fixtures/helper';
import { setUpDb, tearDownDb } from './fixtures/setup';

const server = configServer();
const request = requestSetUp(server.callback());

// Setup
beforeAll(setUpDb);
afterAll(tearDownDb);

test('Should only be able to make a post request to graphql endpoint', async () => {

  // Get fresh token
  const { token } = await getFreshToken(request);

  const query = `
    query {
        users(orderBy: id) {
          id
          email
          
          tokens {
            id
            token
          }
      
        }
    }`;

  // Access profile page sending the token
  const response = await request.get('/api/v1/graphql')
    .send({
      query
    })
    .set('Authorization', `Bearer ${token}`);

  //  Not authorized GET action
  expect(response.status).toBe(405);

});

test('Should be authenticated to make requests to graphql endpoint', async () => {

  const query = `
    query {
        users(orderBy: id) {
          id
          email
          
          tokens {
            id
            token
          }
      
        }
    }`;

  // Access profile page sending the token
  const response = await request.post('/api/v1/graphql')
    .send({
      query
    });

  //  Not authorized action
  expect(response.status).toBe(401);

  //  Not authorized error name
  expect(response.body.error).toBe(new NotAuthenticatedError().name);

});

test('Should only be able to query data related to authenticated user', async () => {

  // Get fresh token and related user from db
  const { token, user } = await getFreshToken(request);

  // Query all users and all tokens
  const query = `
    query {
        users(orderBy: id) {
          email
        }

        tokens(orderBy: id) {
          token
          device
          user {
            email
          }
        }
    }`;

  // Access profile page sending the token
  const response = await request.post('/api/v1/graphql')
    .send({
      query
    })
    .set('Authorization', `Bearer ${token}`);

  const responseData = response.body.data;

  // Make sure all the tokens return are only from the authenticated user
  const allTokenAreFromAuthenticatedUser = responseData.tokens.every(tokenFromGraphQl => tokenFromGraphQl.user.email === user.email);

  expect(responseData.users.length).toBe(1);
  expect(responseData.users[0].email).toBe(user.email);
  expect(allTokenAreFromAuthenticatedUser).toBe(true);

});
