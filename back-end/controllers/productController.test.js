const productController = require('./productController');
const { products } = require('../models');

afterEach(() => jest.clearAllMocks());

describe('productController tests', () => {
  describe('Get All Products', () => {
    test('If pass valid credentials, return a token and status 200', async () => {
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const productData = [
        {
          id: 1, name: 'Skol Lata 250ml', price: '2.20', urlImage: 'http://localhost:3001/images/Skol Lata 350ml.jpg',
        }, {
          id: 2, name: 'Heineken 600ml', price: '7.50', urlImage: 'http://localhost:3001/images/Heineken 600ml.jpg',
        }, {
          id: 3, name: 'Antarctica Pilsen 300ml', price: '2.49', urlImage: 'http://localhost:3001/images/Antarctica Pilsen 300ml.jpg',
        },
      ];
      const usersFindAllSpy = jest.spyOn(products, 'findAll').mockReturnValueOnce(productData);

      await productController.getAllProducts(null, mockRes, null);

      expect(usersFindAllSpy).toBeCalledTimes(1);
      expect(mockNext).not.toBeCalled();
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockJson).toBeCalledWith(productData);
    });
  });

  describe('Get Product By Id', () => {
    test('If pass a product who is not in the database, return message and status 404', async () => {
      const mockReq = { params: { id: 999 } };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const usersFindOneSpy = jest.spyOn(products, 'findOne').mockReturnValueOnce(null);
      const mockServiceAnswer = { error: true, message: 'Product not found', code: 'not_found' };

      await productController.getProductById(mockReq, mockRes, mockNext);

      expect(usersFindOneSpy).toBeCalledTimes(1);
      expect(mockNext).toBeCalledWith(mockServiceAnswer);
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockJson).not.toHaveBeenCalled();
    });

    test('If pass a product who is in the database, return product and status 200', async () => {
      const mockReq = { params: { id: 1 } };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const calledWithData = {
        attributes: ['id', 'name', 'price', ['url_image', 'urlImage']],
        where: { id: mockReq.params.id },
      };
      const productData = {
        id: 1, name: 'Skol Lata 250ml', price: '2.20', urlImage: 'http://localhost:3001/images/Skol Lata 350ml.jpg',
      };
      const usersFindOneSpy = jest.spyOn(products, 'findOne').mockReturnValueOnce(productData);

      await productController.getProductById(mockReq, mockRes, mockNext);

      expect(usersFindOneSpy).toBeCalledTimes(1);
      expect(usersFindOneSpy).toBeCalledWith(calledWithData);
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockJson).toBeCalledWith(productData);
    });
  });
});
