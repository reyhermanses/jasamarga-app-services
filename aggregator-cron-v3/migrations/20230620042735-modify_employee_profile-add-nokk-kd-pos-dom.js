'use strict';

/** @type {import('sequelize-cli').Migration} */

require("dotenv").config();

const table = {
  schema: process.env.NODE_ENV,
  tableName: "employee_profile",
};

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(table, "no_kk", {
        type: Sequelize.STRING
      }),
      queryInterface.addColumn(table, "kd_pos_domicile", {
        type: Sequelize.STRING
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn(table, "no_kk"),
      queryInterface.removeColumn(table, "kd_pos_domicile"),
    ]);
  }
};
