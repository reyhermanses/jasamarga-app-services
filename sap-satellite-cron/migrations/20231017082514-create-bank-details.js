'use strict';
/** @type {import('sequelize-cli').Migration} */

require('dotenv').config();

const table = {
  schema: process.env.NODE_ENV,
  tableName: 'bank_details'
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
      begin_date: {
        type: Sequelize.STRING,
      },
      end_date: {
        type: Sequelize.STRING,
      },
      type_of_bank: {
        type: Sequelize.STRING(2),
      },
      bank_country: {
        type: Sequelize.STRING(50),
      },
      bank_key: {
        type: Sequelize.STRING(50),
      },
      bank_account: {
        type: Sequelize.STRING(50),
      },
      payment_method: {
        type: Sequelize.STRING(50),
      },
      created_by: {
        type: Sequelize.STRING(100),
      },
      created_at: {
        allowNull: false,
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