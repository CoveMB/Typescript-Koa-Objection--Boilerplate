const graphQlBuilder = require('objection-graphql').builder;
const Models = require('models');

const graphQlSchema = graphQlBuilder()
  .allModels(Object.values(Models))
  .build();

module.exports = graphQlSchema;
