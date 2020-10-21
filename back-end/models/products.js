const createProductsModel = (sequelize, DataTypes) => {
  const products = sequelize.define('products', {
    name: { type: DataTypes.STRING },
    price: { type: DataTypes.DECIMAL(4, 2) },
    url_image: { type: DataTypes.STRING },
  }, {
    createdAt: 'published',
    updatedAt: 'updated',
  });

  products.associate = (models) => {
    products.belongsToMany(models.sales, {
      through: 'sales-products', foreignKey: 'sale_id', otherKey: 'product_id',
    });
  };

  return products;
};

module.exports = createProductsModel;
