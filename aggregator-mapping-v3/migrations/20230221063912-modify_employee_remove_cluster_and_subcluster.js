'use strict';

/** @type {import('sequelize-cli').Migration} */
require('dotenv').config();

const table = {
  schema: process.env.NODE_ENV,
  tableName: 'employee'
};
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn(
        table, 'cluster_id'
      ),
      queryInterface.removeColumn(
        table, 'sub_cluster_id'
      )
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(table, 'cluster_id', {
        type: Sequelize.INTEGER,
        references: {
          model: 'master_cluster',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }),
      queryInterface.addColumn(table, 'sub_cluster_id', {
        type: Sequelize.INTEGER,
        references: {
          model: 'master_subcluster',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      })
    ]);
  }
};
