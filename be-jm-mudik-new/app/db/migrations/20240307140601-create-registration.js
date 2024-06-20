// In the migration file
'use strict';

const table = {
  schema: process.env.DB_SCHEMA,
  tableName: 'registration'
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
      pic_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'pic',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
      master_tanggal_mudik_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'master_tanggal_mudik',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      registration_number: {
        type: Sequelize.STRING
      },
      registration_place: {
        type: Sequelize.STRING
      },
      created_by: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM('Registration', 'Registered', 'Checkin', 'Cancel')
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
