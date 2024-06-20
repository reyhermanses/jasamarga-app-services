'use strict';
const {
  Model
} = require('sequelize');
require('dotenv').config();
module.exports = (sequelize, DataTypes) => {
  class PersonalData extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PersonalData.init({
    personnel_number: DataTypes.STRING,
    valid_from: DataTypes.STRING,
    valid_to: DataTypes.STRING,
    name: DataTypes.STRING,
    jenis_kelamin: DataTypes.STRING,
    status_pernikahan: DataTypes.STRING,
    agama: DataTypes.STRING,
    title: DataTypes.STRING,
    pre_title: DataTypes.STRING,
    post_title: DataTypes.STRING,
    tempat_lahir: DataTypes.STRING,
    tanggal_lahir: DataTypes.STRING,
    change_on: DataTypes.STRING,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'PersonalData',
    tableName: 'personal_data',
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at"
  });
  return PersonalData;
};