'use strict';
/** @type {import('sequelize-cli').Migration} */
require("dotenv").config();
const table = {
  schema: process.env.NODE_ENV,
  tableName: "employee_family",
};
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(table, "dependent_tax_purpose", {
        type: Sequelize.STRING
      }),
      queryInterface.addColumn(table, "bpjs_dependent_type", {
        type: Sequelize.STRING
      }),
      queryInterface.addColumn(table, "no_bpjs", {
        type: Sequelize.STRING
      }),
      queryInterface.addColumn(table, "benefit_class", {
        type: Sequelize.STRING
      }),
      queryInterface.addColumn(table, "id_card_type", {
        type: Sequelize.STRING
      }),
      queryInterface.addColumn(table, "id_card_number", {
        type: Sequelize.STRING
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn(table, "dependent_tax_purpose"),
      queryInterface.removeColumn(table, "bpjs_dependent_type"),
      queryInterface.removeColumn(table, "no_bpjs"),
      queryInterface.removeColumn(table, "benefit_class"),
      queryInterface.removeColumn(table, "id_card_type"),
      queryInterface.removeColumn(table, "id_card_number"),
    ]);
  }
};
