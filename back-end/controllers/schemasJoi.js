const Joi = require('@hapi/joi/');
const errorJoi = require('./errorJoi');

const loginUser = Joi.object({
  email: Joi.string().email().max(100).required(),
  password: Joi.string().min(6).max(50).required(),
});

const createUser = Joi.object({
  name: Joi.string().min(12).max(100).required(),
  email: Joi.string().email().max(100).required(),
  password: Joi.string().min(6).max(50).required(),
  role: Joi.boolean().required(),
});

const updateUserById = Joi.object({
  name: Joi.string().min(12).max(100).required(),
});

const createProducts = Joi.object({
  productId: Joi.number().required(),
  quantity: Joi.number().integer().min(1).required()
    .strict(),
});

const createSale = Joi.object({
  products: Joi.array().items(createProducts).min(1).required(),
  deliveryAddress: Joi.string().max(100).required(),
  deliveryNumber: Joi.string().max(50).required(),
});

const validateJoi = async (schema, reqInfo) => schema
  .validateAsync(reqInfo).catch((fail) => errorJoi(fail));

module.exports = {
  loginUser,
  createUser,
  updateUserById,
  createSale,
  validateJoi,
};
