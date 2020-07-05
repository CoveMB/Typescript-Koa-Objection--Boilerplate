import Objection, { QueryBuilder, Model, Page } from 'objection';

class BaseModelQueryBuilder<M extends Model, R = M[]> extends QueryBuilder<M, R> {

  // These are necessary. You can just copy-paste them and change the
  // name of the query builder class.
  ArrayQueryBuilderType!: BaseModelQueryBuilder<M, M[]>;
  SingleQueryBuilderType!: BaseModelQueryBuilder<M, M>;
  NumberQueryBuilderType!: BaseModelQueryBuilder<M, number>;
  PageQueryBuilderType!: BaseModelQueryBuilder<M, Page<M>>;

  async findOrCreate(data: Objection.PartialModelObject<M>):Promise<this> {

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

module.exports = BaseModelQueryBuilder;
