'use strict';
/** @type {import('sequelize-cli').Migration} */
require("dotenv").config();
const table = {
  schema: process.env.NODE_ENV,
  tableName: "master_company",
};
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(table, "org_id", {
        type: Sequelize.INTEGER,
        references: {
          model: "organization_hierarchy",
          key: "id",
        },
        onUpdate: "SET NULL",
        onDelete: "SET NULL",
      }),
    ]);
  },
  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn(table, "org_id"),
    ]);
  }
};