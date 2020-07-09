import * as Models from 'models';
import { builder as graphQlBuilder } from 'objection-graphql';

const graphQlSchema = graphQlBuilder()
  .allModels(Object.values(Models))
  .build();

export default graphQlSchema;
