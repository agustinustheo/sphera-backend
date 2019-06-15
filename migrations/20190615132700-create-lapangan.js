'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('lapangans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ownerId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'owners',
          key: 'id',
          deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        }
      },
      price: {
        type: Sequelize.INTEGER
      },
      fieldType: {
        type: Sequelize.INTEGER,
        references: {
          model: 'fieldtypes',
          key: 'id',
          deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('lapangans');
  }
};