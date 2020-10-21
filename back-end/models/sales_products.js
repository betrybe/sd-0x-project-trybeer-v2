const createSalesProductsModel = (sequelize, DataTypes) => {
  const salesProducts = sequelize.define('sales_products', {
    quantity: { type: DataTypes.INTEGER },
  }, { timestamps: false });

  salesProducts.associate = (models) => {
    salesProducts.belongsTo(models.sales, {
      through: 'sales-products', foreignKey: 'sale_id', otherKey: 'product_id',
    });
    salesProducts.belongsTo(models.products, {
      through: 'sales-products', foreignKey: 'product_id', otherKey: 'sale_id',
    });
  };

  return salesProducts;
};

module.exports = createSalesProductsModel;
