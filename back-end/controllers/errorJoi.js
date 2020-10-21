const errorJoi = (err) => ({
  error: true, message: err.details[0].message, code: 'invalid_data',
});

module.exports = errorJoi;
