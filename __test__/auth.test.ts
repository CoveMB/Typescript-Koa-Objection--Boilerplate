/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { NotAuthenticatedError } from 'config/errors/error.types';
import configServer from 'config/server';
import { cookies } from 'config/variables';
import { Token, User } from 'models';
import requestSetUp from 'supertest';
import {
  getCookiesFromHeaders,
  getCsrfAndSess, getFreshToken, getNotAuthenticatedToken, getTokenFromAuthCookies, getUserData
} from './fixtures/helper';
import { resetUserDB, setUp, tearDownDb } from './fixtures/setup';

const server = configServer();
const request = requestSetUp(server.callback());

// Bind Knex and Objection with db
beforeAll(() => setUp(request));

// Reset the db with only the default User
beforeEach(resetUserDB);

// Rollback DB
afterAll(tearDownDb);

test('Should sign up new user, sending new token by email', async () => {

  const serviceConsumerToken = getNotAuthenticatedToken();
  const { csrfToken, sessionCookies } = getCsrfAndSess();
  const newUser = { email: 'newuser@email.com' };

  // Create user
  const response = await request
    .post('/api/v1/register')
    .set('csrf-token', csrfToken)
    .set('Authorization', `Bearer ${serviceConsumerToken}`)
    .set('Cookie', sessionCookies)
    .send(newUser);

  // Query the new user
  const newUserDB = await User.query()
    .findOne({ email: newUser.email })
    .withGraphFetched('tokens(orderByCreation)');

  const userTokens = newUserDB.tokens!;

  // Get the expiration date of last generated token
  const now = new Date();

  expect(response.status).toBe(201);
  expect(response.body).toEqual({ status: 'success' });

  // New user should exist in db
  expect(newUserDB).not.toBeUndefined();

  // The newt user should have one new token
  expect(userTokens.length).toBe(1);

  // The expiration date of new token should be in an hour
  expect(userTokens[0].expiration.getHours()).toBeLessThanOrEqual(now.getHours() + 1);

});

test('Should login user with correct authentication dont return plain password', async () => {

  const serviceConsumerToken = getNotAuthenticatedToken();
  const { credentials, email, password } = getUserData();
  const { csrfToken, sessionCookies } = getCsrfAndSess();

  // Logging request
  const response = await request
    .post('/api/v1/login')
    .set('csrf-token', csrfToken)
    .set('Authorization', `Bearer ${serviceConsumerToken}`)
    .set('Cookie', sessionCookies)
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

  const serviceConsumerToken = getNotAuthenticatedToken();
  const { credentials } = getUserData();
  const { csrfToken, sessionCookies } = getCsrfAndSess();

  // Logging request
  await request
    .post('/api/v1/login')
    .set('csrf-token', csrfToken)
    .set('Authorization', `Bearer ${serviceConsumerToken}`)
    .set('Cookie', sessionCookies)
    .send(credentials);

  // Get the generated token from database
  const { tokens } = await User.query()
    .findOne({ email: credentials.email })
    .withGraphFetched('tokens(orderByCreation)');

  // Get it's expiration date
  const now = new Date();

  // Mutate now to be 6 month from now
  now.setMonth(now.getMonth() + 6);

  //  Should be more than 6 mont valid
  expect(tokens![0].expiration.getMonth()).toBe(now.getMonth());

});

test('Should not login user with wrong password', async () => {

  const serviceConsumerToken = getNotAuthenticatedToken();
  const { email, password } = getUserData();
  const { csrfToken, sessionCookies } = getCsrfAndSess();

  // Logging request
  const response = await request
    .post('/api/v1/login')
    .set('csrf-token', csrfToken)
    .set('Authorization', `Bearer ${serviceConsumerToken}`)
    .set('Cookie', sessionCookies)
    .send({
      email, password: `wong${password}`
    });

  //  Not authorized action
  expect(response.status).toBe(401);

  // No token is returned
  expect(response.body.token).toBeUndefined();

});

test('Should revoke a given token', async () => {

  // Get fresh token
  const { token, authCookies } = await getFreshToken(request);
  const { csrfToken, sessionCookies } = getCsrfAndSess();

  // Request logout
  const response = await request
    .post('/api/v1/logout')
    .set('csrf-token', csrfToken)
    .set('Cookie', [ ...sessionCookies, ...authCookies ])
    .send({ token });

  //  Query the token
  const tokenDb = await Token.query()
    .findOne({ token });

  expect(response.status).toBe(200);

  // The token should not be found in the db
  expect(tokenDb).toBeUndefined();

});

