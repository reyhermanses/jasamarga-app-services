"use strict";
/** @type {import('sequelize-cli').Migration} */
require("dotenv").config();

const table = {
  schema: process.env.NODE_ENV,
  tableName: "hrd_his_sertifikasi",
};

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(table, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      employee_id: {
        type: Sequelize.INTEGER,
      },
      UUID: {
        type: Sequelize.STRING,
      },
      tahun: {
        type: Sequelize.INTEGER,
      },
      nm_sertifikasi: {
        type: Sequelize.STRING,
      },
      nm_institusi: {
        type: Sequelize.STRING,
      },
      tgl_ambil: {
        type: Sequelize.DATE,
      },
      tgl_habis_berlaku: {
        type: Sequelize.DATE,
      },
      tempat: {
        type: Sequelize.STRING,
      },
      created_by: {
        type: Sequelize.STRING(100),
      },
      updated_by: {
        type: Sequelize.STRING(100),
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(table);
  },
};
