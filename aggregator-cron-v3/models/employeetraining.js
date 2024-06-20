'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EmployeeTraining extends Model {
    static associate(models) {
      // define association here
      this.belongsTo(models.Employee, {
        foreignKey: 'employee_id',
        as: 'employee_training'
      })
    }
  }
  EmployeeTraining.init({
    employee_id: DataTypes.INTEGER,
    tahun: DataTypes.INTEGER,
    pelatihan: DataTypes.STRING,
    pelaksanaan: DataTypes.STRING,
    tgl_awal: DataTypes.DATE,
    tgl_akhir: DataTypes.DATE,
    hari: DataTypes.INTEGER,
    tempat: DataTypes.STRING,
    kota: DataTypes.STRING,
    inisiator: DataTypes.STRING,
    no_penugasan: DataTypes.STRING,
    klp_plth1: DataTypes.STRING,
    klp_plth2: DataTypes.STRING,
    negara: DataTypes.STRING,
    nosertifikat: DataTypes.STRING,
    nilai: DataTypes.STRING,
    peringkat: DataTypes.STRING,
    biaya: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'EmployeeTraining',
    tableName: 'employee_training',
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at"
  });
  return EmployeeTraining;
};