test('Should logout user and revoke token', async () => {

  // Get fresh token
  const { authCookies, token } = await getFreshToken(request);
  const { csrfToken, sessionCookies } = getCsrfAndSess();

  // Request logout
  const response = await request
    .post('/api/v1/logout')
    .set('csrf-token', csrfToken)
    .set('Cookie', [ ...sessionCookies, ...authCookies ]);

  //  Query the token
  const tokenDb = await Token.query()
    .findOne({ token });

  expect(response.status).toBe(200);

  // The token should not be found in the db
  expect(tokenDb).toBeUndefined();

});

test('Should revoke all tokens', async () => {

  // Get fresh token and it's associated user
  const { authCookies, user } = await getFreshToken(request);
  const { csrfToken, sessionCookies } = getCsrfAndSess();

  // Request logout all
  const logoutResponse = await request
    .delete('/api/v1/logout-all')
    .set('csrf-token', csrfToken)
    .set('Cookie', [ ...sessionCookies, ...authCookies ]);

  // Query the user
  const dbUser = await User.query()
    .findOne({ email: user.email })
    .withGraphFetched('tokens');

  expect(logoutResponse.status).toBe(200);

  // The user does not have any more token
  expect(dbUser.tokens!.length).toBe(0);

});

test('Should validate existing token', async () => {

  // Get fresh token
  const { authCookies } = await getFreshToken(request);
  const { csrfToken, sessionCookies } = getCsrfAndSess();

  // Request to check the token validity
  const response = await request
    .get('/api/v1/check-token')
    .set('csrf-token', csrfToken)
    .set('Cookie', [ ...sessionCookies, ...authCookies ]);

  expect(response.status).toBe(200);

});

test('Should not validate revoked tokens', async () => {

  // Get fresh token
  const { authCookies } = await getFreshToken(request);
  const { csrfToken, sessionCookies } = getCsrfAndSess();

  // Request logout (revoke token)
  await request
    .post('/api/v1/logout')
    .set('csrf-token', csrfToken)
    .set('Cookie', [ ...sessionCookies, ...authCookies ]);

  // Request to check the token validity
  const response = await request
    .get('/api/v1/check-token')
    .set('csrf-token', csrfToken)
    .set('Cookie', [ ...sessionCookies, ...authCookies ]);

  // Not authorized action since the token was already revoked
  expect(response.status).toBe(401);

  //  Not authorized error message
  expect(response.body.message).toBe(new NotAuthenticatedError().message);

  //  Not authorized error name
  expect(response.body.error).toBe(new NotAuthenticatedError().name);

});

test('Should request a password reset generating a temporary 1h valid token', async () => {

  const { email } = getUserData();
  const serviceConsumerToken = getNotAuthenticatedToken();
  const { csrfToken, sessionCookies } = getCsrfAndSess();

  // Request a password reset
  const response = await request
    .post('/api/v1/request-password-reset')
    .set('csrf-token', csrfToken)
    .set('Cookie', sessionCookies)
    .set('Authorization', `Bearer ${serviceConsumerToken}`)
    .send({ email });

  // Query the user and it's token by order of creation
  const userDb = await User.query()
    .findOne({ email })
    .withGraphFetched('tokens(orderByCreation)');

  // Get expiration date of last token
  const now = new Date();

  // Mutate now to be 1 hour from now
  now.setHours(now.getHours() + 1);

  const expirationHour = userDb.tokens![0].expiration.getHours();

  expect(response.status).toBe(200);

  // No token should have been returned
  expect(response.body.token).toBeUndefined();

  // The expiration date should be in an hour
  expect(expirationHour).toBeLessThanOrEqual(now.getHours());

});

