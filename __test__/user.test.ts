/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { NotAuthenticatedError, ValidationError } from 'config/errors/error.types';
import configServer from 'config/server';
import { User } from 'models';
import requestSetUp from 'supertest';
import { getCsrfAndSess, getFreshToken, getUserData } from './fixtures/helper';
import { resetUserDB, setUp, tearDownDb } from './fixtures/setup';

const server = configServer();
const request = requestSetUp(server.callback());

// Bind Knex and Objection with db
beforeAll(() => setUp(request));

// Reset the db with only the default User
beforeEach(resetUserDB);

// Rollback DB
afterAll(tearDownDb);

test('Canot access profile if not authenticated', async () => {

  // Get security tokens
  const { csrfToken, sessionCookies } = getCsrfAndSess();

  // Try to access one user
  const response = await request
    .get('/api/v1/users/1')
    .set('csrf-token', csrfToken)
    .set('Cookie', sessionCookies);

  //  Not authorized action
  expect(response.status).toBe(401);

  //  Not authorized error message
  expect(response.body.message).toBe('You need to be authenticated to perform this action');

  //  Not authorized error name
  expect(response.body.error).toBe(new NotAuthenticatedError().name);

});

test('Can access profile if authenticated', async () => {

  // Get security tokens
  const { csrfToken, sessionCookies } = getCsrfAndSess();

  // Get fresh token
  const { authCookies } = await getFreshToken(request);

  // Access profile page sending the token
  const response = await request
    .get('/api/v1/users/profile')
    .set('csrf-token', csrfToken)
    .set('Cookie', [ ...sessionCookies, ...authCookies ]);

  expect(response.status).toBe(200);

});

test('Should update user', async () => {

  // Get security tokens
  const { csrfToken, sessionCookies } = getCsrfAndSess();

  // Get fresh  token and user uuid
  const { user: { uuid, email, id }, authCookies } = await getFreshToken(request);

  // Request a user update with the fresh token
  const response = await request
    .patch(`/api/v1/users/${uuid}`)
    .set('csrf-token', csrfToken)
    .set('Cookie', [ ...sessionCookies, ...authCookies ])
    .send({
      email: `changed${email}`
    });

  // Query the updated user
  const updatedUser = await User.query()
    .findOne({ id });

  expect(response.status).toBe(200);

  // The email should be different
  expect(updatedUser.email).toBe(`changed${email}`);

});

test('Should not update user if invalid field is sent', async () => {

  // Get security tokens
  const { csrfToken, sessionCookies } = getCsrfAndSess();

  // Get fresh token
  const { authCookies } = await getFreshToken(request);
  const { id } = getUserData();

  // Send request with invalid field
  const response = await request
    .patch(`/api/v1/users/${id}`)
    .set('csrf-token', csrfToken)
    .set('Cookie', [ ...sessionCookies, ...authCookies ])
    .send({
      'favorite-color': 'purple'
    });

  // A validation error is triggered
  expect(response.status).toBe(422);
  expect(response.body.error).toBe(new ValidationError('').name);

});

test('Should delete user', async () => {

  // Get security tokens
  const { csrfToken, sessionCookies } = getCsrfAndSess();

  // Get fresh  token and user uuid
  const { user: { uuid, id }, authCookies } = await getFreshToken(request);

  // Request user delete
  const response = await request
    .delete(`/api/v1/users/${uuid}`)
    .set('csrf-token', csrfToken)
    .set('Cookie', [ ...sessionCookies, ...authCookies ]);

  // Query user
  const deletedUser = await User.query()
    .findOne({ id });

  expect(response.status).toBe(200);

  // User should not been found in database
  expect(deletedUser).toBeUndefined();

});
