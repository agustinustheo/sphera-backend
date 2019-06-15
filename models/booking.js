'use strict';
module.exports = (sequelize, DataTypes) => {
  const booking = sequelize.define('booking', {
    jadwalId: DataTypes.INTEGER,
    playerId: DataTypes.INTEGER
  }, {});
  booking.associate = function(models) {
<<<<<<< HEAD
    // associations can be defined here
=======
    booking.hasMany(models.room, { onDelete: 'cascade' });
>>>>>>> b3990da8476e02dc16147daae0bd85f5e602b4f9
  };
  return booking;
};