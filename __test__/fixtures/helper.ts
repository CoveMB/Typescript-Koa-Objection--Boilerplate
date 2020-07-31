import { User } from 'models';
import { SuperTest, Test } from 'supertest';
import { serviceConsumerToken } from 'config/variables';

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

const getFreshToken = async (request: SuperTest<Test>): Promise<{
  user: User, token: string | undefined
}> => {

  const { credentials } = getUserData();

  await request
    .post('/api/v1/login')
    .set('Authorization', `Bearer ${serviceConsumerToken}`)
    .send({ ...credentials });

  const user = await User.query()
    .findOne({ email: credentials.email })
    .withGraphFetched('tokens(orderByCreation)');

  let tokenToReturn;

  if (user.tokens) {

    tokenToReturn = user.tokens[0].token;

  }

  return {
    user, token: tokenToReturn
  };

};

export {
  getFreshToken,
  getUserData
};
