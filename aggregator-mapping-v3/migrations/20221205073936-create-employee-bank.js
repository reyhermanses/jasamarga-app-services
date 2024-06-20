'use strict';
/** @type {import('sequelize-cli').Migration} */
require('dotenv').config();

const table = {
  schema: process.env.NODE_ENV,
  tableName: 'employee_bank'
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
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      begin_date: {
        type: Sequelize.DATE
      },
      end_date: {
        type: Sequelize.DATE
      },
      type_of_bank: {
        type: Sequelize.BOOLEAN
      },
      text_type_of_bank: {
        type: Sequelize.STRING(50)
      },
      bank_country: {
        type: Sequelize.STRING(10)
      },
      text_bank_country: {
        type: Sequelize.STRING(50)
      },
      bank_key_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'master_bank_key',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      bank_account: {
        type: Sequelize.STRING(100)
      },
      payment_method: {
        type: Sequelize.STRING(10)
      },
      changedate: {
        type: Sequelize.DATE
      },
      insert_date: {
        type: Sequelize.DATE
      },
      created_by: {
        type: Sequelize.STRING(100)
      },
      updated_by: {
        type: Sequelize.STRING(100)
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
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