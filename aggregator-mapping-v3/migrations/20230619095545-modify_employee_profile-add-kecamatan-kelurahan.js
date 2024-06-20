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
      queryInterface.addColumn(table, "kelurahan_ktp_id", {
        type: Sequelize.INTEGER,
        references: {
          model: "master_kelurahan",
          key: "id",
        },
        onUpdate: "SET NULL",
        onDelete: "SET NULL",
      }),
      queryInterface.addColumn(table, "kelurahan_domicile_id", {
        type: Sequelize.INTEGER,
        references: {
          model: "master_kelurahan",
          key: "id",
        },
        onUpdate: "SET NULL",
        onDelete: "SET NULL",
      }),
      queryInterface.addColumn(table, "kecamatan_ktp_id", {
        type: Sequelize.INTEGER,
        references: {
          model: "master_kecamatan",
          key: "id",
        },
        onUpdate: "SET NULL",
        onDelete: "SET NULL",
      }),
      queryInterface.addColumn(table, "kecamatan_domicile_id", {
        type: Sequelize.INTEGER,
        references: {
          model: "master_kecamatan",
          key: "id",
        },
        onUpdate: "SET NULL",
        onDelete: "SET NULL",
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn(table, "kelurahan_ktp_id"),
      queryInterface.removeColumn(table, "kelurahan_domicile_id"),
      queryInterface.removeColumn(table, "kecamatan_ktp_id"),
      queryInterface.removeColumn(table, "kecamatan_domicile_id"),
    ]);
  }
};
