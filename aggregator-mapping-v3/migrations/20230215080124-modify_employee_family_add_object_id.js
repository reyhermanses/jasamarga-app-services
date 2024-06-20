'use strict';

/** @type {import('sequelize-cli').Migration} */
require('dotenv').config();

const table = {
  schema: process.env.NODE_ENV,
  tableName: 'employee_family'
};
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn(table, 'object_id', {
      type: Sequelize.INTEGER
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn(
      table, 'object_id'
    );
  }
};
