'use strict';
module.exports = (sequelize, DataTypes) => {
  const owner = sequelize.define('owner', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    imageDir: DataTypes.STRING,
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    }
  }, {});
  owner.associate = function(models) {
    owner.hasMany(models.lapangan, { onDelete: 'cascade' });
  };
  return owner;
};