test('Should reset the password of user and make it unable to log with old password', async () => {

  const { credentials, password, email } = getUserData();
  const serviceConsumerToken = getNotAuthenticatedToken();
  const { csrfToken, sessionCookies } = getCsrfAndSess();

  // Request a password reset
  await request
    .post('/api/v1/request-password-reset')
    .set('csrf-token', csrfToken)
    .set('Cookie', sessionCookies)
    .set('Authorization', `Bearer ${serviceConsumerToken}`)
    .send({ email });

  // Query the user and it's token by order of creation
  const userDb = await User.query()
    .findOne({ email })
    .withGraphFetched('tokens(orderByCreation)');

  const { token } = userDb.tokens![0];

  const newPassword = `${password}changed`;

  // Actually reset the password with last token of the user
  const response = await request
    .patch('/api/v1/set-password')
    .set('csrf-token', csrfToken)
    .set('Authorization', `Bearer ${serviceConsumerToken}`)
    .set('Cookie', sessionCookies)
    .send({
      password: newPassword, token
    });

  // Try login with old password
  const responseOldPassword = await request
    .post('/api/v1/login')
    .set('csrf-token', csrfToken)
    .set('Cookie', sessionCookies)
    .set('Authorization', `Bearer ${serviceConsumerToken}`)
    .send(credentials);

  // Try login with new password
  const responseNewPassword = await request
    .post('/api/v1/login')
    .set('csrf-token', csrfToken)
    .set('Cookie', sessionCookies)
    .set('Authorization', `Bearer ${serviceConsumerToken}`)
    .send({
      email, password: newPassword
    });

  // Password has been changed
  expect(response.status).toBe(204);

  // Login with new password should work
  expect(responseNewPassword.status).toBe(200);

  // Login with old password should not
  expect(responseOldPassword.status).toBe(401);

});

test('Should reset the password and generate a fresh token and revoke all other tokens', async () => {

  const { credentials, email, password } = getUserData();
  const serviceConsumerToken = getNotAuthenticatedToken();
  const { csrfToken, sessionCookies } = getCsrfAndSess();

  // Create an extra token
  await request
    .post('/api/v1/login')
    .set('csrf-token', csrfToken)
    .set('Cookie', sessionCookies)
    .set('Authorization', `Bearer ${serviceConsumerToken}`)
    .send(credentials);

  // Request a password reset
  await request
    .post('/api/v1/request-password-reset')
    .set('csrf-token', csrfToken)
    .set('Cookie', sessionCookies)
    .set('Authorization', `Bearer ${serviceConsumerToken}`)
    .send({ email });

  // Query the user and it's token by order of creation
  const { tokens : dbTokens } = await User.query()
    .findOne({ email })
    .withGraphFetched('tokens(orderByCreation)');

  const { token: dbToken } = dbTokens![0];

  // Actually reset the password with last token of the user
  const response = await request
    .patch('/api/v1/set-password')
    .set('csrf-token', csrfToken)
    .set('Authorization', `Bearer ${serviceConsumerToken}`)
    .set('Cookie', sessionCookies)
    .send({
      password: `New${password}`, token: dbToken
    });

  // Query the user and it's tokens by order of creation
  const { tokens : dbTokensAfterReset } = await User.query()
    .findOne({ email })
    .withGraphFetched('tokens(orderByCreation)');

  // Get it's expiration date
  const now = new Date();

  // Mutate now to be 6 month from now
  now.setMonth(now.getMonth() + 6);

  const lastToken = getTokenFromAuthCookies(
    getCookiesFromHeaders(response.headers, cookies.AuthCookieName)
  );

  // The body should contains the new token
  expect(lastToken).toBe(dbTokensAfterReset![0].token);

  // The new token should be 6 month valid
  expect(dbTokensAfterReset![0].expiration.getMonth()).toBe(now.getMonth());

  // All other tokens should has been revoked
  expect(dbTokensAfterReset!.length).toBe(1);

});

test('Should login through a third party authentication and update profiles', async () => {

  const { email } = getUserData();
  const serviceConsumerToken = getNotAuthenticatedToken();
  const { csrfToken, sessionCookies } = getCsrfAndSess();

  const profilePicture = 'http://profile.png';

  // Create an extra token
  const response = await request
    .post('/api/v1/register-third-party')
    .set('csrf-token', csrfToken)
    .set('Authorization', `Bearer ${serviceConsumerToken}`)
    .set('Cookie', sessionCookies)
    .send({
      user: {
        email, profilePicture
      }
    });

  // Query the user and it's token by order of creation
  const userDb = await User.query()
    .findOne({ email })
    .withGraphFetched('tokens(orderByCreation)');

  // Get it's expiration date
  const now = new Date();

  // Mutate now to be 6 month from now
  now.setMonth(now.getMonth() + 6);

  const userTokens = userDb.tokens!;

  // The user was created/updated
  expect(response.status).toBe(200);

  // The new token should be 6 month valid
  expect(userTokens[0].expiration.getMonth()).toBe(now.getMonth());

  // Should have updated user's data
  expect(userDb.profilePicture).toBe(profilePicture);

});
