import { User } from 'models';
import { Response, SuperTest, Test } from 'supertest';
import jwt from 'jsonwebtoken';
import { cookies, jwtSecret } from 'config/variables';

type TestUser = {
  credentials: {
    email: string,
    password: string
  },
  id: number,
  email: string,
  password: string
};

const testUser = {
  credentials: {
    email   : 'greatemail@exemple.com',
    password: 'P@ssword2000'
  },
  id: 3,
};

const getUserData = (): TestUser => ({
  ...testUser, ...testUser.credentials
});

// Generate an non authenticated access token (that will not be tight to a user)
const getNotAuthenticatedToken = (): string => jwt.sign({}, jwtSecret);

// Get cookie by it's name from header
const getCookiesFromHeaders = (headers: {'set-cookie': string[]}, cookieName: string): string[] => headers['set-cookie'].filter((cookie: string) => cookie.includes(cookieName));

// Get only the token from the auth cookies
const getTokenFromAuthCookies = (cookiesToFilter: string[]): string => cookiesToFilter.filter((cookie) => cookie.split('=')[0] === cookies.AuthCookieName)[0].split('=')[1].split(';')[0];

// CSRF
// Mutable security tokens info
type SecurityTokens = {
  csrfToken: string,
  sessionCookies: string[]
};

const security: SecurityTokens = {
  csrfToken     : '',
  sessionCookies: []
};

// Set the CSRF token with the associate session token
const setCsrfAndSess = ({ body, headers }: Response): void => {

  // Extract session cookie from header
  const sessionCookies: string[] = getCookiesFromHeaders(headers, cookies.SessionCookieName);

  security.csrfToken = body.csrf;
  security.sessionCookies = sessionCookies;

};

const getCsrfAndSess = (): SecurityTokens => security;

const getFreshToken = async (request: SuperTest<Test>): Promise<{
  user: User, authCookies: string[], token: string
}> => {

  const serviceConsumerToken = getNotAuthenticatedToken();
  const { csrfToken, sessionCookies } = getCsrfAndSess();
  const { credentials } = getUserData();

  const response = await request
    .post('/api/v1/login')
    .set('csrf-token', csrfToken)
    .set('Authorization', `Bearer ${serviceConsumerToken}`)
    .set('Cookie', sessionCookies)
    .send(credentials);

  const user = await User.query()
    .findOne({ email: credentials.email })
    .withGraphFetched('tokens(orderByCreation)');

  // Get auth cookie from response
  const authCookies = getCookiesFromHeaders(response.headers, cookies.AuthCookieName);

  // Get only the token from the auth cookie
  // The token is in the auth cookie between "=" and ";"
  const token = getTokenFromAuthCookies(authCookies);

  return {
    user, authCookies, token
  };

};

export {
  getCookiesFromHeaders,
  getFreshToken,
  getUserData,
  getTokenFromAuthCookies,
  getNotAuthenticatedToken,
  setCsrfAndSess,
  getCsrfAndSess
};
