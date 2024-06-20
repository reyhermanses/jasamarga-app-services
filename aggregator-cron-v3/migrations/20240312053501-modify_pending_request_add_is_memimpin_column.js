'use strict';
require("dotenv").config();
const table = {
  schema: process.env.NODE_ENV,
  tableName: "pending_requests",
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return Promise.all([
      queryInterface.addColumn(table, "is_memimpin", {
        type: Sequelize.BOOLEAN
      })
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return Promise.all([
      queryInterface.removeColumn(table, "is_memimpin")
    ]);
  }
};
