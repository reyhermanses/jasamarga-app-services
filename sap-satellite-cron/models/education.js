'use strict';
const {
  Model
} = require('sequelize');
require('dotenv').config();
module.exports = (sequelize, DataTypes) => {
  class Education extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Education.init({
    personnel_number: DataTypes.STRING,
    begin_date: DataTypes.STRING,
    end_date: DataTypes.STRING,
    level_pendidikan: DataTypes.STRING,
    jurusan_kuliah_training: DataTypes.STRING,
    institusi_penyelenggara: DataTypes.STRING,
    country: DataTypes.STRING,
    certificate: DataTypes.STRING,
    dur_of_course: DataTypes.STRING,
    time_unit_meas: DataTypes.STRING,
    jurusan: DataTypes.STRING,
    final_grade: DataTypes.STRING,
    no_certificate: DataTypes.STRING,
    location: DataTypes.STRING,
    change_on: DataTypes.STRING,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Education',
    tableName: 'education',
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at"
  });
  return Education;
};