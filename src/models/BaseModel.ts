import { Model } from 'objection';
import BaseModelQueryBuilder from './BaseModel.queries';

export default class BaseModel extends Model {

  id!: number;
  uuid!: string;
  created_at!: string;
  updated_at!: string;

  // This register the custom query builder
  static QueryBuilder = BaseModelQueryBuilder

  ;

  // Omit fields for json response from model
  $formatJson(instance) {

    super.$formatJson(instance);

    delete instance.id;

    return instance;

  }

  // Add an updated value each time a model is updated
  $beforeUpdate() {

    this.updated_at = new Date().toISOString();

  }

}
