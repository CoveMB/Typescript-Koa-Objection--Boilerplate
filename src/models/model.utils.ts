import { Model } from 'objection';

import { ValidationError, NotFoundError } from 'config/errors/error.types';

const validateInput = (schema, input): void => {

  const { error } = schema.validate(input);

  if (error) {

    throw new ValidationError(error.details.message);

  }

};

const validateFoundInstances = (
  instancesToCheck: {instance: Model, type: string, search: string | number}[]
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
