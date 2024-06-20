'use strict';
/** @type {import('sequelize-cli').Migration} */
require("dotenv").config();
const table = {
  schema: process.env.NODE_ENV,
  tableName: "master_grade_level",
};
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(table, "kelompok_jabatan", {
        type: Sequelize.ENUM('Operasional', 'Non Operasional')
      }),
    ]);
  },
  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn(table, "kelompok_jabatan"),
    ]);
  }
};