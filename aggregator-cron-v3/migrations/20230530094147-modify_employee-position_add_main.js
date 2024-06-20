'use strict';

/** @type {import('sequelize-cli').Migration} */
const table = {
  schema: process.env.NODE_ENV,
  tableName: 'employee_position'
}
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        table,
        'is_main', {
        type: Sequelize.BOOLEAN
      }
      ),
    ])
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn(
        table,
        'is_main'
      ),
    ])
  }
};
