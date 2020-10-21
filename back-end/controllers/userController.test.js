const userController = require('./userController');
const { users } = require('../models');

afterEach(() => jest.clearAllMocks());

describe('userController tests', () => {
  describe('Login User', () => {
    test('If pass invalid requisition, return a Joi message and status 400', async () => {
      const mockBodyData = { email: 'johnatas@email.cxom', password: '131072' };
      const mockReq = { body: mockBodyData };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const mockJoi = { code: 'invalid_data', error: true, message: '"email" must be a valid email' };

      await userController.loginUser(mockReq, mockRes, mockNext);

      expect(mockNext).toBeCalledWith(mockJoi);
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockJson).not.toHaveBeenCalled();
    });

    test('If pass invalid credentials, return a service message', async () => {
      const mockBodyData = { email: 'johnatas@email.com', password: '131072' };
      const mockReq = { body: mockBodyData };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const mockServiceAnswer = { code: 'unauthorized', error: true, message: 'No user was matched' };
      const userData = {
        id: 2, name: 'Johnatas Henrique', email: 'johnatas.henrique@gmail.com', password: '524288',
      };
      const mockSequelize = { dataValues: userData, ...userData };
      const usersFindOneSpy = jest.spyOn(users, 'findOne').mockReturnValueOnce(mockSequelize);

      await userController.loginUser(mockReq, mockRes, mockNext);

      expect(usersFindOneSpy).toBeCalledTimes(1);
      expect(mockNext).toBeCalledWith(mockServiceAnswer);
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockJson).not.toHaveBeenCalled();
    });

    test('If pass valid credentials, return a token and status 200', async () => {
      const mockBodyData = { email: 'johnatas.henrique@gmail.com', password: '524288' };
      const mockReq = { body: mockBodyData };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const userData = {
        id: 2, name: 'Johnatas Henrique', email: 'johnatas.henrique@gmail.com', password: '524288',
      };
      const mockSequelize = { dataValues: userData, ...userData };
      const usersFindOneSpy = jest.spyOn(users, 'findOne').mockReturnValueOnce(mockSequelize);

      await userController.loginUser(mockReq, mockRes, mockNext);

      expect(usersFindOneSpy).toBeCalledTimes(1);
      expect(mockNext).not.toBeCalled();
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockJson.mock.calls[0][0]).toHaveProperty('token');
    });
  });

  describe('Create User', () => {
    test('If pass invalid requisition, return a Joi message and status 400', async () => {
      const mockBodyData = {
        name: 'Johnatas Henrique', email: 'johnatas.henrique@gmail.cxom', password: '524288', role: 'false',
      };
      const mockReq = { body: mockBodyData };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const mockJoiAnswer = { code: 'invalid_data', error: true, message: '"email" must be a valid email' };

      await userController.createUser(mockReq, mockRes, mockNext);

      expect(mockNext).toBeCalledWith(mockJoiAnswer);
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockJson).not.toHaveBeenCalled();
    });

    test('If pass an user who is in the database, return message and status 409', async () => {
      const mockBodyData = {
        name: 'Johnatas Henrique', email: 'johnatas.henrique@gmail.com', password: '524288', role: 'false',
      };
      const mockReq = { body: mockBodyData };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const mockServiceAnswer = { error: true, message: 'E-mail already in database', code: 'already_exists' };
      const userData = {
        id: 2, name: 'Johnatas Henrique', email: 'johnatas.henrique@gmail.com', password: '524288', role: 'client',
      };
      const usersFindOneSpy = jest.spyOn(users, 'findOne').mockReturnValueOnce(userData);

      await userController.createUser(mockReq, mockRes, mockNext);

      expect(usersFindOneSpy).toBeCalledTimes(1);
      expect(mockNext).toBeCalledWith(mockServiceAnswer);
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockJson).not.toHaveBeenCalled();
    });

    test('If pass valid credentials of and user, return a response and status 201', async () => {
      const mockBodyData = {
        name: 'Johnatas Henrique', email: 'johnatas.henrique@gmail.com', password: '524288', role: 'false',
      };
      const mockReq = { body: mockBodyData };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const callCreateData = {
        name: 'Johnatas Henrique', email: 'johnatas.henrique@gmail.com', password: '524288', role: 'client',
      };
      const userData = {
        id: 2, name: 'Johnatas Henrique', email: 'johnatas.henrique@gmail.com', password: '524288', role: 'client',
      };
      const usersFindOneSpy = jest.spyOn(users, 'findOne').mockReturnValueOnce(null);
      const usersCreateSpy = jest.spyOn(users, 'create').mockReturnValueOnce(userData);

      await userController.createUser(mockReq, mockRes, mockNext);

      expect(usersFindOneSpy).toBeCalledTimes(1);
      expect(usersCreateSpy).toBeCalledTimes(1);
      expect(usersCreateSpy).toBeCalledWith(callCreateData);
      expect(mockRes.status).toBeCalledWith(201);
      expect(mockJson).toBeCalledWith(userData);
    });

    test('If pass valid credentials of an admin, return a response and status 201', async () => {
      const mockBodyData = {
        name: 'NEW ADMINISTRATOR', email: 'admin@powerful.com', password: '16777216', role: 'true',
      };
      const mockReq = { body: mockBodyData };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const callCreateData = {
        name: 'NEW ADMINISTRATOR', email: 'admin@powerful.com', password: '16777216', role: 'administrator',
      };
      const userData = {
        id: 3, name: 'NEW ADMINISTRATOR', email: 'admin@powerful.com', password: '16777216', role: 'administrator',
      };
      const usersFindOneSpy = jest.spyOn(users, 'findOne').mockReturnValueOnce(null);
      const usersCreateSpy = jest.spyOn(users, 'create').mockReturnValueOnce(userData);

      await userController.createUser(mockReq, mockRes, mockNext);

      expect(usersFindOneSpy).toBeCalledTimes(1);
      expect(usersCreateSpy).toBeCalledTimes(1);
      expect(usersCreateSpy).toBeCalledWith(callCreateData);
      expect(mockRes.status).toBeCalledWith(201);
      expect(mockJson).toBeCalledWith(userData);
    });
  });

  describe('Update User By Id', () => {
    test('If pass invalid requisition, return a Joi message and status 400', async () => {
      const mockBodyData = { name: 'Johnatas' };
      const mockUserData = {
        id: 2, name: 'Johnatas Henrique', email: 'johnatas.henrique@gmail.com', password: '524288', role: 'false',
      };
      const mockReq = { body: { mockBodyData }, user: { mockUserData } };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const mockJoiAnswer = { code: 'invalid_data', error: true, message: '"name" is required' };

      await userController.updateUserById(mockReq, mockRes, mockNext);

      expect(mockNext).toBeCalledWith(mockJoiAnswer);
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockJson).not.toHaveBeenCalled();
    });

    test('If pass invalid info, return a service message', async () => {
      const mockBodyData = { name: 'Johnatas Henrique da Silva' };
      const mockUserData = {
        id: 999, name: 'Johnatas Henrique', email: 'johnatas.henrique@gmail.com', password: '524288', role: 'false',
      };
      const mockReq = { body: mockBodyData, user: mockUserData };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const mockServiceAnswer = { code: 'unauthorized', error: true, message: 'User not found' };
      const usersFindByPkSpy = jest.spyOn(users, 'findByPk').mockReturnValueOnce(null);

      await userController.updateUserById(mockReq, mockRes, mockNext);

      expect(usersFindByPkSpy).toBeCalledTimes(1);
      expect(mockNext).toBeCalledWith(mockServiceAnswer);
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockJson).not.toHaveBeenCalled();
    });

    test('If pass valid info, return a status 200', async () => {
      const mockBodyData = { name: 'Johnatas Henrique da Silva' };
      const mockUserData = {
        id: 2, name: 'Johnatas Henrique', email: 'johnatas.henrique@gmail.com', password: '524288', role: 'false',
      };
      const mockReq = { body: mockBodyData, user: mockUserData };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const mockSequelize1 = { dataValues: mockUserData, ...mockUserData };
      const usersFindByPkSpy = jest.spyOn(users, 'findByPk').mockReturnValueOnce(mockSequelize1);
      const updateData = {
        id: 2, name: 'Johnatas Henrique da Silva', email: 'johnatas.henrique@gmail.com', password: '524288', role: 'false',
      };
      const mockSequelize2 = { dataValues: updateData, ...updateData };
      const usersUpdateSpy = jest.spyOn(users, 'update').mockReturnValueOnce(mockSequelize2);
      const usersFindOneSpy = jest.spyOn(users, 'findOne').mockReturnValueOnce(mockSequelize2);

      await userController.updateUserById(mockReq, mockRes, mockNext);

      expect(usersFindByPkSpy).toBeCalledTimes(1);
      expect(usersUpdateSpy).toBeCalledTimes(1);
      expect(usersFindOneSpy).toBeCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockJson).toBeCalledWith(mockSequelize2);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('Get Logged User Token Response', () => {
    test('Re-valid token and  all user info', async () => {
      const updateData = {
        id: 2, name: 'Johnatas Henrique', email: 'johnatas.henrique@gmail.com', password: '524288', role: 'false',
      };
      const mockReq = { user: updateData };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };

      await userController.getLoginUser(mockReq, mockRes);

      expect(mockRes.status).toBeCalledWith(200);
      expect(mockJson).toBeCalledWith({ token: updateData });
    });
  });
});
