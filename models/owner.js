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
<<<<<<< HEAD
    owner.hasMany(models.lapangan, { onDelete: 'cascade' });
=======
    owner.hasMany(models.venue, { onDelete: 'cascade' });
>>>>>>> b3990da8476e02dc16147daae0bd85f5e602b4f9
  };
  return owner;
};