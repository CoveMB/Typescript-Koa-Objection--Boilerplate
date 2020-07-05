const { User } = require('models');

const testUser = {
  credentials: {
    email   : 'greatemail@exemple.com',
    password: 'P@ssword2000'
  },
  id: 3,
};

const getUserData = () => ({
  ...testUser, ...testUser.credentials
});

const getFreshToken = async request => {

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

module.exports = {
  getFreshToken,
  getUserData
};
