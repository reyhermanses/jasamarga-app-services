'use strict';
/** @type {import('sequelize-cli').Migration} */

require("dotenv").config();

const table = {
  schema: process.env.NODE_ENV,
  tableName: "om_action",
};

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(table, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      begin_date: {
        type: Sequelize.STRING
      },
      end_date: {
        type: Sequelize.STRING
      },
      personnel_number: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      action: {
        type: Sequelize.STRING
      },
      emp_status: {
        type: Sequelize.STRING
      },
      personal_area: {
        type: Sequelize.STRING
      },
      text_personal_area: {
        type: Sequelize.STRING
      },
      employee_group: {
        type: Sequelize.STRING
      },
      text_employee_group: {
        type: Sequelize.STRING
      },
      employee_subgroup: {
        type: Sequelize.STRING
      },
      text_employee_subgroup: {
        type: Sequelize.STRING
      },
      personal_sub_area: {
        type: Sequelize.STRING
      },
      text_personal_subarea: {
        type: Sequelize.STRING
      },
      cost_center: {
        type: Sequelize.STRING
      },
      organisasi_key: {
        type: Sequelize.STRING
      },
      text_organisasi_key: {
        type: Sequelize.STRING
      },
      position_key: {
        type: Sequelize.STRING
      },
      text_position_key: {
        type: Sequelize.STRING
      },
      job_key: {
        type: Sequelize.STRING
      },
      text_job_key: {
        type: Sequelize.STRING
      },
      section: {
        type: Sequelize.STRING
      },
      text_section: {
        type: Sequelize.STRING
      },
      departement: {
        type: Sequelize.STRING
      },
      text_departement: {
        type: Sequelize.STRING
      },
      unit_kerja: {
        type: Sequelize.STRING
      },
      text_unit_kerja: {
        type: Sequelize.STRING
      },
      kelompok_jabatan: {
        type: Sequelize.STRING
      },
      pay_scale_area: {
        type: Sequelize.STRING
      },
      grade: {
        type: Sequelize.STRING
      },
      subgrade: {
        type: Sequelize.STRING
      },
      change_on: {
        type: Sequelize.STRING
      },
      created_by: {
        type: Sequelize.STRING(100),
      },
      created_at: {
        type: Sequelize.DATE,
      },
      updated_by: {
        type: Sequelize.STRING(100),
      },
      updated_at: {
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(table);
  }
};