'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
    queryInterface.createTable('venues', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      ownerId: {
        type: Sequelize.INTEGER
      },
      address: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }),
    queryInterface.addColumn('lapangans', 'venueId', 'integer'),
    queryInterface.addColumn('lapangans', 'fieldtypeId', 'integer'),
    queryInterface.addConstraint('lapangans', ['venueId'], {
      type: 'foreign key',
      name: 'lapangans_venueId_fkey',
      references: { //Required field
        table: 'venues',
        field: 'id'
      },
      onDelete: 'cascade'
    }),
    queryInterface.addConstraint('lapangans', ['fieldtypeId'], {
      type: 'foreign key',
      name: 'lapangans_fieldtypeId_fkey',
      references: { //Required field
        table: 'venues',
        field: 'id'
      },
      onDelete: 'cascade'
    }),
    queryInterface.removeColumn('lapangans', 'ownerId'),
    queryInterface.removeColumn('lapangans', 'fieldType')
  ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('venues');
  }
};