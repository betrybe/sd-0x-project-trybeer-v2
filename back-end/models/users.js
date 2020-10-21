const createUsersModel = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    name: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING },
  }, {
    createdAt: 'published',
    updatedAt: 'updated',
  });

  users.associate = (models) => {
    users.hasMany(models.sales, { foreignKey: 'user_id' });
  };

  return users;
};

module.exports = createUsersModel;
