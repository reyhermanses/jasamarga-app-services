'use strict';
/** @type {import('sequelize-cli').Migration} */
require('dotenv').config();

const table = {
  schema: process.env.NODE_ENV,
  tableName: 'user_auth'
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
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      username: {
        type: Sequelize.STRING(20)
      },
      password: {
        type: Sequelize.STRING(100)
      },
      password_expires: {
        type: Sequelize.DATE
      },
      is_ldap: {
        type: Sequelize.BOOLEAN
      },
      is_mobile: {
        type: Sequelize.BOOLEAN
      },
      token: {
        type: Sequelize.STRING
      },
      token_firebase: {
        type: Sequelize.STRING
      },
      last_login: {
        type: Sequelize.DATE,
      },
      created_by: {
        type: Sequelize.STRING(100),
      },
      updated_by: {
        type: Sequelize.STRING(100),
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