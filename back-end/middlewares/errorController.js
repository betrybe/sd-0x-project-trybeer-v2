const objError = {
  bad_request: 400,
  unauthorized: 401,
  forbidden: 403,
  not_found: 404,
  already_exists: 409,
  invalid_data: 422,
};

const promiseErrors = (err, _req, res, _next) => {
  const statusCode = objError[err.code] || err.statusCode || 500;
  const code = err.code || 'internal_error';
  return res.status(statusCode).json({
    error: { error: true, message: err.message, code },
  });
};

const endpointNotFound = (_req, res) => res.status(404).json(
  { error: { error: true, message: 'The endpoint wasn\'t found', code: 'not_found' } },
);

module.exports = {
  promiseErrors,
  endpointNotFound,
};
