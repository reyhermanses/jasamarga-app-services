// In the migration file
'use strict';

const table = {
  schema: process.env.DB_SCHEMA,
  tableName: 'bus'
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
      master_rute_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'master_rute',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      master_child_rute_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'master_child_rute',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      nomor: {
        type: Sequelize.STRING,
        allowNull: false
      },
      muatan: {
        type: Sequelize.STRING,
        allowNull: false
      },
      sisa_muatan: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM('Available', 'Unavailable')
      },
      active: {
        type: Sequelize.BOOLEAN,
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
  }
};
