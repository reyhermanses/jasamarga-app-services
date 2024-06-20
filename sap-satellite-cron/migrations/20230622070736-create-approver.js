'use strict';
/** @type {import('sequelize-cli').Migration} */
require("dotenv").config();
const table = {
  schema: process.env.NODE_ENV,
  tableName: "approver"
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
      complete_name: {
        type: Sequelize.STRING
      },
      start_date: {
        type: Sequelize.STRING
      },
      org_unit: {
        type: Sequelize.STRING
      },
      org_unit_text: {
        type: Sequelize.STRING
      },
      department: {
        type: Sequelize.STRING
      },
      department_text: {
        type: Sequelize.STRING
      },
      position: {
        type: Sequelize.STRING
      },
      position_name: {
        type: Sequelize.STRING
      },
      personnel_num_approver: {
        type: Sequelize.STRING
      },
      name_approver: {
        type: Sequelize.STRING
      },
      position_appr: {
        type: Sequelize.STRING
      },
      position_name_appr: {
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