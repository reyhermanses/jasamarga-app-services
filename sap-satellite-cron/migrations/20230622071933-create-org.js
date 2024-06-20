'use strict';
/** @type {import('sequelize-cli').Migration} */
require("dotenv").config();
const table = {
  schema: process.env.NODE_ENV,
  tableName: "org"
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
      start_date: {
        type: Sequelize.STRING
      },
      end_date: {
        type: Sequelize.STRING
      },
      object_type: {
        type: Sequelize.STRING
      },
      object_id: {
        type: Sequelize.STRING
      },
      object_name: {
        type: Sequelize.STRING
      },
      subtype: {
        type: Sequelize.STRING
      },
      subtype_text: {
        type: Sequelize.STRING
      },
      type_of_related_object: {
        type: Sequelize.STRING
      },
      object_sobid: {
        type: Sequelize.STRING
      },
      object_sobid_name: {
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