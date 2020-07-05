
import { NotAuthenticatedError } from 'config/errors/error.types';
import configServer from 'config/server';
import { Token, User } from 'models';
import requestSetUp from 'supertest';
import { getFreshToken, getUserData } from './fixtures/helper';
import { setUpDb, tearDownDb } from './fixtures/setup';

const server = configServer();
const request = requestSetUp(server.callback());

// Setup
beforeAll(setUpDb);
afterAll(tearDownDb);

test('Should login user with correct authentication dont return plain password', async () => {

  const { credentials, email, password } = getUserData();

  // Logging request
  const response = await request
    .post('/api/v1/login')
    .send(credentials);

  const userDb = await User.query()
    .findOne({ email });

  // Response is ok
  expect(response.status).toBe(200);

  // The password has been encrypted
  expect(userDb.password).not.toBe(password);

  // The right user is returned
  expect(response.body.user.email).toBe(userDb.email);

});

test('Should generate fresh valid 6 month token on logging', async () => {

  const { credentials } = getUserData();

  // Logging request
  const response = await request
    .post('/api/v1/login')
    .send(credentials);

  // Get the generated token from database
  const token = await Token.query()
    .findOne({ token: response.body.token.token });

  // Get it's expiration date
  const now = new Date();

  // Mutate now to be 6 month from now
  now.setMonth(now.getMonth() + 6);

  const tokenExpiration = new Date(token.expiration);

  // The right token is return
  expect(response.body.token.token).toBe(token.token);

  //  Should be more than 6 mont valid
  expect(tokenExpiration.getMonth()).toBe(now.getMonth());

});

test('Should not login user with wrong password', async () => {

  const { email, password } = getUserData();

  // Logging attempt
  const response = await request
    .post('/api/v1/login')
    .send({
      email, password: `wong${password}`
    });

  //  Not authorized action
  expect(response.status).toBe(401);

  // No token is returned
  expect(response.body.token).toBeUndefined();

});

test('Canot access profile if not authenticated', async () => {

  // Try to access one user
  const response = await request.get('/api/v1/users/1');

  //  Not authorized action
  expect(response.status).toBe(401);

  //  Not authorized error message
  expect(response.body.message).toBe('You need to be authenticated to perform this action');

  //  Not authorized error name
  expect(response.body.error).toBe(new NotAuthenticatedError().name);

});

test('Can access profile if authenticated', async () => {

  // Get fresh token
  const { token } = await getFreshToken(request);

  // Access profile page sending the token
  const response = await request.get('/api/v1/users/profile')
    .set('Authorization', `Bearer ${token}`);

  expect(response.status).toBe(200);

});

test('Should logout user and revoke token', async () => {

  // Get fresh token
  const { token } = await getFreshToken(request);

  // Request logout
  const response = await request
    .post('/api/v1/logout')
    .send({
      token
    })
    .set('Authorization', `Bearer ${token}`);

  //  Query the token
  const tokenDb = await Token.query()
    .findOne({ token });

  expect(response.status).toBe(200);

  // The token should not be found in the db
  expect(tokenDb).toBeUndefined();

});

test('Should not be able to logout with revoked token', async () => {

  // Get fresh token
  const { token } = await getFreshToken(request);

  // Request logout
  await request
    .post('/api/v1/logout')
    .send({
      token
    })
    .set('Authorization', `Bearer ${token}`);

  // Request logout
  const secondLogout = await request
    .post('/api/v1/logout')
    .send({
      token
    })
    .set('Authorization', `Bearer ${token}`);

  // The token was already revoked
  expect(secondLogout.status).toBe(401);

});

test('Should revoke all tokens', async () => {

  // Get fresh token and it's associated user
  const { token, user } = await getFreshToken(request);

  // Request logout all
  const logoutResponse = await request
    .post('/api/v1/logoutAll')
    .set('Authorization', `Bearer ${token}`);

  // Query the user
  const dbUser = await User.query()
    .findOne({ email: user.email })
    .withGraphFetched('tokens');

  expect(logoutResponse.status).toBe(200);

  // The user does not have any more token
  expect(dbUser.tokens.length).toBe(0);

});

