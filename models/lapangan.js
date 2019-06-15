'use strict';
module.exports = (sequelize, DataTypes) => {
  const lapangan = sequelize.define('lapangan', {
    ownerId: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    fieldtypeId: DataTypes.INTEGER
  }, {});
  lapangan.associate = function(models) {
    lapangan.hasMany(models.jadwal, { onDelete: 'cascade' });
  };
  return lapangan;
};