'use strict';
const {
  Model
} = require('sequelize');
require('dotenv').config();
module.exports = (sequelize, DataTypes) => {
  class UnitDirektoratRelation extends Model {
    static associate(models) {
      this.hasMany(models.MasterPosition, {
        foreignKey: 'unit_kerja_id',
        as: 'relation_direktorat_unit'
      })
    }
  }
  UnitDirektoratRelation.init({
    name: DataTypes.STRING,
    direktorat_id: DataTypes.INTEGER,
    direktorat_name: DataTypes.STRING,
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'UnitDirektoratRelation',
    tableName: 'unit_direktorat_relation',
    schema: process.env.NODE_ENV,
    timestamps: false
  });
  return UnitDirektoratRelation;
};