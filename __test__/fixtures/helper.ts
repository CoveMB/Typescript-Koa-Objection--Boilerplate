import { User } from 'models';
import { SuperTest, Test } from 'supertest';

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
  user: User, token: string
}> => {

  const { credentials } = getUserData();

  await request
    .post('/api/v1/login')
    .send({ ...credentials });

  const user = await User.query()
    .findOne({ email: credentials.email })
    .withGraphFetched('tokens(orderByCreation)');

  return {
    user, token: user.tokens[0].token
  };

};

export {
  getFreshToken,
  getUserData
};
