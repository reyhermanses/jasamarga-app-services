'use strict';

/** @type {import('sequelize-cli').Migration} */
const table = {
  schema: process.env.NODE_ENV,
  tableName: 'master_position'
}
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        table,
        'kelompok_jabatan', {
        type: Sequelize.ENUM('Operasional', 'Non Operasional')
      }
      ),
    ])
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn(
        table,
        'kelompok_jabatan'
      ),
    ])
  }
};
