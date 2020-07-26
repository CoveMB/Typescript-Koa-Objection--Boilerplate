/* eslint-disable camelcase */
import {
  Model, ModelOptions, Modifiers, QueryContext
} from 'objection';
import BaseQueryBuilder from './Base.queries';

export default class BaseModel extends Model {

  id!: number;
  uuid!: string;
  createdAt!: string;
  updatedAt!: string;

  QueryBuilderType!: BaseQueryBuilder<this>;

  // This register the custom query builder
  static QueryBuilder = BaseQueryBuilder;

  // Modifiers are reusable query snippets that can be used in various places.
  static modifiers: Modifiers = {
    orderByCreation(builder) {

      builder.orderBy('createdAt');

    },
  };

  // Omit fields for json response from model
  $formatJson(instance: BaseModel): BaseModel {

    super.$formatJson(instance);

    // eslint-disable-next-line no-param-reassign
    delete instance.id;

    return instance;

  }

  // Add an updated value each time a model is updated
  async $beforeUpdate(opt: ModelOptions, queryContext: QueryContext): Promise<void> {

    await super.$beforeUpdate(opt, queryContext);

    this.updatedAt = new Date().toISOString();

  }

}
