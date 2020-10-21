const { promiseErrors, endpointNotFound } = require('./errorController');

describe('Errors middleware tests', () => {
  test('if returns response with status code and message when status code is not 500', async () => {
    const errMsgAndResponse = { error: true, message: '"email" must be a valid email', code: 'bad_request' };
    const mockJson = jest.fn();
    const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };

    await promiseErrors(errMsgAndResponse, null, mockRes, null);

    expect(mockRes.status).toBeCalledWith(400);
    expect(mockJson).toBeCalledWith({ error: errMsgAndResponse });
  });

  test('if returns response with status code and message when status code is 500', async () => {
    const errMsg = { message: 'connect ECONNREFUSED 127.0.0.1:3306' };
    const mockJson = jest.fn();
    const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
    const response = { error: true, message: 'connect ECONNREFUSED 127.0.0.1:3306', code: 'internal_error' };

    await promiseErrors(errMsg, null, mockRes, null);

    expect(mockRes.status).toBeCalledWith(500);
    expect(mockJson).toBeCalledWith({ error: response });
  });

  test('if no endpoint was found, return an error stating this', async () => {
    const errMsgAndResponse = { error: true, message: 'The endpoint wasn\'t found', code: 'not_found' };
    const mockJson = jest.fn();
    const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };

    await endpointNotFound(null, mockRes);

    expect(mockRes.status).toBeCalledWith(404);
    expect(mockJson).toBeCalledWith({ error: errMsgAndResponse });
  });
});
