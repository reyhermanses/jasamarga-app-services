'use strict';
/** @type {import('sequelize-cli').Migration} */
require('dotenv').config();
const table = {
  schema: process.env.NODE_ENV,
  tableName: 'employee_training'
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
      tahun: {
        type: Sequelize.INTEGER
      },
      pelatihan: {
        type: Sequelize.STRING
      },
      pelaksanaan: {
        type: Sequelize.STRING
      },
      tgl_awal: {
        type: Sequelize.DATE
      },
      tgl_akhir: {
        type: Sequelize.DATE
      },
      hari: {
        type: Sequelize.INTEGER
      },
      tempat: {
        type: Sequelize.STRING
      },
      kota: {
        type: Sequelize.STRING
      },
      inisiator: {
        type: Sequelize.STRING
      },
      no_penugasan: {
        type: Sequelize.STRING
      },
      klp_plth1: {
        type: Sequelize.STRING
      },
      klp_plth2: {
        type: Sequelize.STRING
      },
      negara: {
        type: Sequelize.STRING
      },
      nosertifikat: {
        type: Sequelize.STRING
      },
      nilai: {
        type: Sequelize.STRING
      },
      peringkat: {
        type: Sequelize.STRING
      },
      biaya: {
        type: Sequelize.FLOAT
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
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(table);
  }
};