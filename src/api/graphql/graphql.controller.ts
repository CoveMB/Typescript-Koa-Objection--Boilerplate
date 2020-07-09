import { Context } from 'koa';
import graphqlHTTP from 'koa-graphql';
import graphQlSchema from 'config/graphql';
import { isDevelopment } from 'config/variables';
import { ImplementationMissingError } from 'config/errors/error.types';
import { QueryBuilder, Model } from 'objection';

// All graphQL queries are handled by graphqlHTTP
export const graphql = async (ctx: Context): Promise<void> => graphqlHTTP({
  schema     : graphQlSchema,
  graphiql   : isDevelopment, // Will activate graphiql only in during development
  formatError: (error: Error) => {

    // Throw error from context instead of return in it in the graphQl query result
    ctx.throw(error);

  },
  context  : ctx,
  pretty   : true,
  rootValue: {

    // This will be trigger for every graphql query
    async onQuery(query: QueryBuilder<Model>) {

      // A query from the graphql endpoint will have a special context
      query.context({

        // This will run for every query builder built from the graphql query
        // For the queried entities/model and the related entities as well
        runBefore(_, builder: QueryBuilder<Model>) {

          // We get the authenticated user from the context (cf authenticated middleware)
          const { user } = ctx.authenticated;

          try {

            // Each queried models will have the graphQLAccessControl modifier run
            // It will return different data depending of their relationship with the authenticated user
            builder.modify('graphQLAccessControl', user);

          } catch (error) {

            // Each queried models should have a graphQLAccessControl modifier defined
            throw new ImplementationMissingError(`graphQLAccessControl modifier for one of the model queried by the graphQL query | ${error.stack}`);

          }

        },
      });

    }
  }
})(ctx);
