import {
  QueryBuilder, Model, Page, PartialModelObject
} from 'objection';

export default class BaseQueryBuilder<M extends Model, R = M[]> extends QueryBuilder<M, R> {

  // These are necessary.
  ArrayQueryBuilderType!: BaseQueryBuilder<M, M[]>;
  SingleQueryBuilderType!: BaseQueryBuilder<M, M>;
  NumberQueryBuilderType!: BaseQueryBuilder<M, number>;
  PageQueryBuilderType!: BaseQueryBuilder<M, Page<M>>;

  async findOrCreate(data: PartialModelObject<M>): Promise<M> {

    // Try to find existing instance
    let instance = await this.findOne(data);

    // If no instance exist create one
    if (!instance) {

      instance = await this.insert(data);

    }

    return instance;

  }

  async findByUuid(uuid: string): Promise<M> {

    // Try to find existing instance by it's uuid
    return this.findOne({ uuid });

  }

}
