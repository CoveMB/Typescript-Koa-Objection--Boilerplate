import { Model, Expression } from 'objection';
import { ValidationError, NotFoundError } from 'config/errors/error.types';
import { StringSchema } from '@hapi/joi';

const validateInput = (schema: StringSchema, input: Expression<string>): void => {

  const { error } = schema.validate(input);

  if (error) {

    throw new ValidationError(JSON.stringify(error.details));

  }

};

const validateFoundInstances = (
  instancesToCheck: {instance?: Model, type: string, search: string | number}[]
): void => {

  instancesToCheck.forEach(instanceToCheck => {

    const { instance, type, search } = instanceToCheck;

    if (instance === undefined) {

      throw new NotFoundError(`${type}${search ? `, Requested: ${search}` : ''}`);

    }

  });

};

export {
  validateInput, validateFoundInstances
};
