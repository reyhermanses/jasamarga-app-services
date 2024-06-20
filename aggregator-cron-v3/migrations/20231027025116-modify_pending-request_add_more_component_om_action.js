'use strict';
require("dotenv").config();
const table = {
  schema: process.env.NODE_ENV,
  tableName: "pending_requests",
};
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(table, "begin_date", {
        type: Sequelize.STRING
      }),

      queryInterface.addColumn(table, "end_date", {
        type: Sequelize.STRING
      }),

      queryInterface.addColumn(table, "name", {
        type: Sequelize.STRING
      }),

      queryInterface.addColumn(table, "action", {
        type: Sequelize.STRING
      }),

      queryInterface.addColumn(table, "emp_status", {
        type: Sequelize.STRING
      }),

      queryInterface.addColumn(table, "personal_area", {
        type: Sequelize.STRING
      }),

      queryInterface.addColumn(table, "text_personal_area", {
        type: Sequelize.STRING
      }),

      queryInterface.addColumn(table, "employee_group", {
        type: Sequelize.STRING
      }),

      queryInterface.addColumn(table, "text_employee_group", {
        type: Sequelize.STRING
      }),

      queryInterface.addColumn(table, "employee_subgroup", {
        type: Sequelize.STRING
      }),

      queryInterface.addColumn(table, "text_employee_subgroup", {
        type: Sequelize.STRING
      }),

      queryInterface.addColumn(table, "personal_sub_area", {
        type: Sequelize.STRING
      }),

      queryInterface.addColumn(table, "text_personal_subarea", {
        type: Sequelize.STRING
      }),

      queryInterface.addColumn(table, "cost_center", {
        type: Sequelize.STRING
      }),

      queryInterface.addColumn(table, "organisasi_key", {
        type: Sequelize.STRING
      }),

      queryInterface.addColumn(table, "text_organisasi_key", {
        type: Sequelize.STRING
      }),

      queryInterface.addColumn(table, "position_key", {
        type: Sequelize.STRING
      }),

      queryInterface.addColumn(table, "text_position_key", {
        type: Sequelize.STRING
      }),

      queryInterface.addColumn(table, "job_key", {
        type: Sequelize.STRING
      }),

      queryInterface.addColumn(table, "text_job_key", {
        type: Sequelize.STRING
      }),

      queryInterface.addColumn(table, "section", {
        type: Sequelize.STRING
      }),

      queryInterface.addColumn(table, "text_section", {
        type: Sequelize.STRING
      }),

      queryInterface.addColumn(table, "departement", {
        type: Sequelize.STRING
      }),

      queryInterface.addColumn(table, "text_departement", {
        type: Sequelize.STRING
      }),

      queryInterface.addColumn(table, "unit_kerja", {
        type: Sequelize.STRING
      }),

      queryInterface.addColumn(table, "text_unit_kerja", {
        type: Sequelize.STRING
      }),

      queryInterface.addColumn(table, "kelompok_jabatan", {
        type: Sequelize.STRING
      }),

      queryInterface.addColumn(table, "pay_scale_area", {
        type: Sequelize.STRING
      }),

      queryInterface.addColumn(table, "grade", {
        type: Sequelize.STRING
      }),

      queryInterface.addColumn(table, "subgrade", {
        type: Sequelize.STRING
      }),

      queryInterface.addColumn(table, "change_on", {
        type: Sequelize.STRING
      })

    ])
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn(table, "begin_date"),
      queryInterface.removeColumn(table, "end_date"),
      queryInterface.removeColumn(table, "personnel_number"),
      queryInterface.removeColumn(table, "name"),
      queryInterface.removeColumn(table, "action"),
      queryInterface.removeColumn(table, "emp_status"),
      queryInterface.removeColumn(table, "personal_area"),
      queryInterface.removeColumn(table, "text_personal_area"),
      queryInterface.removeColumn(table, "employee_group"),
      queryInterface.removeColumn(table, "text_employee_group"),
      queryInterface.removeColumn(table, "employee_subgroup"),
      queryInterface.removeColumn(table, "text_employee_subgroup"),
      queryInterface.removeColumn(table, "personal_sub_area"),
      queryInterface.removeColumn(table, "text_personal_subarea"),
      queryInterface.removeColumn(table, "cost_center"),
      queryInterface.removeColumn(table, "organisasi_key"),
      queryInterface.removeColumn(table, "text_organisasi_key"),
      queryInterface.removeColumn(table, "position_key"),
      queryInterface.removeColumn(table, "text_position_key"),
      queryInterface.removeColumn(table, "job_key"),
      queryInterface.removeColumn(table, "text_job_key"),
      queryInterface.removeColumn(table, "section"),
      queryInterface.removeColumn(table, "text_section"),
      queryInterface.removeColumn(table, "departement"),
      queryInterface.removeColumn(table, "text_departement"),
      queryInterface.removeColumn(table, "unit_kerja"),
      queryInterface.removeColumn(table, "text_unit_kerja"),
      queryInterface.removeColumn(table, "kelompok_jabatan"),
      queryInterface.removeColumn(table, "pay_scale_area"),
      queryInterface.removeColumn(table, "grade"),
      queryInterface.removeColumn(table, "subgrade"),
      queryInterface.removeColumn(table, "change_on"),
    ]);
  }
};
