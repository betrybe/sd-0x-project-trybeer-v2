const rescue = require('express-rescue');
const saleService = require('../services/saleService');
const schemasJoi = require('./schemasJoi');
const { validateJoi } = require('./schemasJoi');

const createSale = rescue(async (req, res, next) => {
  const isValid = await validateJoi(schemasJoi.createSale, req.body);
  if (isValid.error) return next(isValid);
  const { ...sale } = req.body;
  const { id: userId, name } = req.user;
  const serviceAnswer = await saleService.createSale(sale, userId, name);
  if (serviceAnswer.error) return next(serviceAnswer);
  return res.status(201).json(serviceAnswer);
});

const getSale = rescue(async (req, res, next) => {
  const { id, role } = req.user;
  const serviceAnswer = await saleService.getSale(id, role);
  if (serviceAnswer.error) return next(serviceAnswer);
  return res.status(200).json(serviceAnswer);
});

const getSaleProducts = rescue(async (req, res, next) => {
  const { id: userId, role } = req.user;
  const { id: saleId } = req.params;
  const serviceAnswer = await saleService.getSaleProducts(role, userId, saleId);
  if (serviceAnswer.error) return next(serviceAnswer);
  return res.status(200).json(serviceAnswer);
});

const updateSaleById = rescue(async (req, res, next) => {
  const { id: saleId } = req.params;
  const { role } = req.user;
  const { status } = req.body;
  const serviceAnswer = await saleService.updateSaleById(saleId, role, status);
  if (serviceAnswer.error) return next(serviceAnswer);
  return res.status(200).json(serviceAnswer);
});

module.exports = {
  createSale,
  getSale,
  getSaleProducts,
  updateSaleById,
};
