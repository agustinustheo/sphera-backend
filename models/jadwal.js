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
    // associations can be defined here
  };
  return jadwal;
};