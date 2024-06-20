'use strict';
/** @type {import('sequelize-cli').Migration} */
require('dotenv').config();

const table = {
  schema: process.env.NODE_ENV,
  tableName: 'employee_family'
};

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
      name: {
        type: Sequelize.STRING(50)
      },
      place_of_birth: {
        type: Sequelize.STRING(50)
      },
      date_of_birth: {
        type: Sequelize.DATE
      },
      religion_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'master_religion',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      gender: {
        type: Sequelize.ENUM("Perempuan", "Laki-Laki")
      },
      blood_type: {
        type: Sequelize.STRING(10)
      },
      job: {
        type: Sequelize.STRING(50)
      },
      national_identifier: {
        type: Sequelize.STRING(50)
      },
      paspor_no: {
        type: Sequelize.STRING(50)
      },
      place_of_death: {
        type: Sequelize.STRING(50)
      },
      date_of_death: {
        type: Sequelize.DATE
      },
      attachment_nikah: {
        type: Sequelize.STRING
      },
      attachment_akta: {
        type: Sequelize.STRING
      },
      start_date: {
        type: Sequelize.DATE
      },
      end_date: {
        type: Sequelize.DATE
      },
      active: {
        type: Sequelize.BOOLEAN
      },
      changedate: {
        type: Sequelize.STRING(10)
      },
      created_by: {
        type: Sequelize.STRING(100)
      },
      updated_by: {
        type: Sequelize.STRING(100)
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(table);
  }
};