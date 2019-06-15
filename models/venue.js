'use strict';
module.exports = (sequelize, DataTypes) => {
  const venue = sequelize.define('venue', {
    name: DataTypes.STRING,
    ownerId: DataTypes.INTEGER,
    address: DataTypes.STRING
  }, {});
  venue.associate = function(models) {
<<<<<<< HEAD
    // associations can be defined here
=======
    venue.hasMany(models.lapangan, { onDelete: 'cascade' });
>>>>>>> b3990da8476e02dc16147daae0bd85f5e602b4f9
  };
  return venue;
};