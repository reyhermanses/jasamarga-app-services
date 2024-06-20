'use strict';
const {
  Model
} = require('sequelize');
require('dotenv').config();
module.exports = (sequelize, DataTypes) => {
  class OrgFormationJob extends Model {
    static associate(models) {
      this.belongsTo(models.OrganizationHierarchy, {
        foreignKey: 'org_id',
        as: 'formation_job_org'
      })

      this.belongsTo(models.MasterJob, {
        foreignKey: 'job_id',
        as: 'formation_job_job'
      })
    }
  }
  OrgFormationJob.init({
    org_id: DataTypes.INTEGER,
    org_name: DataTypes.STRING,
    job_id: DataTypes.INTEGER,
    job_name: DataTypes.STRING,
    add_on: DataTypes.INTEGER,
    all_job: DataTypes.INTEGER,
    filled_job: DataTypes.INTEGER,
    add_on: DataTypes.INTEGER,
    unprocess: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'OrgFormationJob',
    tableName: 'org_formation_job',
    schema: process.env.NODE_ENV,
    freezeTableName: true,
    timestamps: false
  });
  return OrgFormationJob;
};