test('Should validate existing token', async () => {

  // Get fresh token
  const { token } = await getFreshToken(request);

  // Request to check the token validity
  const response = await request
    .post('/api/v1/check-token')
    .set('Authorization', `Bearer ${token}`);

  expect(response.status).toBe(200);

});

test('Should not validate revoked tokens', async () => {

  // Get fresh token
  const { token } = await getFreshToken(request);

  // Request logout (revoke token)
  await request
    .post('/api/v1/logout')
    .send({
      token
    })
    .set('Authorization', `Bearer ${token}`);

  // Request to check the token validity
  const response = await request
    .post('/api/v1/check-token')
    .set('Authorization', `Bearer ${token}`);

  // Not authorized action since the token was already revoked
  expect(response.status).toBe(401);

  //  Not authorized error message
  expect(response.body.message).toBe('You need to be authenticated to perform this action');

  //  Not authorized error name
  expect(response.body.error).toBe(new NotAuthenticatedError().name);

});

test('Should request a password reset generating a temporary 1h valid token', async () => {

  const { email } = getUserData();

  // Request a password reset
  const response = await request
    .post('/api/v1/request-password-reset')
    .send({
      email
    });

  // Query the user and it's token by order of creation
  const userDb = await User.query()
    .findOne({ email })
    .withGraphFetched('tokens(orderByCreation)');

  // Get expiration date of last token
  const now = new Date();

  // Mutate now to be 1 hour from now
  now.setHours(now.getHours() + 1);

  const tokenExpiration = new Date(userDb.tokens[0].expiration);

  expect(response.status).toBe(200);

  // No token should have been returned
  expect(response.body.token).toBeUndefined();

  // The expiration date should be in an hour
  expect(tokenExpiration.getHours()).toBeLessThanOrEqual(now.getHours());

});

test('Should reset the password of user and make it unable to log with old password', async () => {

  const { credentials, password, email } = getUserData();

  // Request a password reset
  await request
    .post('/api/v1/request-password-reset')
    .send({
      email
    });

  // Query the user and it's token by order of creation
  const userDb = await User.query()
    .findOne({ email })
    .withGraphFetched('tokens(orderByCreation)');

  // Actually reset the password with last token of the user
  const response = await request
    .post('/api/v1/set-password')
    .send({
      password: `${password}2`
    })
    .set('Authorization', `Bearer ${userDb.tokens[0].token}`);

  // Try login with old password
  const responseOldPassword = await request
    .post('/api/v1/login')
    .send(credentials);

  // Try login with new password
  const responseNewPassword = await request
    .post('/api/v1/login')
    .send({
      email, password: `${password}2`
    });

  expect(response.status).toBe(200);

  // Should be the right user
  expect(response.body.user.email).toBe(userDb.email);

  // Login with new password should work
  expect(responseNewPassword.status).toBe(200);

  // Login with old password should not
  expect(responseOldPassword.status).toBe(401);

});

test('Should reset the password and generate a fresh token and revoke all other tokens', async () => {

  const { credentials, password, email } = getUserData();

  // Create an extra token
  await request
    .post('/api/v1/login')
    .send(credentials);

  // Request a password reset
  await request
    .post('/api/v1/request-password-reset')
    .send({
      email
    });

  // Query the user and it's token by order of creation
  const userDb = await User.query()
    .findOne({ email })
    .withGraphFetched('tokens(orderByCreation)');

  // Actually reset the password with last token of the user
  const response = await request
    .post('/api/v1/set-password')
    .send({
      password: `${password}3`
    })
    .set('Authorization', `Bearer ${userDb.tokens[0].token}`);

  // Query the user and it's tokens by order of creation
  const userDbAfterReset = await User.query()
    .findOne({ email })
    .withGraphFetched('tokens(orderByCreation)');

  // Get it's expiration date
  const now = new Date();

  // Mutate now to be 6 month from now
  now.setMonth(now.getMonth() + 6);

  // Get the expiration date of last generated token
  const tokenExpiration = new Date(userDbAfterReset.tokens[0].expiration);

  // The body should contains the new token
  expect(response.body.token.token).toBe(userDbAfterReset.tokens[0].token);

  // The new token should be 6 month valid
  expect(tokenExpiration.getMonth()).toBe(now.getMonth());

  // All other tokens should has been revoked
  expect(userDbAfterReset.tokens.length).toBe(1);

});
