'use strict';
/** @type {import('sequelize-cli').Migration} */
require('dotenv').config();

const table = {
  schema: process.env.NODE_ENV,
  tableName: 'employee_masa_kerja'
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
      masa_kerja: {
        type: Sequelize.STRING(50)
      },
      mk_jabatan: {
        type: Sequelize.STRING(50)
      },
      mk_unit: {
        type: Sequelize.STRING(50)
      },
      mk_grade: {
        type: Sequelize.STRING(50)
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