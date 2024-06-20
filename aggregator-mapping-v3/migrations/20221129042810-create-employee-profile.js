'use strict';
/** @type {import('sequelize-cli').Migration} */
require('dotenv').config();

const table = {
  schema: process.env.NODE_ENV,
  tableName: 'employee_profile'
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
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      national_identifier: {
        type: Sequelize.STRING(255)
      },
      place_of_birth: {
        type: Sequelize.STRING(255)
      },
      date_of_birth: {
        type: Sequelize.DATEONLY
      },
      gender: {
        type: Sequelize.BOOLEAN,
      },
      address_ktp: {
        type: Sequelize.STRING(255),
      },
      address_domicile: {
        type: Sequelize.STRING(255),
      },
      city_ktp_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'master_city',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      province_ktp_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'master_province',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      city_domicile_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'master_city',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      province_domicile_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'master_province',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      front_title_education: {
        type: Sequelize.STRING(255),
      },
      end_title_education: {
        type: Sequelize.STRING(255),
      },
      religion_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'master_religion',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      marital_status: {
        type: Sequelize.STRING(255),
      },
      npwp: {
        type: Sequelize.STRING(255),
      },
      status_npwp: {
        type: Sequelize.STRING(10),
      },
      blood_type: {
        type: Sequelize.STRING(10),
      },
      height: {
        type: Sequelize.STRING(10),
      },
      weight: {
        type: Sequelize.STRING(10),
      },
      telephone_no: {
        type: Sequelize.STRING(255),
      },
      bpjs_kes_no: {
        type: Sequelize.STRING(255),
      },
      bpjs_ket_no: {
        type: Sequelize.STRING(255),
      },
      paspor_no: {
        type: Sequelize.STRING(255),
      },
      facebook: {
        type: Sequelize.STRING(255),
      },
      twitter: {
        type: Sequelize.STRING(255),
      },
      instagram: {
        type: Sequelize.STRING(255),
      },
      summary: {
        type: Sequelize.STRING(255),
      },
      interest: {
        type: Sequelize.STRING(255),
      },
      email_pribadi: {
        type: Sequelize.STRING(50),
      },
      rt: {
        type: Sequelize.STRING(10),
      },
      rw: {
        type: Sequelize.STRING(10),
      },
      kd_pos: {
        type: Sequelize.STRING(10),
      },
      rt_domicile: {
        type: Sequelize.STRING(10),
      },
      rw_domicile: {
        type: Sequelize.STRING(255),
      },
      no_dana_pension: {
        type: Sequelize.STRING
      },
      created_by: {
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
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(table);
  }
};