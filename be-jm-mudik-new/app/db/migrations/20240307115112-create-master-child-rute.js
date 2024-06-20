// In the migration file
'use strict';

const table = {
  schema: process.env.DB_SCHEMA,
  tableName: 'master_child_rute'
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(table, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      rute_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'master_rute',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      kecamatan_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'master_kecamatan',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      is_show: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      created_by: {
        type: Sequelize.STRING,
      },
      updated_by: {
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: true,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable(table);
    // await queryInterface.removeColumn(table);
  }
};
