'use strict';
/** @type {import('sequelize-cli').Migration} */
const table = {
  schema: process.env.NODE_ENV,
  tableName: 'employee_position'
}
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(table, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      employee_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'employee',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      npp: {
        type: Sequelize.STRING
      },
      personnel_number: {
        type: Sequelize.STRING
      },
      new_npp: {
        type: Sequelize.STRING
      },
      position_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'master_position',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      atasan_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'employee',
          key: 'id'
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL',
      },
      atasan_position_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'master_position',
          key: 'id'
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL',
      },
      action: {
        type: Sequelize.STRING
      },
      atasan_ap_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'employee',
          key: 'id'
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL',
      },
      atasan_ap_position_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'master_position',
          key: 'id'
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL',
      },
      cost_center: {
        type: Sequelize.STRING,
      },
      ket_ap: {
        type: Sequelize.STRING,
      },
      created_by: {
        type: Sequelize.STRING
      },
      updated_by: {
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(table);
  }
};