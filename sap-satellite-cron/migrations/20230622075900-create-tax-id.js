'use strict';
/** @type {import('sequelize-cli').Migration} */
require("dotenv").config();
const table = {
  schema: process.env.NODE_ENV,
  tableName: "tax_id"
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
      valid_from: {
        type: Sequelize.STRING
      },
      valid_to: {
        type: Sequelize.STRING
      },
      tax_id: {
        type: Sequelize.STRING
      },
      marital_status: {
        type: Sequelize.STRING
      },
      jumlah_tax_dependent: {
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