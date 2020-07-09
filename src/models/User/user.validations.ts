/* eslint-disable import/no-cycle */
import Joi from '@hapi/joi';
import { ValidationError } from 'config/errors/error.types';
import passwordComplexity from 'joi-password-complexity';
import { PartialModelObject, Expression } from 'objection';
import { User } from 'models';
import { validateInput } from '../model.utils';

const passwordValidation = (password: Expression<string>): void => {

  const complexityOptions = {
    min             : 8,
    max             : 80,
    lowerCase       : 1,
    upperCase       : 1,
    numeric         : 1,
    symbol          : 1,
    requirementCount: 6,
  };

  const { error } = passwordComplexity(complexityOptions).validate(password);

  if (error) {

    error.message = error.message.replace('value', 'password');

    throw new ValidationError(error.message);

  }

};

const emailSchema = Joi.string().email();

const validateUserInput = (payload: PartialModelObject<User>): void => {

  // Validate the password
  if (payload.password) {

    passwordValidation(payload.password);

  }

  // Validate email
  if (payload.email) {

    validateInput(emailSchema, payload.email);

  }

};

export default validateUserInput;
