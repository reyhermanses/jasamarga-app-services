'use strict';
const table = {
  schema: process.env.NODE_ENV,
  tableName: "hrd_his_sertifikasi_files",
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
    // return Promise.all([
    //   queryInterface.changeColumn(table, "UUID", {
    //     type: Sequelize.UUID
    //   })
    // ])
    // Drop the UUID column
    await queryInterface.removeColumn(table, "UUID");

    // Recreate the UUID column with the UUID data type
    await queryInterface.addColumn(table, "UUID", {
      type: Sequelize.UUID
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    // return Promise.all([
    //   queryInterface.removeColumn(table, "UUID")
    // ]);
    // Drop the UUID column
    await queryInterface.removeColumn(table, "UUID");

    // Recreate the UUID column with its original data type
    await queryInterface.addColumn(table, "UUID", {
      type: "VARCHAR" // Change this to the original data type of the column
    });
  }
};
