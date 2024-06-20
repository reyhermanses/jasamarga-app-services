'use strict';

/** @type {import('sequelize-cli').Migration} */
require('dotenv').config();

const table = {
  schema: process.env.NODE_ENV,
  tableName: 'employee_profile'
};
module.exports = {
  up: function(queryInterface, Sequelize) {
    // logic for transforming into the new state
    return Promise.all([
      queryInterface.addColumn(table, 'email_perusahaan', {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn(table, 'last_education_id', {
        type: Sequelize.INTEGER,
        references: {
          model: 'employee_education',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      })
    ]);
  },

  down: function(queryInterface, Sequelize) {
    // logic for reverting the changes
    return Promise.all([
      queryInterface.removeColumn(
        table, 'email_perusahaan'
      ),
      queryInterface.removeColumn(
        table, 'last_education_id'
      )
    ])
  }
}