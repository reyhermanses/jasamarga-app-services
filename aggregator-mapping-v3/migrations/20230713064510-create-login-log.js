'use strict';
/** @type {import('sequelize-cli').Migration} */

require("dotenv").config();

const table = {
  schema: process.env.NODE_ENV,
  tableName: "login_log",
};

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(table, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      employee_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'employee',
          key: 'id'
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL',
      },
      username: {
        type: Sequelize.STRING
      },
      login_time: {
        type: Sequelize.DATE
      },
      login_by: {
        type: Sequelize.STRING
      },
      created_by: {
        type: Sequelize.STRING(100),
      },
      created_at: {
        type: Sequelize.DATE
      },
      updated_by: {
        type: Sequelize.STRING(100)
      },
      updated_at: {
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(table);
  }
};