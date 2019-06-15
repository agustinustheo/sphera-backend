'use strict';
module.exports = (sequelize, DataTypes) => {
  const jadwal = sequelize.define('jadwal', {
    lapanganId: DataTypes.INTEGER,
    date: {
      type: DataTypes.DATE
    },
    day: DataTypes.STRING,
    startTime: DataTypes.STRING,
    endTime: DataTypes.STRING,
  }, {});
  jadwal.associate = function(models) {
<<<<<<< HEAD
    // associations can be defined here
=======
    jadwal.hasOne(models.booking, { onDelete: 'cascade' });
>>>>>>> b3990da8476e02dc16147daae0bd85f5e602b4f9
  };
  return jadwal;
};