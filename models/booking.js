'use strict';
module.exports = (sequelize, DataTypes) => {
  const booking = sequelize.define('booking', {
    jadwalId: DataTypes.INTEGER,
    playerId: DataTypes.INTEGER
  }, {});
  booking.associate = function(models) {
    booking.hasMany(models.room, { onDelete: 'cascade' });
  };
  return booking;
};