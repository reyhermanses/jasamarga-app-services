'use strict';
/** @type {import('sequelize-cli').Migration} */
require("dotenv").config();
const table = {
  schema: process.env.NODE_ENV,
  tableName: "approver",
};
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(table, "org_approver", {
        type: Sequelize.STRING
      }),
      queryInterface.addColumn(table, "org_text_approver", {
        type: Sequelize.STRING
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn(table, "org_approver"),
      queryInterface.removeColumn(table, "org_text_approver"),
    ]);
  }
};
