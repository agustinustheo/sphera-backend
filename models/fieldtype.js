'use strict';
module.exports = (sequelize, DataTypes) => {
  const fieldtype = sequelize.define('fieldtype', {
    name: DataTypes.STRING
  }, {});
  fieldtype.associate = function(models) {
    fieldtype.hasMany(models.lapangan, { onDelete: 'cascade' });
  };
  return fieldtype;
};