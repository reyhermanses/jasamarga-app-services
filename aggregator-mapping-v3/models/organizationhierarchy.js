'use strict';
const {
  Model
} = require('sequelize');
require('dotenv').config();
module.exports = (sequelize, DataTypes) => {
  class OrganizationHierarchy extends Model {

    static associate(models) {
      this.hasMany(this, {
        as: 'children',
        foreignKey: 'parent_id'
      });
      this.belongsTo(this, {
        as: 'parent',
        foreignKey: 'parent_id'
      });
      this.hasMany(models.MasterPosition, {
        as: 'position_org',
        foreignKey: 'org_id'
      });
      this.hasMany(models.MasterPosition, {
        as: 'position_direktorat',
        foreignKey: 'direktorat_id'
      });
      this.hasMany(models.MasterPosition, {
        as: 'position_seksi',
        foreignKey: 'seksi_id'
      });
      this.belongsTo(models.Employee, {
        as: 'leader',
        foreignKey: 'leader_id'
      })
      this.belongsTo(models.MasterPosition, {
        as: 'leader_position',
        foreignKey: 'leader_position_id'
      })
      this.belongsTo(models.MasterPersonalArea, {
        as: 'org_personal_area',
        foreignKey: 'personal_area_id'
      })
    }
  }
  OrganizationHierarchy.init({
    name: DataTypes.STRING,
    parent_id: DataTypes.INTEGER,
    type_organization: DataTypes.BOOLEAN,
    active: DataTypes.BOOLEAN,
    relation: DataTypes.STRING,
    leader_id: DataTypes.INTEGER,
    leader_position_id: DataTypes.INTEGER,
    personal_area_id: DataTypes.INTEGER,
    fungsi_organisasi: DataTypes.STRING,
    keterangan_ap: DataTypes.STRING,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'OrganizationHierarchy',
    tableName: 'organization_hierarchy',
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at"
  });
  return OrganizationHierarchy;
};