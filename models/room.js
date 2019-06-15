'use strict';
module.exports = (sequelize, DataTypes) => {
  const room = sequelize.define('room', {
    bookingId: DataTypes.INTEGER,
    playerId: DataTypes.INTEGER
  }, {});
  room.associate = function(models) {
    // associations can be defined here
  };
  return room;
};