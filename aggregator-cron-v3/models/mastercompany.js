'use strict';
const {
  Model
} = require('sequelize');
require('dotenv').config();
module.exports = (sequelize, DataTypes) => {
  class MasterCompany extends Model {

    static associate(models) {
      this.hasMany(models.Employee, { as: 'employee_company_asal', foreignKey: 'company_id_asal' });
      this.hasMany(models.MasterPosition, { as: 'position_company', foreignKey: 'company_id' });
      this.hasMany(models.Employee, { as: 'employee_company_penugasan', foreignKey: 'company_id_penugasan' });
      this.belongsTo(models.OrganizationHierarchy, {
        foreignKey: "org_id",
        as: "org_company",
      });
    }
  }
  MasterCompany.init({
    name: DataTypes.STRING,
    kd_comp: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    nm_singkatan: DataTypes.STRING,
    org_id: DataTypes.INTEGER,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'MasterCompany',
    tableName: 'master_company',
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at"
  });
  return MasterCompany;
};