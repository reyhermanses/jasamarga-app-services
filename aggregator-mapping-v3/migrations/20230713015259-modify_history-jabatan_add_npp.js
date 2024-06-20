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
      queryInterface.addColumn(table, "npp", {
        type: Sequelize.STRING
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn(table, "npp"),
    ]);
  }
};
