import configServer from 'config/server';
import { cookies } from 'config/variables';
import requestSetUp from 'supertest';
import {
  getCsrfAndSess, getFreshToken, getNotAuthenticatedToken, getUserData
} from './fixtures/helper';
import { resetUserDB, setUp, tearDownDb } from './fixtures/setup';

const { SessionCookieName, AuthCookieName } = cookies;

const server = configServer();
const request = requestSetUp(server.callback());

// Bind Knex and Objection with db
beforeAll(() => setUp(request));

// Reset the db with only the default User
beforeEach(resetUserDB);

// Rollback DB
afterAll(tearDownDb);

test('Should not allow a POST without a CSRF token', async () => {

  const serviceConsumerToken = getNotAuthenticatedToken();
  const { sessionCookies } = getCsrfAndSess();
  const newUser = { email: 'newuser@email.com' };

  // Create user
  const response = await request
    .post('/api/v1/register')
    .set('Authorization', `Bearer ${serviceConsumerToken}`)
    .set('Cookie', sessionCookies)
    .send(newUser);

  expect(response.status).toBe(403);

});

test('The client app need to be authenticated to get CSRF token', async () => {

  const response = await request
    .get('/api/v1/get-csrf');

  expect(response.status).toBe(401);

});

test('Should set a session cookie', async () => {

  const serviceConsumerToken = getNotAuthenticatedToken();

  const response = await request
    .get('/api/v1/get-csrf')
    .set('Authorization', `Bearer ${serviceConsumerToken}`);

  const sessionCookiePresent = response.headers['set-cookie'].some((cookie: string) => cookie.includes(SessionCookieName));

  expect(response.status).toBe(200);
  expect(sessionCookiePresent).toBe(true);

});

test('Should return a csrf token', async () => {

  const serviceConsumerToken = getNotAuthenticatedToken();

  const response = await request
    .get('/api/v1/get-csrf')
    .set('Authorization', `Bearer ${serviceConsumerToken}`);

  expect(response.status).toBe(200);
  expect(response.body.csrf).toBeTruthy();

});

test('Should set a auth cookie on login', async () => {

  const serviceConsumerToken = getNotAuthenticatedToken();
  const { credentials } = getUserData();
  const { csrfToken, sessionCookies } = getCsrfAndSess();

  // Logging request
  const response = await request
    .post('/api/v1/login')
    .set('csrf-token', csrfToken)
    .set('Authorization', `Bearer ${serviceConsumerToken}`)
    .set('Cookie', sessionCookies)
    .send(credentials);

  const authCookiePresent = response.headers['set-cookie'].some((cookie: string) => cookie.includes(AuthCookieName));

  expect(response.status).toBe(200);
  expect(authCookiePresent).toBe(true);

});

test('Should not set a auth cookie on register', async () => {

  const serviceConsumerToken = getNotAuthenticatedToken();
  const { email } = getUserData();
  const { csrfToken, sessionCookies } = getCsrfAndSess();

  // Logging request
  const response = await request
    .post('/api/v1/register')
    .set('csrf-token', csrfToken)
    .set('Authorization', `Bearer ${serviceConsumerToken}`)
    .set('Cookie', sessionCookies)
    .send({ email: `new${email}` });

  expect(response.status).toBe(201);
  expect(response.headers['set-cookie']).toBeUndefined();

});

test('Should set a auth cookie on password change', async () => {

  const serviceConsumerToken = getNotAuthenticatedToken();
  const { token } = await getFreshToken(request);
  const { password } = getUserData();
  const { csrfToken, sessionCookies } = getCsrfAndSess();

  // Set a new password
  const response = await request
    .patch('/api/v1/set-password')
    .set('csrf-token', csrfToken)
    .set('Authorization', `Bearer ${serviceConsumerToken}`)
    .set('Cookie', sessionCookies)
    .send({
      password: `${password}changed`, token
    });

  const authCookiePresent = response.headers['set-cookie'].some((cookie: string) => cookie.includes(AuthCookieName));

  expect(response.status).toBe(204);
  expect(authCookiePresent).toBe(true);

});
