import { QueryBuilder, Model, Page } from 'objection';

export default class BaseQueryBuilder<M extends Model, R = M[]> extends QueryBuilder<M, R> {

  // These are necessary.
  ArrayQueryBuilderType!: BaseQueryBuilder<M, M[]>;
  SingleQueryBuilderType!: BaseQueryBuilder<M, M>;
  NumberQueryBuilderType!: BaseQueryBuilder<M, number>;
  PageQueryBuilderType!: BaseQueryBuilder<M, Page<M>>;

  async findOrCreate(data):Promise<this> {

    // Try to find existing instance
    let instance = await this.findOne(data);

    // If no instance exist create one
    if (!instance) {

      instance = await this.insert(data);

    }

    return this;

  }

  async findByUuid(uuid: string):Promise<this> {

    // Try to find existing instance by it's uuid
    this.findOne({ uuid });

    return this;

  }

}
