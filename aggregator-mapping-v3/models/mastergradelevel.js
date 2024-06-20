'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MasterGradeLevel extends Model {
    static associate(models) {
      this.belongsTo(models.MasterEmployeeSubGroup, {
        foreignKey: 'subgroup_id',
        as: 'level_subgroup'
      })
    }
  }
  MasterGradeLevel.init({
    grade: DataTypes.STRING,
    level: DataTypes.STRING,
    sublevel: DataTypes.STRING,
    subgroup_id: DataTypes.INTEGER,
    kelompok_jabatan: DataTypes.ENUM('Operasional', 'Non Operasional'),
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'MasterGradeLevel',
    tableName: 'master_grade_level',
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at"
  });
  return MasterGradeLevel;
};