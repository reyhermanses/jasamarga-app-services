'use strict';
const {
  Model
} = require('sequelize');
require('dotenv').config();
module.exports = (sequelize, DataTypes) => {
  class MasterPosition extends Model {
    static associate(models) {
      this.belongsTo(models.MasterCompany, {
        foreignKey: 'company_id',
        as: 'company_position'
      })

      this.belongsTo(models.OrganizationHierarchy, {
        foreignKey: 'unit_kerja_id',
        as: 'unit_position'
      })

      this.belongsTo(models.OrganizationHierarchy, {
        foreignKey: 'departemen_id',
        as: 'departemen_position'
      })

      this.belongsTo(models.OrganizationHierarchy, {
        foreignKey: 'seksi_id',
        as: 'seksi_position'
      })

      this.belongsTo(models.OrganizationHierarchy, {
        foreignKey: 'direktorat_id',
        as: 'direktorat_position'
      })

      this.belongsTo(models.MasterJob, {
        foreignKey: 'job_id',
        as: 'job_position'
      })

      this.belongsTo(models.MasterPersonalArea, {
        foreignKey: 'personal_area_id',
        as: 'personal_area_position'
      })

      this.belongsTo(models.MasterPersonalSubArea, {
        foreignKey: 'personal_sub_area_id',
        as: 'personal_sub_area_position'
      })

      this.belongsTo(models.MasterCluster, {
        foreignKey: 'cluster_id',
        as: 'cluster_position'
      })

      this.belongsTo(models.MasterSubCluster, {
        foreignKey: 'sub_cluster_id',
        as: 'sub_cluster_position'
      })

      this.belongsTo(models.OrganizationHierarchy, {
        foreignKey: 'org_id',
        as: 'org_position'
      })

      this.hasMany(models.OrganizationHierarchy, {
        foreignKey: 'leader_position_id',
        as: 'position_org_leader'
      })

      this.hasMany(models.EmployeePosition, {
        foreignKey: 'position_id',
        as: 'position_employee'
      })

      this.belongsTo(models.MasterGradeLevel, {
        foreignKey: 'grade_level_id',
        as: 'position_grade_level'
      })

      this.belongsTo(models.MasterEmployeeSubGroup, {
        foreignKey: 'fungsi_jabatan',
        as: 'position_subgroup'
      })

      this.belongsTo(models.UnitDirektoratRelation, {
        foreignKey: 'unit_kerja_id',
        as: 'relation_unit_direktorat'
      })
    }
  }
  MasterPosition.init({
    name: DataTypes.STRING,
    company_id: DataTypes.INTEGER,
    unit_kerja_id: DataTypes.INTEGER,
    departemen_id: DataTypes.INTEGER,
    seksi_id: DataTypes.INTEGER,
    direktorat_id: DataTypes.INTEGER,
    job_id: DataTypes.INTEGER,
    fungsi_jabatan: DataTypes.STRING,
    personal_area_id: DataTypes.INTEGER,
    personal_sub_area_id: DataTypes.INTEGER,
    sk_position_no: DataTypes.STRING,
    sk_position_date: DataTypes.STRING,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    grade: DataTypes.STRING,
    level: DataTypes.STRING,
    konversi: DataTypes.STRING,
    kelompok_jabatan: DataTypes.ENUM('Operasional', 'Non Operasional'),
    cluster_id: DataTypes.INTEGER,
    sub_cluster_id: DataTypes.INTEGER,
    org_id: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN,
    grade_level_id: DataTypes.INTEGER,
    file_sk: DataTypes.TEXT,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'MasterPosition',
    tableName: 'master_position',
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at"
  });
  return MasterPosition;
};