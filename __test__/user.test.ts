import { ValidationError } from 'config/errors/error.types';
import configServer from 'config/server';
import { User } from 'models';
import requestSetUp from 'supertest';
import { getFreshToken, getUserData } from './fixtures/helper';
import { setUpDb, tearDownDb } from './fixtures/setup';

const server = configServer();
const request = requestSetUp(server.callback());

beforeAll(setUpDb);
afterAll(tearDownDb);

test('Should sign up new user, sending new token by email', async () => {

  const newUser = {
    email: 'nezuser@email.com', password: 'P@ssword2000'
  };

  // Create user
  const response = await request
    .post('/api/v1/users')
    .send(newUser);

  // Query the new user
  const newUserDB = await User.query()
    .findOne({ email: newUser.email })
    .withGraphFetched('tokens(orderByCreation)');

  // Get the expiration date of last generated token
  const now = new Date();
  const tokenExpiration = new Date(newUserDB.tokens[0].expiration);

  expect(response.status).toBe(201);
  expect(response.body).toEqual({ status: 'success' });

  // New user should exist in db
  expect(newUserDB).not.toBeUndefined();

  // The newt user should have one new token
  expect(newUserDB.tokens.length).toBe(1);

  // The expiration date of new token should be in an hour
  expect(tokenExpiration.getHours()).toBeLessThanOrEqual(now.getHours() + 1);

});

test('Should update user', async () => {

  const newUser = {
    email: 'nezuser2@email.com', password: 'P@ssword2000'
  };

  // Create user
  await request
    .post('/api/v1/users')
    .send(newUser);

  // Query the new user
  const {
    tokens, id, email, uuid
  } = await User.query()
    .findOne({ email: newUser.email })
    .withGraphFetched('tokens(orderByCreation)');

  // Request a user update with the fresh token
  const response = await request
    .patch(`/api/v1/users/${uuid}`)
    .send({
      email: `changed${email}`
    })
    .set('Authorization', `Bearer ${tokens[0].token}`);

  // Query the updated user
  const updatedUser = await User.query()
    .findOne({ id });

  expect(response.status).toBe(200);

  // The email should be different
  expect(updatedUser.email).toBe(`changed${email}`);

});

test('Should not update user if invalid field is sent', async () => {

  const { id } = getUserData();

  // Get fresh token
  const token = await getFreshToken(request);

  // Send request with invalid field
  const response = await request
    .patch(`/api/v1/users/${id}`)
    .send({
      'favorite-color': 'purple'
    })
    .set('Authorization', `Bearer ${token}`);

  // A validation error is triggered
  expect(response.status).toBe(422);
  expect(response.body.error).toBe(new ValidationError().name);

});

test('Should delete user', async () => {

  const newUser = {
    email: 'nezuser2@email.com', password: 'P@ssword2000'
  };

  // Create user
  await request
    .post('/api/v1/users')
    .send(newUser);

  // Query the new user
  const { id, tokens, uuid } = await User.query()
    .findOne({ email: newUser.email })
    .withGraphFetched('tokens(orderByCreation)');

  // Request user delete
  const response = await request
    .delete(`/api/v1/users/${uuid}`)
    .set('Authorization', `Bearer ${tokens[0].token}`);

  // Query user
  const deletedUser = await User.query()
    .findOne({ id });

  expect(response.status).toBe(200);

  // User should not been found in database
  expect(deletedUser).toBeUndefined();

});
