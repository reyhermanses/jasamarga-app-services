'use strict';
/** @type {import('sequelize-cli').Migration} */
require('dotenv').config();

const table = {
  schema: process.env.NODE_ENV,
  tableName: 'master_province'
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
      country_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'master_country',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      description: {
        type: Sequelize.STRING(200)
      },
      active: {
        type: Sequelize.BOOLEAN
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