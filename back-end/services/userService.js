const jwt = require('jsonwebtoken');
const { users } = require('../models');

const jwtSecret = process.env.JWT_SECRET;

const jwtConfig = {
  expiresIn: '300m',
  algorithm: 'HS256',
};

const loginUser = async (email, paramPassword) => {
  const result = await users.findOne({
    where: { email },
    attributes: { exclude: ['published', 'updated'] },
  });
  if (!result || result.password !== paramPassword) {
    return { error: true, message: 'No user was matched', code: 'unauthorized' };
  }
  const { dataValues: { id, password, ...userInfo } } = result;
  const token = jwt.sign({ data: userInfo }, jwtSecret, jwtConfig);
  userInfo.token = token;
  return userInfo;
};

const createUser = async (userInfo) => {
  const {
    name, email, password, type,
  } = userInfo;
  const result = await users.findOne({
    where: { email },
    attributes: { exclude: ['published', 'updated'] },
  });
  if (result) {
    return { error: true, message: 'E-mail already in database', code: 'already_exists' };
  }
  const role = type === 'true' ? 'administrator' : 'client';
  const createdUser = await users.create({
    name, email, password, role,
  });
  return createdUser;
};

const updateUserById = async (id, name) => {
  const userExists = await users.findByPk(id);
  if (!userExists) {
    return { error: true, message: 'User not found', code: 'unauthorized' };
  }
  await users.update({ name }, { where: { id } });
  const result = await users.findOne(
    { where: { id }, attributes: { exclude: ['password', 'published', 'updated'] } },
  );
  return result;
};

module.exports = {
  loginUser,
  createUser,
  updateUserById,
};
