'use strict';
/** @type {import('sequelize-cli').Migration} */
require('dotenv').config();

const table = {
  schema: process.env.NODE_ENV,
  tableName: 'employee_education'
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
      ref_jenjang_pendidikan_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'master_jenjang_pendidikan',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      ref_jurusan_pendidikan_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'master_jurusan_pendidikan',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      name: {
        type: Sequelize.STRING(50)
      },
      address: {
        type: Sequelize.STRING(100)
      },
      country_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'master_country',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      start_date: {
        type: Sequelize.DATE
      },
      graduate_date: {
        type: Sequelize.DATE
      },
      title: {
        type: Sequelize.STRING(20)
      },
      no_ijazah: {
        type: Sequelize.STRING(100)
      },
      tanggal_ijazah: {
        type: Sequelize.DATE
      },
      final_score: {
        type: Sequelize.TEXT
      },
      education_degree: {
        type: Sequelize.TEXT
      },
      created_by: {
        allowNull: false,
        type: Sequelize.STRING(100),
      },
      updated_by: {
        type: Sequelize.STRING(100),
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        type: Sequelize.DATE
      },
      changedate: {
        type: Sequelize.STRING(10)
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(table);
  }
};