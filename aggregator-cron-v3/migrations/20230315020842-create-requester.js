'use strict';
/** @type {import('sequelize-cli').Migration} */

require('dotenv').config();

const table = {
  schema: process.env.NODE_ENV,
  tableName: 'requester'
};


module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(table, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      key: {
        type: Sequelize.STRING
      },
      created_by: {
        type: Sequelize.STRING(100),
      },
      created_at: {
        type: Sequelize.DATE
      },
      updated_by: {
        type: Sequelize.STRING(100)
      },
      updated_at: {
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(table);
  }
};