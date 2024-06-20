'use strict';
require("dotenv").config();
const table = {
  schema: process.env.NODE_ENV,
  tableName: "pending_requests",
};
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(table, "personnel_number", {
        type: Sequelize.STRING
      }),

      queryInterface.addColumn(table, "subtype", {
        type: Sequelize.STRING
      }),

      queryInterface.addColumn(table, "valid_from", {
        type: Sequelize.STRING
      }),

      queryInterface.addColumn(table, "valid_to", {
        type: Sequelize.STRING
      }),

      queryInterface.addColumn(table, "doc_type", {
        type: Sequelize.STRING
      }),

      queryInterface.addColumn(table, "doc_country", {
        type: Sequelize.STRING
      }),

      queryInterface.addColumn(table, "doc_number", {
        type: Sequelize.STRING
      }),

      queryInterface.addColumn(table, "issue_date", {
        type: Sequelize.STRING
      }),

      queryInterface.addColumn(table, "issue_place", {
        type: Sequelize.STRING
      }),

      queryInterface.addColumn(table, "issue_ctry", {
        type: Sequelize.STRING
      }),

      queryInterface.addColumn(table, "doc_status", {
        type: Sequelize.STRING
      }),

      queryInterface.addColumn(table, "location", {
        type: Sequelize.STRING
      }),

      queryInterface.addColumn(table, "tanggal_efektif_sk", {
        type: Sequelize.STRING
      }),
    ])
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn(table, "personnel_number"),
      queryInterface.removeColumn(table, "subtype"),
      queryInterface.removeColumn(table, "valid_from"),
      queryInterface.removeColumn(table, "valid_to"),
      queryInterface.removeColumn(table, "doc_type"),
      queryInterface.removeColumn(table, "doc_country"),
      queryInterface.removeColumn(table, "doc_number"),
      queryInterface.removeColumn(table, "issue_date"),
      queryInterface.removeColumn(table, "issue_place"),
      queryInterface.removeColumn(table, "issue_ctry"),
      queryInterface.removeColumn(table, "doc_status"),
      queryInterface.removeColumn(table, "location"),
      queryInterface.removeColumn(table, "tanggal_efektif_sk"),
    ]);
  }
};
