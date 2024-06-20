'use strict';
/** @type {import('sequelize-cli').Migration} */
require("dotenv").config();
const table = {
  schema: process.env.NODE_ENV,
  tableName: "document"
}
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(table, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      personnel_number: {
        type: Sequelize.STRING
      },
      subtype: {
        type: Sequelize.STRING
      },
      valid_from: {
        type: Sequelize.STRING
      },
      valid_to: {
        type: Sequelize.STRING
      },
      doc_type: {
        type: Sequelize.STRING
      },
      doc_country: {
        type: Sequelize.STRING
      },
      doc_number: {
        type: Sequelize.STRING
      },
      issue_date: {
        type: Sequelize.STRING
      },
      issue_place: {
        type: Sequelize.STRING
      },
      issue_ctry: {
        type: Sequelize.STRING
      },
      doc_status: {
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.STRING
      },
      tanggal_efektif_sk: {
        type: Sequelize.STRING
      },
      change_on: {
        type: Sequelize.STRING
      },
      created_by: {
        type: Sequelize.STRING
      },
      updated_by: {
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(table);
  }
};