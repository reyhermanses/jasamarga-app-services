'use strict';

/** @type {import('sequelize-cli').Migration} */

require("dotenv").config();

const table = {
  schema: process.env.NODE_ENV,
  tableName: "history_jabatan",
};

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(table, "file_sk", {
        type: Sequelize.TEXT
      }),
      queryInterface.addColumn(table, "sk_position_date", {
        type: Sequelize.DATE
      }),
      queryInterface.addColumn(table, "action", {
        type: Sequelize.STRING
      }),
      queryInterface.addColumn(table, "is_main", {
        type: Sequelize.BOOLEAN
      }),
      queryInterface.addColumn(table, "info", {
        type: Sequelize.STRING
      })
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn(table, "file_sk"),
      queryInterface.removeColumn(table, "action"),
      queryInterface.removeColumn(table, "is_main"),
      queryInterface.removeColumn(table, "info"),
      queryInterface.removeColumn(table, "sk_position_date"),
    ]);
  }
};
