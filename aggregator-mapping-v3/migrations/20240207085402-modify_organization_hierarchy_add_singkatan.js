'use strict';
/** @type {import('sequelize-cli').Migration} */
require("dotenv").config();
const table = {
  schema: process.env.NODE_ENV,
  tableName: "organization_hierarchy",
};
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(table, "singkatan", {
        type: Sequelize.STRING,
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      }),
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(table);
  }
};