const jwt = require('jsonwebtoken');
const validateJWT = require('./validateJWT');
const { users } = require('../models');

describe('validate with JWT tests', () => {
  test('if validator returns message when token is not provided', async () => {
    const mockReq = { headers: { authorization: null } };
    const mockNext = jest.fn();
    const mockAnswer = { error: true, message: 'Token not found', code: 'invalid_data' };

    await validateJWT(mockReq, null, mockNext);

    expect(mockNext).toBeCalledWith(mockAnswer);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  test('if validator returns message when token is expired', async () => {
    const jwtSecret = 'senhaParaTeste';
    const jwtConfig = { expiresIn: '300m', algorithm: 'HS256' };
    const userData = {
      id: 100, displayName: 'Johnatas Henrique', email: 'johnatas.henrique@gmail.com', image: null,
    };
    const token = jwt.sign(userData, jwtSecret, jwtConfig);
    const mockReq = { headers: { authorization: token } };
    const mockNext = jest.fn();
    const mockAnswer = { error: true, message: 'invalid signature', code: 'unauthorized' };

    await validateJWT(mockReq, null, mockNext);

    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockNext).toBeCalledWith(mockAnswer);
  });

  test('if validator returns message when token is OK and user not found', async () => {
    const jwtSecret = 'senhaParaTeste';
    const jwtConfig = { expiresIn: '300m', algorithm: 'HS256' };
    const userData = { email: 'johnatas@gmail.com', password: '524288' };
    const decodeData = { data: { email: 'johnatas@gmail.com', password: '524288' } };
    const token = jwt.sign(userData, jwtSecret, jwtConfig);

    const mockReq = { headers: { authorization: token } };
    const mockNext = jest.fn();
    const mockAnswer = { error: true, message: 'User does not exist', code: 'invalid_data' };
    const getUserByIdSpy = jest.spyOn(users, 'findOne').mockReturnValueOnce(null);
    const decode = jest.spyOn(jwt, 'verify').mockReturnValueOnce(decodeData);

    await validateJWT(mockReq, null, mockNext);

    expect(getUserByIdSpy).toHaveBeenCalledTimes(1);
    expect(getUserByIdSpy).toBeCalledWith(
      { where: { email: 'johnatas@gmail.com' }, attributes: { exclude: ['published', 'updated'] } },
    );
    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockNext).toBeCalledWith(mockAnswer);

    getUserByIdSpy.mockRestore();
    decode.mockRestore();
  });

  test('if validator returns token when token is OK and user is found', async () => {
    const jwtSecret = 'senhaParaTeste';
    const jwtConfig = { expiresIn: '300m', algorithm: 'HS256' };
    const userData = { email: 'johnatas@gmail.com', password: '524288' };
    const decodeData = { data: { email: 'johnatas@gmail.com', password: '524288' } };
    const token = jwt.sign(userData, jwtSecret, jwtConfig);
    const mockReq = { headers: { authorization: token } };
    const mockNext = jest.fn();
    const mockSequelize = { dataValues: userData, ...userData };
    const getUserByIdSpy = jest.spyOn(users, 'findOne').mockReturnValueOnce(mockSequelize);
    const decode = jest.spyOn(jwt, 'verify').mockReturnValueOnce(decodeData);

    await validateJWT(mockReq, null, mockNext);

    expect(getUserByIdSpy).toHaveBeenCalledTimes(1);
    expect(getUserByIdSpy).toBeCalledWith(
      { where: { email: 'johnatas@gmail.com' }, attributes: { exclude: ['published', 'updated'] } },
    );
    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockNext).toBeCalledWith();

    getUserByIdSpy.mockRestore();
    decode.mockRestore();
  });
});
