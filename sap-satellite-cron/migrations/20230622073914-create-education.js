'use strict';
/** @type {import('sequelize-cli').Migration} */
require("dotenv").config();
const table = {
  schema: process.env.NODE_ENV,
  tableName: "education"
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
      begin_date: {
        type: Sequelize.STRING
      },
      end_date: {
        type: Sequelize.STRING
      },
      level_pendidikan: {
        type: Sequelize.STRING
      },
      jurusan_kuliah_training: {
        type: Sequelize.STRING
      },
      institusi_penyelenggara: {
        type: Sequelize.STRING
      },
      country: {
        type: Sequelize.STRING
      },
      certificate: {
        type: Sequelize.STRING
      },
      dur_of_course: {
        type: Sequelize.STRING
      },
      time_unit_meas: {
        type: Sequelize.STRING
      },
      jurusan: {
        type: Sequelize.STRING
      },
      final_grade: {
        type: Sequelize.STRING
      },
      no_certificate: {
        type: Sequelize.STRING
      },
      location: {
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