'use strict';
module.exports = (sequelize, DataTypes) => {
  const venue = sequelize.define('venue', {
    name: DataTypes.STRING,
    ownerId: DataTypes.INTEGER,
    address: DataTypes.STRING
  }, {});
  venue.associate = function(models) {
    // associations can be defined here
  };
  return venue;
};