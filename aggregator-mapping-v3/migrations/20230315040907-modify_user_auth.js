'use strict';

/** @type {import('sequelize-cli').Migration} */
require('dotenv').config();

const table = {
  schema: process.env.NODE_ENV,
  tableName: 'user_auth'
};
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(table, 'default_password', {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      })
    ]);
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn(
        table, 'default_password'
      )
    ])
  }
};
