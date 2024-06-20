'use strict';
/** @type {import('sequelize-cli').Migration} */

require('dotenv').config();

const table = {
  schema: process.env.NODE_ENV,
  tableName: 'reset_password_role',  
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(table, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      rpmr_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'reset_password_master_role',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      rpu_id : {
        type: Sequelize.INTEGER,
        references: {
          model: 'reset_password_user',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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