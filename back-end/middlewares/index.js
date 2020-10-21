const validateJWT = require('./validateJWT');
const { promiseErrors, endpointNotFound } = require('./errorController');

module.exports = {
  validateJWT,
  promiseErrors,
  endpointNotFound,
};
