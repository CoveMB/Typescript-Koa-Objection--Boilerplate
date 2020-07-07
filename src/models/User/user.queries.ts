import { LoginError } from 'config/errors/error.types';
import BaseQueryBuilder from 'models/Base.queries';
import { Model, Page } from 'objection';
import User from './User';

type Credentials = {
  email: string,
  password: string
};

export default class UserQueryBuilder<M extends Model | User, R = M[]>
  extends BaseQueryBuilder<M, R> {

  // These are necessary.
  ArrayQueryBuilderType!: UserQueryBuilder<M, M[]>;
  SingleQueryBuilderType!: UserQueryBuilder<M, M>;
  NumberQueryBuilderType!: UserQueryBuilder<M, number>;
  PageQueryBuilderType!: UserQueryBuilder<M, Page<M>>;

  async findByCredentials({ email, password }: Credentials): Promise<User> {

    // Find the appropriate user from a the sent credentials (including email and password)
    const user: User = await this.first().where('email', email);

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
