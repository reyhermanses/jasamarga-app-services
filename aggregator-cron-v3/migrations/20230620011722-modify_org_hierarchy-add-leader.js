'use strict';

/** @type {import('sequelize-cli').Migration} */

require("dotenv").config();

const table = {
  schema: process.env.NODE_ENV,
  tableName: "organization_hierarchy",
};

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(table, "leader_id", {
        type: Sequelize.INTEGER,
        references: {
          model: "employee",
          key: "id",
        },
        onUpdate: "SET NULL",
        onDelete: "SET NULL",
      }),
      queryInterface.addColumn(table, "leader_position_id", {
        type: Sequelize.INTEGER,
        references: {
          model: "master_position",
          key: "id",
        },
        onUpdate: "SET NULL",
        onDelete: "SET NULL",
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn(table, "leader_id"),
      queryInterface.removeColumn(table, "leader_position_id"),
    ]);
  }
};
