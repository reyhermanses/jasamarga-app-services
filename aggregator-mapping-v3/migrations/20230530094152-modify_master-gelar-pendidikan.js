'use strict';

/** @type {import('sequelize-cli').Migration} */

require("dotenv").config();

const table = {
  schema: process.env.NODE_ENV,
  tableName: "master_gelar_pendidikan",
};

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(table, "type", {
        type: Sequelize.ENUM('Strata 1', 'Strata 2', 'Strata 3')
      }),
      queryInterface.addColumn(table, "gelar", {
        type: Sequelize.STRING
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn(table, "type"),
      queryInterface.removeColumn(table, "gelar")
    ]);
  },
};
