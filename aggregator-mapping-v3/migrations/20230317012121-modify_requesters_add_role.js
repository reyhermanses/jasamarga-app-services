'use strict';

/** @type {import('sequelize-cli').Migration} */
require('dotenv').config();

const table = {
  schema: process.env.NODE_ENV,
  tableName: 'requester'
};

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(table, 'role', {
        type: Sequelize.ENUM('Admin', 'Non-Admin'),
      }),
    ]);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn(
        table, 'role'
      )
    ])
  }
};
