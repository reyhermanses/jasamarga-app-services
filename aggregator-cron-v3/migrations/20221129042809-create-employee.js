'use strict';

/** @type {import('sequelize-cli').Migration} */
require('dotenv').config();

const table = {
  schema: process.env.NODE_ENV,
  tableName: 'employee'
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
      name: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      npp: {
        allowNull: false,
        type: Sequelize.STRING(20)
      },
      personnel_number: {
        allowNull: false,
        type: Sequelize.STRING(20)
      },
      new_npp: {
        allowNull: false,
        type: Sequelize.STRING(20)
      },
      is_pusat: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      employee_status: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      sk_position_no: {
        type: Sequelize.STRING(100)
      },
      sk_position_date: {
        type: Sequelize.DATE
      },
      start_date: {
        type: Sequelize.DATE
      },
      end_date: {
        type: Sequelize.DATE
      },
      position_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'master_position',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      atasan_id: {
        type: Sequelize.INTEGER
      },
      atasan_position_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'master_position',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      kelompok_jabatan: {
        type: Sequelize.ENUM('Operasional', 'Non Operasional')
      },
      grade: {
        type: Sequelize.STRING(20)
      },
      job_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'master_job',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      employee_group_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'master_employee_group',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      employee_sub_group_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'master_employee_subgroup',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      sap_emp_status: {
        type: Sequelize.BOOLEAN,
      },
      company_id_asal: {
        type: Sequelize.INTEGER,
        references: {
          model: 'master_company',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      company_id_penugasan: {
        type: Sequelize.INTEGER,
        references: {
          model: 'master_company',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      business_area_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'master_business_area',
          key: 'id'
        },
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      unit_kerja_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'organization_hierarchy',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      org_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'organization_hierarchy',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      departement_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'organization_hierarchy',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      section_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'organization_hierarchy',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      direktorat_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'organization_hierarchy',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      action: {
        type: Sequelize.STRING(255)
      },
      atasan_ap_id: {
        type: Sequelize.INTEGER,
      },
      atasan_ap_position_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'master_position',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      personal_area_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'master_personal_area',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      personal_sub_area_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'master_personal_sub_area',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      cost_center: {
        type: Sequelize.STRING(100)
      },
      level: {
        type: Sequelize.STRING(10)
      },
      konversi: {
        type: Sequelize.STRING(10)
      },
      date_of_entry: {
        type: Sequelize.DATE
      },
      is_rangkap_jabatan: {
        type: Sequelize.BOOLEAN
      },
      is_penugasan: {
        type: Sequelize.BOOLEAN
      },
      ket_ap: {
        type: Sequelize.STRING(100)
      },
      mk_jabatan: {
        type: Sequelize.STRING(255)
      },
      is_pensiunan_jm : {
        type: Sequelize.BOOLEAN,
      },
      created_by: {
        type: Sequelize.STRING(255),
      },
      updated_by: {
        type: Sequelize.STRING(255),
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