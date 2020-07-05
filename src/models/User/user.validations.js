const passwordComplexity = require('joi-password-complexity');
const { ValidationError } = require('config/errors/error.types');
const Joi = require('@hapi/joi');
const { validateInput } = require('../model.utils');

const passwordValidation = password => {

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

const validateUserInput = payload => {

  // Validate the password
  if (payload.password) {

    passwordValidation(payload.password);

  }

  // Validate email
  if (payload.email) {

    validateInput(emailSchema, payload.email);

  }

};

module.exports = validateUserInput;
