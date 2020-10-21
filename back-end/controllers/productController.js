const rescue = require('express-rescue');
const productService = require('../services/productService');

const getAllProducts = rescue(async (_req, res, _next) => {
  const serviceAnswer = await productService.getAllProducts();
  return res.status(200).json(serviceAnswer);
});

const getProductById = rescue(async (req, res, next) => {
  const { id } = req.params;
  const serviceAnswer = await productService.getProductById(id);
  if (serviceAnswer.error) return next(serviceAnswer);
  return res.status(200).json(serviceAnswer);
});

module.exports = {
  getAllProducts,
  getProductById,
};
