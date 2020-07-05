const authenticated = require('./authenticated');
const error = require('./error');
const log = require('./log');
const validateRequest = require('./validateRequest');

module.exports = {
  ...authenticated,
  ...error,
  ...log,
  ...validateRequest
};
