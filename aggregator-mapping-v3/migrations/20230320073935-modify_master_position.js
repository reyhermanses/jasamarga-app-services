'use strict';

/** @type {import('sequelize-cli').Migration} */
const table = {
  schema: process.env.NODE_ENV,
  tableName: 'master_position'
}
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        table,
        'company_id', {
        type: Sequelize.INTEGER,
        references: {
          model: 'master_company',
          key: 'id'
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL'
      }
      ),
      queryInterface.addColumn(
        table,
        'unit_kerja_id', {
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
        'departemen_id', {
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
        'seksi_id', {
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
        'direktorat_id', {
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
        'job_id', {
        type: Sequelize.INTEGER,
        references: {
          model: 'master_job',
          key: 'id'
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL'
      }
      ),
      queryInterface.addColumn(
        table,
        'fungsi_jabatan', {
        type: Sequelize.INTEGER,
        references: {
          model: 'master_employee_subgroup',
          key: 'id'
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL'
      }
      ),
      queryInterface.addColumn(
        table,
        'personal_area_id', {
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
        table,
        'personal_sub_area_id', {
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
        'sk_position_no', {
        type: Sequelize.STRING
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
        'start_date', {
        type: Sequelize.DATE
      }
      ),
      queryInterface.addColumn(
        table,
        'end_date', {
        type: Sequelize.DATE
      }
      ),
      queryInterface.addColumn(
        table,
        'grade', {
        type: Sequelize.STRING
      }
      ),
      queryInterface.addColumn(
        table,
        'level', {
        type: Sequelize.STRING
      }
      ),
      queryInterface.addColumn(
        table,
        'cluster_id', {
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
        table,
        'sub_cluster_id', {
        type: Sequelize.INTEGER,
        references: {
          model: 'master_subcluster',
          key: 'id'
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL'
      }
      ),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn(
        table,
        'company_id'
      ),
      queryInterface.removeColumn(
        table,
        'unit_kerja_id'
      ),
      queryInterface.removeColumn(
        table,
        'departemen_id'
      ),
      queryInterface.removeColumn(
        table,
        'seksi_id'
      ),
      queryInterface.removeColumn(
        table,
        'direktorat_id'
      ),
      queryInterface.removeColumn(
        table,
        'job_id'
      ),
      queryInterface.removeColumn(
        table,
        'fungsi_jabatan'
      ),
      queryInterface.removeColumn(
        table,
        'personal_area_id'
      ),
      queryInterface.removeColumn(
        table,
        'personal_sub_area_id'
      ),
      queryInterface.removeColumn(
        table,
        'sk_position_no'
      ),
      queryInterface.removeColumn(
        table,
        'sk_position_date'
      ),
      queryInterface.removeColumn(
        table,
        'start_date'
      ),
      queryInterface.removeColumn(
        table,
        'end_date'
      ),
      queryInterface.removeColumn(
        table,
        'grade'
      ),
      queryInterface.removeColumn(
        table,
        'level'
      ),
      queryInterface.removeColumn(
        table,
        'cluster_id'
      ),
      queryInterface.removeColumn(
        table,
        'sub_cluster_id'
      ),
    ]);
  }
};