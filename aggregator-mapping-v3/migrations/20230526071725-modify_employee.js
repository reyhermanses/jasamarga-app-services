'use strict';

/** @type {import('sequelize-cli').Migration} */
const table = {
  schema: process.env.NODE_ENV,
  tableName: 'employee'
}
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn(
        table, 'npp'
      ),
      queryInterface.removeColumn(
        table, 'personnel_number'
      ),
      queryInterface.removeColumn(
        table, 'level'
      ),
      queryInterface.removeColumn(
        table, 'personal_area_id'
      ),
      queryInterface.removeColumn(
        table, 'personal_sub_area_id'
      ),
      queryInterface.removeColumn(
        table, 'cost_center'
      ),
      queryInterface.removeColumn(
        table, 'sk_position_no'
      ),
      queryInterface.removeColumn(
        table, 'sk_position_date'
      ),
      queryInterface.removeColumn(
        table, 'grade'
      ),
      queryInterface.removeColumn(
        table, 'job_id'
      ),
      queryInterface.removeColumn(
        table, 'unit_kerja_id'
      ),
      queryInterface.removeColumn(
        table, 'is_pensiunan_jm'
      ),
      queryInterface.removeColumn(
        table, 'ket_ap'
      ),
      queryInterface.removeColumn(
        table, 'mk_jabatan'
      ),
      queryInterface.removeColumn(
        table, 'atasan_id'
      ),
      queryInterface.removeColumn(
        table, 'atasan_position_id'
      ),
      queryInterface.removeColumn(
        table, 'atasan_ap_id'
      ),
      queryInterface.removeColumn(
        table, 'atasan_ap_position_id'
      ),
      queryInterface.removeColumn(
        table, 'cluster_id'
      ),
      queryInterface.removeColumn(
        table, 'sub_cluster_id'
      ),
      queryInterface.removeColumn(
        table, 'kelompok_jabatan'
      ),
      queryInterface.removeColumn(
        table, 'section_id'
      ),
      queryInterface.removeColumn(
        table, 'direktorat_id'
      ),
      queryInterface.removeColumn(
        table, 'action'
      ),
      queryInterface.removeColumn(
        table, 'org_id'
      ),
      queryInterface.removeColumn(
        table, 'departement_id'
      ),
      queryInterface.removeColumn(
        table, 'konversi'
      ),
      queryInterface.removeColumn(
        table, 'position_id'
      ),
      queryInterface.removeColumn(
        table, 'new_npp'
      ),
    ])
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        table,
        'npp', {
        type: Sequelize.STRING(20)
      }
      ),
      queryInterface.addColumn(
        table,
        'personnel_number', {
        type: Sequelize.STRING(20)
      }
      ),
      queryInterface.addColumn(
        table,
        'level', {
        type: Sequelize.STRING(10)
      }
      ),
      queryInterface.addColumn(
        table, 'atasan_id', {
        type: Sequelize.INTEGER,
        references: {
          model: 'employee',
          key: 'id'
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL'
      }
      ),
      queryInterface.addColumn(
        table, 'atasan_position_id', {
        type: Sequelize.INTEGER,
        references: {
          model: 'master_position',
          key: 'id'
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL'
      }
      ),
      queryInterface.addColumn(
        table, 'position_id', {
        type: Sequelize.INTEGER,
        references: {
          model: 'master_position',
          key: 'id'
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL'
      }
      ),
      queryInterface.addColumn(
        table, 'atasan_ap_id', {
        type: Sequelize.INTEGER,
        references: {
          model: 'employee',
          key: 'id'
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL'
      }
      ),
      queryInterface.addColumn(
        table, 'atasan_ap_position_id', {
        type: Sequelize.INTEGER,
        references: {
          model: 'master_position',
          key: 'id'
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL'
      }
      ),
      queryInterface.addColumn(
        table, 'personal_area_id', {
        type: Sequelize.INTEGER,
        references: {
          model: 'master_personal_area',
          key: 'id'
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL'
      }
      ),
      queryInterface.addColumn(
        table, 'personal_sub_area_id', {
        type: Sequelize.INTEGER,
        references: {
          model: 'master_personal_sub_area',
          key: 'id'
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL'
      }
      ),
      queryInterface.addColumn(
        table,
        'cost_center', {
        type: Sequelize.STRING(100)
      }
      ),
      queryInterface.addColumn(
        table,
        'konversi', {
        type: Sequelize.STRING(100)
      }
      ),
      queryInterface.addColumn(
        table,
        'new_npp', {
        type: Sequelize.STRING(100)
      }
      ),
      queryInterface.addColumn(
        table,
        'sk_position_no', {
        type: Sequelize.STRING(100)
      }
      ),
      queryInterface.addColumn(
        table,
        'sk_position_date', {
        type: Sequelize.DATE
      }
      ),
      queryInterface.addColumn(
        table,
        'grade', {
        type: Sequelize.STRING(20)
      }
      ),
      queryInterface.addColumn(
        table,
        'job_id', {
        type: Sequelize.INTEGER,
        references: {
          model: 'master_job',
          key: 'id'
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL',
      }
      ),
      queryInterface.addColumn(
        table, 'unit_kerja_id', {
        type: Sequelize.INTEGER,
        references: {
          model: 'organization_hierarchy',
          key: 'id'
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL'
      }
      ),
      queryInterface.addColumn(
        table, 'org_id', {
        type: Sequelize.INTEGER,
        references: {
          model: 'organization_hierarchy',
          key: 'id'
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL'
      }
      ),
      queryInterface.addColumn(
        table, 'departement_id', {
        type: Sequelize.INTEGER,
        references: {
          model: 'organization_hierarchy',
          key: 'id'
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL'
      }
      ),
      queryInterface.addColumn(
        table,
        'is_pensiunan_jm', {
        type: Sequelize.BOOLEAN
      }
      ),
      queryInterface.addColumn(
        table,
        'ket_ap', {
        type: Sequelize.STRING(100)
      }
      ),
      queryInterface.addColumn(
        table,
        'mk_jabatan', {
        type: Sequelize.STRING(255)
      }
      ),
      queryInterface.addColumn(
        table, 'cluster_id', {
        type: Sequelize.INTEGER,
        references: {
          model: 'master_cluster',
          key: 'id'
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL'
      }
      ),
      queryInterface.addColumn(
        table, 'sub_cluster_id', {
        type: Sequelize.INTEGER,
        references: {
          model: 'master_subcluster',
          key: 'id'
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL'
      }
      ),
      queryInterface.addColumn(
        table,
        'kelompok_jabatan', {
        type: Sequelize.ENUM('Operasional', 'Non Operasional')
      }
      ),
      queryInterface.addColumn(
        table,
        'section_id', {
        type: Sequelize.INTEGER,
        references: {
          model: 'organization_hierarchy',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }
      ),
      queryInterface.addColumn(
        table,
        'direktorat_id', {
        type: Sequelize.INTEGER,
        references: {
          model: 'organization_hierarchy',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }
      ),
      queryInterface.addColumn(
        table,
        'action', {
        type: Sequelize.STRING(255)
      }
      ),
    ])
  }
};