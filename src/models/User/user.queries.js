const { LoginError } = require('config/errors/error.types');
const BaseModelQueryBuilder = require('models/BaseModel.queries');

class UserQueryBuilder extends BaseModelQueryBuilder {

  async findByCredentials({ email, password }) {

    // Find the appropriate user from a the sent credentials (including email and password)
    const user = await this.first().where('email', email);

    // If no user is found throw login error
    if (!user) {

      throw new LoginError();

    }

    const authenticated = await user.verifyPassword(password);

    // If the password could not be validated throw login error
    if (!authenticated) {

      throw new LoginError();

    }

    return user;

  }

}

module.exports = UserQueryBuilder;
