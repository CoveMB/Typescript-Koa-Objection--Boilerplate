// import { ParameterizedContext } from 'koa';

// type RequestWithUuid = {
//   requestUuid: string
// };

// type WithValidatedRequest<M> = {
//   validatedRequest: M
// };

// type WithRecords<M> = {
//   records: M
// };

// type WithBody<M> = {
//   request: {
//     body: M
//   }
// };

// type RecordsSchema<
//   M extends Record<string, unknown> = Record<string, unknown>
// > = {
//   records: M
// };

// type RequestSchema<
//   M extends Record<string, unknown> = Record<string, unknown>
// > = {
//   validatedRequest: M
// };

// type StatefulContext<M extends RequestSchema | RecordsSchema = any> = ParameterizedContext<M>;
