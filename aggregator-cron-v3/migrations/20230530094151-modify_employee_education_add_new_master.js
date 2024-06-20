"use strict";

/** @type {import('sequelize-cli').Migration} */

require("dotenv").config();

const table = {
  schema: process.env.NODE_ENV,
  tableName: "employee_education",
};

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(table, "instansi_pendidikan_id", {
        type: Sequelize.INTEGER,
        references: {
          model: "master_instansi_pendidikan",
          key: "id",
        },
        onUpdate: "SET NULL",
        onDelete: "SET NULL",
      }),
      queryInterface.addColumn(table, "fakultas_pendidikan_id", {
        type: Sequelize.INTEGER,
        references: {
          model: "master_fakultas_pendidikan",
          key: "id",
        },
        onUpdate: "SET NULL",
        onDelete: "SET NULL",
      }),
      queryInterface.addColumn(table, "gelar_pendidikan_id", {
        type: Sequelize.INTEGER,
        references: {
          model: "master_gelar_pendidikan",
          key: "id",
        },
        onUpdate: "SET NULL",
        onDelete: "SET NULL",
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn(table, "instansi_pendidikan_id"),
      queryInterface.removeColumn(table, "fakultas_pendidikan_id"),
      queryInterface.removeColumn(table, "gelar_pendidikan_id"),
    ]);
  },
};
