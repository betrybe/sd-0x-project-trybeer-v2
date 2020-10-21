const { Op } = require('sequelize');
const { products, sales, sales_products: salesProducts } = require('../models');

const createSale = async (sale, userId, name) => {
  const { products: quantities, deliveryAddress, deliveryNumber } = sale;
  const productIds = quantities.map(({ productId }) => productId);
  const productsInfo = await products.findAll({ where: { id: { [Op.in]: productIds } } });
  if (productsInfo.length !== quantities.length) {
    return { error: true, message: 'Some products can not be found', code: 'invalid_data' };
  }
  const totalPrice = productsInfo.reduce((total, product) => {
    const productQuantity = quantities.find((quantity) => quantity.productId === product.id);
    return total + (productQuantity.quantity * product.price);
  }, 0);

  const newSale = await sales.create({
    user_id: userId, total_price: totalPrice, delivery_address: deliveryAddress, delivery_number: deliveryNumber, status: 'Pendente',
  });

  await quantities.forEach(async ({ productId, quantity }) => salesProducts
    .create({ sale_id: newSale.id, product_id: productId, quantity }));

  return {
    user: name, saleId: newSale.id, date: newSale.sale_date, total: totalPrice,
  };
};

const getSale = async (id, role) => {
  let result;
  if (role === 'client') {
    result = await sales.findAll(
      {
        where: { user_id: id },
        attributes: [
          ['id', 'saleId'], ['delivery_address', 'deliveryAddress'], ['delivery_number', 'deliveryNumber'], ['sale_date', 'saleDate'], ['total_price', 'totalPrice'], 'status',
        ],
      },
    );
  }
  if (role === 'administrator') {
    result = await sales.findAll({
      attributes: [
        ['id', 'saleId'], ['delivery_address', 'deliveryAddress'], ['delivery_number', 'deliveryNumber'], ['sale_date', 'saleDate'], ['total_price', 'totalPrice'], 'status',
      ],
    });
  }
  if (!result) return { error: true, message: 'No sale was found', code: 'not_found' };
  return result;
};

const getSaleProducts = async (role, userId, saleIdParam) => {
  let result;
  if (role === 'client') {
    result = await salesProducts.findAll({
      where: { sale_id: saleIdParam },
      attributes: ['quantity', 'sale_id'],
      include: [{ model: sales, where: { user_id: userId }, attributes: ['total_price', 'sale_date', 'status'] }, { model: products, attributes: ['name', 'price'] }],
    });
  }

  if (role === 'administrator') {
    result = await salesProducts.findAll({
      where: { sale_id: saleIdParam },
      attributes: ['quantity', 'sale_id'],
      include: [{ model: sales, attributes: ['total_price', 'sale_date', 'status'] }, { model: products, attributes: ['name', 'price'] }],
    });
  }
  if (!result.length) return { error: true, message: 'Products of this sale were not found', code: 'not_found' };

  return result.map(({
    sale_id: saleId, quantity,
    product: { name, price }, sale: { sale_date: saleDate, status, total_price: totalPrice },
  }) => ({
    saleId, quantity, name, price, saleDate, status, totalPrice,
  }));
};

const updateSaleById = async (saleId, role, status) => {
  if (role !== 'administrator') {
    return { error: true, message: 'Access denied', code: 'unauthorized' };
  }
  const result = await sales.findByPk(saleId);
  if (!result) return { error: true, message: 'No sale was found', code: 'not_found' };
  await sales.update({ status }, { where: { id: saleId } });
  const response = await sales.findOne({
    where: { id: saleId },
    attributes: { exclude: ['published', 'updated'] },
  });
  return response;
};

module.exports = {
  createSale,
  getSale,
  getSaleProducts,
  updateSaleById,
};
