require('mysql2/node_modules/iconv-lite').encodingExists('foo');
const saleController = require('./saleController');
const { sales, products, sales_products: salesProducts } = require('../models');

afterEach(() => jest.clearAllMocks());

describe('saleController tests', () => {
  describe('Get sale', () => {
    test('If pass invalid credentials, return a service message', async () => {
      const mockUserData = { id: 999, role: 'client' };
      const mockReq = { user: mockUserData };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const mockServiceAnswer = { error: true, message: 'No sale was found', code: 'not_found' };
      const salesFindAllSpy = jest.spyOn(sales, 'findAll').mockReturnValueOnce(null);

      await saleController.getSale(mockReq, mockRes, mockNext);

      expect(salesFindAllSpy).toBeCalledTimes(1);
      expect(mockNext).toBeCalledWith(mockServiceAnswer);
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockJson).not.toHaveBeenCalled();
    });

    test('If pass valid admin credentials, return sales and status 200', async () => {
      const mockUserData = { id: 1, role: 'administrator' };
      const mockReq = { user: mockUserData };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const salesData = [{
        saleId: 1, deliveryAddress: 'Rua das Flores', deliveryNumber: '1004', saleDate: '2020-09-01T20:42:06.000Z', totalPrice: '15.58', status: 'Pendente',
      }, {
        saleId: 2, deliveryAddress: 'Rua das Flores', deliveryNumber: '1004', saleDate: '2020-09-01T21:50:52.000Z', totalPrice: '15.58', status: 'Pendente',
      }, {
        saleId: 3, deliveryAddress: 'Rua dos Pinheiros', deliveryNumber: '303', saleDate: '2020-09-02T01:53:35.000Z', totalPrice: '19.40', status: 'Pendente',
      }];
      const mockSequelize = { dataValues: salesData, ...salesData };
      const salesFindAllSpy = jest.spyOn(sales, 'findAll').mockReturnValueOnce(mockSequelize);

      await saleController.getSale(mockReq, mockRes, mockNext);

      expect(salesFindAllSpy).toBeCalledTimes(1);
      expect(mockJson).toBeCalledWith(mockSequelize);
      expect(mockJson).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('If pass valid client credentials, return sales and status 200', async () => {
      const mockUserData = { id: 3, role: 'client' };
      const mockReq = { user: mockUserData };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const salesData = [{
        saleId: 3, deliveryAddress: 'Rua dos Pinheiros', deliveryNumber: '303', saleDate: '2020-09-02T01:53:35.000Z', totalPrice: '19.40', status: 'Pendente',
      }];
      const mockSequelize = { dataValues: salesData, ...salesData };
      const salesFindAllSpy = jest.spyOn(sales, 'findAll').mockReturnValueOnce(mockSequelize);

      await saleController.getSale(mockReq, mockRes, mockNext);

      expect(salesFindAllSpy).toBeCalledTimes(1);
      expect(mockJson).toBeCalledWith(mockSequelize);
      expect(mockJson).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('Create Sale', () => {
    test('If pass invalid requisition, return a Joi message and status 400', async () => {
      const mockBodyData = {
        products: [{ productId: 1, quantity: 3 }, { productId: 6, quantity: 2 }],
        deliveryAddress: 'Rua dos Alfeneiros',
      };
      const mockReq = { body: mockBodyData };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const mockJoiAnswer = { code: 'invalid_data', error: true, message: '"deliveryNumber" is required' };

      await saleController.createSale(mockReq, mockRes, mockNext);

      expect(mockNext).toBeCalledWith(mockJoiAnswer);
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockJson).not.toHaveBeenCalled();
    });

    test('If any product is not found in database, return message and status 422', async () => {
      const mockBodyData = {
        products: [{ productId: 1, quantity: 3 }, { productId: 999, quantity: 2 }],
        deliveryAddress: 'Rua dos Alfeneiros',
        deliveryNumber: '4',
      };
      const mockReq = { body: mockBodyData, user: { id: 2, name: 'Johnatas Henrique' } };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const mockServiceAnswer = { error: true, message: 'Some products can not be found', code: 'invalid_data' };
      const userData = [{
        id: 1, name: 'Skol Lata 250ml', price: '2.20', url_image: 'http://localhost:3001/images/Skol Lata 350ml.jpg', published: null, updated: null,
      }];
      const productsFindAllSpy = jest.spyOn(products, 'findAll').mockReturnValueOnce(userData);

      await saleController.createSale(mockReq, mockRes, mockNext);

      expect(productsFindAllSpy).toBeCalledTimes(1);
      expect(mockNext).toBeCalledWith(mockServiceAnswer);
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockJson).not.toHaveBeenCalled();
    });

    test('If all products are found, return a response and status 201', async () => {
      const mockBodyData = {
        products: [{ productId: 1, quantity: 3 }, { productId: 2, quantity: 2 }],
        deliveryAddress: 'Rua dos Alfeneiros',
        deliveryNumber: '4',
      };
      const mockReq = { body: mockBodyData, user: { id: 2, name: 'Johnatas Henrique' } };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const userData = [{
        id: 1,
        name: 'Skol Lata 250ml',
        price: '2.20',
        url_image: 'http://localhost:3001/images/Skol Lata 350ml.jpg',
        published: null,
        updated: null,
      }, {
        id: 2,
        name: 'Heineken 600ml',
        price: '7.50',
        url_image: 'http://localhost:3001/images/Heineken 600ml.jpg',
        published: null,
        updated: null,
      }];
      const productsFindAllSpy = jest.spyOn(products, 'findAll').mockReturnValueOnce(userData);
      const newSaleData = {
        id: 7, user_id: 3, total_price: 27.48, delivery_address: 'do x4', delivery_number: '1004', status: 'Pendente', updated: Date.now(), sale_date: Date.now(),
      };
      const salesCreateSpy = jest.spyOn(sales, 'create').mockReturnValueOnce(newSaleData);
      const salesProductsCreateSpy = jest.spyOn(salesProducts, 'create').mockReturnValue({
        sale_id: newSaleData.id, product_id: 1, quantity: 3,
      });
      const returnData = {
        date: newSaleData.sale_date, saleId: 7, total: 21.6, user: 'Johnatas Henrique',
      };

      await saleController.createSale(mockReq, mockRes, mockNext);

      expect(productsFindAllSpy).toBeCalledTimes(1);
      expect(salesCreateSpy).toBeCalledTimes(1);
      expect(salesProductsCreateSpy).toBeCalledTimes(2);
      expect(mockRes.status).toBeCalledWith(201);
      expect(mockJson).toBeCalledWith(returnData);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('Get products of sale by saleId', () => {
    test('If pass invalid credentials, return a service message', async () => {
      const mockUserData = { id: 999, role: 'client' };
      const mockReq = { user: mockUserData, params: { id: 2 } };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const mockServiceAnswer = { error: true, message: 'Products of this sale were not found', code: 'not_found' };
      const salesProductsFindAllSpy = jest.spyOn(salesProducts, 'findAll').mockReturnValueOnce([]);

      await saleController.getSaleProducts(mockReq, mockRes, mockNext);

      expect(salesProductsFindAllSpy).toBeCalledTimes(1);
      expect(mockNext).toBeCalledWith(mockServiceAnswer);
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockJson).not.toHaveBeenCalled();
    });

    test('If pass valid admin credentials, return sales and status 200', async () => {
      const mockUserData = { id: 1, role: 'administrator' };
      const mockReq = { user: mockUserData, params: { id: 2 } };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const salesData = [{
        sale_id: 2, quantity: 3, product: { name: 'Skol Lata 250ml', price: '2.20' }, sale: { sale_date: '2020-09-07T17:58:57.000Z', status: 'Pendente', total_price: '21.60' },
      }, {
        sale_id: 2, quantity: 2, product: { name: 'Heineken 600ml', price: '7.50' }, sale: { sale_date: '2020-09-07T17:58:57.000Z', status: 'Pendente', total_price: '21.60' },
      }];
      const returnData = [{
        name: 'Skol Lata 250ml', price: '2.20', quantity: 3, saleDate: '2020-09-07T17:58:57.000Z', saleId: 2, status: 'Pendente', totalPrice: '21.60',
      }, {
        name: 'Heineken 600ml', price: '7.50', quantity: 2, saleDate: '2020-09-07T17:58:57.000Z', saleId: 2, status: 'Pendente', totalPrice: '21.60',
      }];
      const salesProductsFindAllSpy = jest.spyOn(salesProducts, 'findAll').mockReturnValueOnce(salesData);

      await saleController.getSaleProducts(mockReq, mockRes, mockNext);

      expect(salesProductsFindAllSpy).toBeCalledTimes(1);
      expect(mockJson).toBeCalledWith(returnData);
      expect(mockJson).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('If pass valid client credentials, return sales and status 200', async () => {
      const mockUserData = { id: 3, role: 'client' };
      const mockReq = { user: mockUserData, params: { id: 2 } };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const salesData = [{
        sale_id: 2, quantity: 3, product: { name: 'Skol Lata 250ml', price: '2.20' }, sale: { sale_date: '2020-09-07T17:58:57.000Z', status: 'Pendente', total_price: '21.60' },
      }, {
        sale_id: 2, quantity: 2, product: { name: 'Heineken 600ml', price: '7.50' }, sale: { sale_date: '2020-09-07T17:58:57.000Z', status: 'Pendente', total_price: '21.60' },
      }];
      const returnData = [{
        name: 'Skol Lata 250ml', price: '2.20', quantity: 3, saleDate: '2020-09-07T17:58:57.000Z', saleId: 2, status: 'Pendente', totalPrice: '21.60',
      }, {
        name: 'Heineken 600ml', price: '7.50', quantity: 2, saleDate: '2020-09-07T17:58:57.000Z', saleId: 2, status: 'Pendente', totalPrice: '21.60',
      }];
      const salesProductsFindAllSpy = jest.spyOn(salesProducts, 'findAll').mockReturnValueOnce(salesData);

      await saleController.getSaleProducts(mockReq, mockRes, mockNext);

      expect(salesProductsFindAllSpy).toBeCalledTimes(1);
      expect(mockJson).toBeCalledWith(returnData);
      expect(mockJson).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('Update Sale By Id', () => {
    test('If pass user role, return a service message', async () => {
      const mockBodyData = { status: 'Entregue' };
      const mockReq = { body: mockBodyData, user: { role: 'user' }, params: { id: 2 } };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const mockServiceAnswer = { code: 'unauthorized', error: true, message: 'Access denied' };

      await saleController.updateSaleById(mockReq, mockRes, mockNext);

      expect(mockNext).toBeCalledWith(mockServiceAnswer);
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockJson).not.toHaveBeenCalled();
    });

    test('If pass admin role but wrong saleId, return a service message', async () => {
      const mockBodyData = { status: 'Entregue' };
      const mockReq = { body: mockBodyData, user: { role: 'administrator' }, params: { id: 99 } };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const mockServiceAnswer = { error: true, message: 'No sale was found', code: 'not_found' };
      const salesFindByPkSpy = jest.spyOn(sales, 'findByPk').mockReturnValueOnce(null);

      await saleController.updateSaleById(mockReq, mockRes, mockNext);

      expect(salesFindByPkSpy).toBeCalledTimes(1);
      expect(mockNext).toBeCalledWith(mockServiceAnswer);
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockJson).not.toHaveBeenCalled();
    });

    test('If pass admin role and correct saleId, return a status 200', async () => {
      const mockBodyData = { status: 'Entregue' };
      const mockReq = { body: mockBodyData, user: { role: 'administrator' }, params: { id: 2 } };
      const mockJson = jest.fn();
      const mockRes = { status: jest.fn().mockReturnValueOnce({ json: mockJson }) };
      const mockNext = jest.fn();
      const findData1 = {
        id: 2, total_price: '21.60', delivery_address: 'do x4', delivery_number: '1004', status: 'Pendente', sale_date: Date.now(), updated: Date.now(), user_id: 3,
      };
      const findData2 = {
        id: 2, total_price: '21.60', delivery_address: 'do x4', delivery_number: '1004', status: 'Entregue', sale_date: Date.now(), updated: Date.now(), user_id: 3,
      };
      const salesFindByPkSpy = jest.spyOn(sales, 'findByPk').mockReturnValueOnce(findData1);
      const salesUpdateSpy = jest.spyOn(sales, 'update').mockReturnValueOnce(null);
      const salesFindOneSpy = jest.spyOn(sales, 'findOne').mockReturnValueOnce(findData2);

      await saleController.updateSaleById(mockReq, mockRes, mockNext);

      expect(salesFindByPkSpy).toBeCalledTimes(1);
      expect(salesUpdateSpy).toBeCalledTimes(1);
      expect(salesFindOneSpy).toBeCalledTimes(1);
      expect(mockRes.status).toBeCalledWith(200);
      expect(mockJson).toBeCalledWith(findData2);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
