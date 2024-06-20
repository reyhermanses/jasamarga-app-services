"use strict";
/** @type {import('sequelize-cli').Migration} */
require("dotenv").config();

const table = {
  schema: process.env.NODE_ENV,
  tableName: "history_jabatan",
};

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(table, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      employee_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "employee",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      // npp: {
      //   type: Sequelize.STRING(10)
      // },
      angkatan: {
        type: Sequelize.INTEGER,
      },
      // name: {
      //   type: Sequelize.STRING
      // },
      posisi: {
        type: Sequelize.STRING,
      },
      sk_posisi: {
        type: Sequelize.STRING,
      },
      awal_posisi: {
        type: Sequelize.DATE,
      },
      akhir_posisi: {
        type: Sequelize.DATE,
      },
      grade: {
        type: Sequelize.STRING(10),
      },
      level: {
        type: Sequelize.STRING(10),
      },
      konversi: {
        type: Sequelize.STRING(10),
      },
      unit: {
        type: Sequelize.STRING,
      },
      kd_comp: {
        type: Sequelize.INTEGER,
        references: {
          model: "master_company",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      cluster: {
        type: Sequelize.STRING(50),
      },
      sub_cluster: {
        type: Sequelize.STRING(50),
      },
      personnel_number: {
        type: Sequelize.STRING(255),
      },
      created_by: {
        type: Sequelize.STRING(100),
      },
      updated_by: {
        type: Sequelize.STRING(100),
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(table);
  },
};
