const { MongoClient } = require('mongodb');
const chatController = require('./chatController');
const ChatModel = require('../mongoModels/ChatModel');

afterEach(() => jest.clearAllMocks());

const mockGetDB = (result, insertResult) => ({
  db: () => ({
    collection: () => ({
      aggregate: () => ({
        toArray: jest.fn().mockResolvedValue(result),
      }),
      findOne: jest.fn().mockResolvedValue(result),
      insertOne: jest.fn().mockResolvedValue({ ops: [insertResult || result] }),
      updateOne: jest.fn().mockResolvedValue(result),
    }),
  }),
});

describe('chatController tests', () => {
  describe('Get All Chats', () => {
    it('is returning an ordered array by date', async () => {
      const mockResponse = [
        {
          messages: [
            {
              chatName: 'cliente@cliente.com',
              sentMessage: 'fala mano',
              time: 1600205240920,
            },
          ],
        },
      ];

      const mockJson = jest.fn();
      const mockNext = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };

      const bdMock = mockGetDB(mockResponse);
      jest.spyOn(MongoClient, 'connect')
        .mockResolvedValueOnce(bdMock);

      await chatController.getAllChats(null, mockRes, mockNext);

      expect(mockNext).toBeCalledTimes(0);
      expect(MongoClient.connect).toBeCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(200);
    });
    it('is returning an error', async () => {
      const mockJson = jest.fn();
      const mockNext = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };

      jest
        .spyOn(ChatModel, 'getAllChats')
        .mockImplementationOnce(() => {
          throw new Error('Oooops!');
        });

      await chatController.getAllChats(null, mockRes, mockNext);

      expect(mockNext).toBeCalledTimes(1);
      expect(ChatModel.getAllChats).toBeCalledTimes(1);
    });
  });
  describe('Admin Client Message', () => {
    it('is returning status code 200', async () => {
      const mockResponse = [
        {
          messages: [
            {
              chatName: 'cliente@cliente.com',
              sentMessage: 'fala mano',
              time: 1600205240920,
            },
          ],
        },
      ];
      const mockReqBody = { body: { message: 'hellow', emailClient: 'jctaraujo@hotmail.com' } };
      const mockEnd = jest.fn();
      const mockNext = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce(mockEnd) };

      const bdMock = mockGetDB(mockResponse);
      jest.spyOn(MongoClient, 'connect')
        .mockResolvedValueOnce(bdMock);

      await chatController.adminClientMessage(mockReqBody, mockRes, mockNext);

      expect(mockNext).toBeCalledTimes(1);
      expect(MongoClient.connect).toBeCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(200);
    });
    it('is returning an error', async () => {
      const mockReqBody = { body: { message: 'hellow', emailClient: 'jctaraujo@hotmail.com' } };
      const mockJson = jest.fn();
      const mockNext = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };

      jest
        .spyOn(ChatModel, 'updateAdminMessage')
        .mockImplementationOnce(() => {
          throw new Error('Oooops!');
        });

      await chatController.adminClientMessage(mockReqBody, mockRes, mockNext);

      expect(mockNext).toBeCalledTimes(1);
      expect(ChatModel.updateAdminMessage).toBeCalledTimes(1);
    });
  });
  describe('clientAdminMessage', () => {
    it('is email exist and return status code 200', async () => {
      const mockResponse = [
        {
          messages: [
            {
              chatName: 'cliente@cliente.com',
              sentMessage: 'fala mano',
              time: 1600205240920,
            },
          ],
        },
      ];
      const mockReqBody = {
        body: {
          message: 'hellow',
          userData: {
            email: 'jctaraujo@hotmail.com',
          },
        },
      };
      const mockEnd = jest.fn();
      const mockNext = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce(mockEnd) };

      const bdMock = mockGetDB(mockResponse);
      jest.spyOn(MongoClient, 'connect')
        .mockResolvedValueOnce(bdMock);
      jest.spyOn(MongoClient, 'connect')
        .mockResolvedValueOnce(bdMock);

      await chatController.clientAdminMessage(mockReqBody, mockRes, mockNext);

      expect(mockNext).toBeCalledTimes(1);
      expect(MongoClient.connect).toBeCalledTimes(2);
      expect(mockRes.status).toBeCalledWith(200);
    });
    it('is email exist and returning an error', async () => {
      const mockResponse = [
        {
          messages: [
            {
              chatName: 'cliente@cliente.com',
              sentMessage: 'fala mano',
              time: 1600205240920,
            },
          ],
        },
      ];
      const mockReqBody = {
        body: {
          message: 'hellow',
          userData: {
            email: 'jctaraujo@hotmail.com',
          },
        },
      };
      const mockEnd = jest.fn();
      const mockNext = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce(mockEnd) };

      const bdMock = mockGetDB(mockResponse);
      jest.spyOn(MongoClient, 'connect')
        .mockResolvedValueOnce(bdMock);

      jest
        .spyOn(ChatModel, 'updateEmailMessage')
        .mockImplementationOnce(() => {
          throw new Error('Oooops!');
        });

      await chatController.clientAdminMessage(mockReqBody, mockRes, mockNext);

      expect(mockNext).toBeCalledTimes(1);
      expect(ChatModel.updateEmailMessage).toBeCalledTimes(1);
    });
    it('is email dont exist and return status code 200', async () => {
      const mockResponse = [
        {
          messages: [
            {
              chatName: 'cliente@cliente.com',
              sentMessage: 'fala mano',
              time: 1600205240920,
            },
          ],
        },
      ];
      const mockReqBody = {
        body: {
          message: 'hellow',
          userData: {
            email: 'jctaraujo@hotmail.com',
          },
        },
      };
      const mockEnd = jest.fn();
      const mockNext = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce(mockEnd) };

      const bdMock = mockGetDB(mockResponse);
      jest.spyOn(MongoClient, 'connect')
        .mockResolvedValueOnce(bdMock);

      jest
        .spyOn(ChatModel, 'emailSchemaExist')
        .mockReturnValueOnce(null);

      await chatController.clientAdminMessage(mockReqBody, mockRes, mockNext);

      expect(mockNext).toBeCalledTimes(1);
      expect(ChatModel.emailSchemaExist).toBeCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(200);
    });
    it('if email dont exist and returning an error', async () => {
      const mockReqBody = {
        body: {
          message: 'hellow',
          userData: {
            email: 'jctaraujo@hotmail.com',
          },
        },
      };
      const mockEnd = jest.fn();
      const mockNext = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce(mockEnd) };

      jest
        .spyOn(ChatModel, 'emailSchemaExist')
        .mockReturnValueOnce(null);

      jest
        .spyOn(ChatModel, 'registerMessages')
        .mockImplementationOnce(() => {
          throw new Error('Oooops!');
        });

      await chatController.clientAdminMessage(mockReqBody, mockRes, mockNext);

      expect(mockNext).toBeCalledTimes(1);
      expect(ChatModel.registerMessages).toBeCalledTimes(1);
    });
  });
  describe('Testing getChatByEmail', () => {
    it('Test if service catch if client try acess other client history', async () => {
      const mockResponse = [
        {
          messages: [
            {
              chatName: 'cliente@cliente.com',
              sentMessage: 'fala mano',
              time: 1600205240920,
            },
          ],
        },
      ];
      const mockReq = {
        params: { email: 'cliente2@cliente.com' },
        user: { email: 'cliente@cliente.com', role: 'client' },
      };
      const mockJson = jest.fn();
      const mockNext = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };

      jest
        .spyOn(ChatModel, 'findClientByEmail')
        .mockReturnValueOnce(mockResponse);

      await chatController.getChatByEmail(mockReq, mockRes, mockNext);

      expect(mockNext).toBeCalledTimes(1);
      expect(ChatModel.findClientByEmail).toBeCalledTimes(0);
    });
    it('Test if returning status code 200 and an json', async () => {
      const mockResponse = [
        {
          messages: [
            {
              chatName: 'cliente@cliente.com',
              sentMessage: 'fala mano',
              time: 1600205240920,
            },
          ],
        },
      ];
      const mockReq = {
        params: { email: 'cliente2@cliente.com' },
        user: { email: 'cliente2@cliente.com', role: 'client' },
      };
      const mockJson = jest.fn();
      const mockNext = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };

      jest.restoreAllMocks();

      const bdMock = mockGetDB(mockResponse);
      jest.spyOn(MongoClient, 'connect')
        .mockResolvedValueOnce(bdMock);

      await chatController.getChatByEmail(mockReq, mockRes, mockNext);

      expect(mockNext).toBeCalledTimes(0);
      expect(MongoClient.connect).toBeCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(200);
    });
    it('Test if bd isnt responding', async () => {
      const mockReq = {
        params: { email: 'cliente2@cliente.com' },
        user: { email: 'cliente2@cliente.com', role: 'client' },
      };
      const mockJson = jest.fn();
      const mockNext = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };

      jest.restoreAllMocks();

      jest
        .spyOn(ChatModel, 'findClientByEmail')
        .mockImplementationOnce(() => {
          throw new Error('internal_error');
        });

      await chatController.getChatByEmail(mockReq, mockRes, mockNext);

      expect(mockNext).toBeCalledTimes(1);
      expect(ChatModel.findClientByEmail).toBeCalledTimes(1);
    });
  });
});
