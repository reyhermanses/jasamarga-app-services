'use strict';
const table = {
  schema: process.env.NODE_ENV,
  tableName: "hrd_his_sertifikasi",
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
      queryInterface.changeColumn(table, "nm_sertifikasi", {
        type: Sequelize.TEXT
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
      queryInterface.removeColumn(table, "nm_sertifikasi")
    ]);
  }
};
