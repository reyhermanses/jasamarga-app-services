'use strict';
const {
  Model
} = require('sequelize');
require('dotenv').config();
module.exports = (sequelize, DataTypes) => {
  class OrgFormation extends Model {
    static associate(models) {
      this.belongsTo(models.OrganizationHierarchy, {
        foreignKey: 'org_id',
        as: 'formation_org'
      })

      this.belongsTo(models.MasterJob, {
        foreignKey: 'job_id',
        as: 'formation_job'
      })
    }
  }
  OrgFormation.init({
    org_id: DataTypes.INTEGER,
    job_id: DataTypes.INTEGER,
    add_on: DataTypes.INTEGER,
    unprocess: DataTypes.INTEGER,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'OrgFormation',
    tableName: 'org_formation',
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at"
  });
  return OrgFormation;
};