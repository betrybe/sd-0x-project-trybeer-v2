const rescue = require('express-rescue');
const schemasJoi = require('./schemasJoi');
const userService = require('../services/userService');
const { validateJoi } = require('./schemasJoi');

const loginUser = rescue(async (req, res, next) => {
  const isValid = await validateJoi(schemasJoi.loginUser, req.body);
  if (isValid.error) return next(isValid);
  const { email, password } = req.body;
  const serviceAnswer = await userService.loginUser(email, password);
  if (serviceAnswer.error) return next(serviceAnswer);
  return res.status(200).json(serviceAnswer);
});

const createUser = rescue(async (req, res, next) => {
  const isValid = await validateJoi(schemasJoi.createUser, req.body);
  if (isValid.error) return next(isValid);
  const {
    name, email, password, role: type,
  } = req.body;
  const serviceAnswer = await userService.createUser({
    name, email, password, type,
  });
  if (serviceAnswer.error) return next(serviceAnswer);
  return res.status(201).json(serviceAnswer);
});

const updateUserById = rescue(async (req, res, next) => {
  const isValid = await validateJoi(schemasJoi.updateUserById, req.body);
  if (isValid.error) return next(isValid);
  const { id } = req.user;
  const { name } = req.body;
  const serviceAnswer = await userService.updateUserById(id, name);
  if (serviceAnswer.error) return next(serviceAnswer);
  return res.status(200).json(serviceAnswer);
});

const getLoginUser = rescue(async (req, res) => res.status(200).json({ token: req.user }));

module.exports = {
  loginUser,
  createUser,
  updateUserById,
  getLoginUser,
};
