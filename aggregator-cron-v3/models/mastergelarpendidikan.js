"use strict";
const { Model } = require("sequelize");
require("dotenv").config();
module.exports = (sequelize, DataTypes) => {
  class MasterGelarPendidikan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MasterGelarPendidikan.init(
    {
      name: DataTypes.STRING,
      gelar: DataTypes.STRING,
      type: DataTypes.ENUM('Strata 1', 'Strata 2', 'Strata 3'),
      active: DataTypes.BOOLEAN,
      position: DataTypes.ENUM('front', 'end'),
      created_by: DataTypes.STRING,
      updated_by: DataTypes.STRING,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "MasterGelarPendidikan",
      tableName: "master_gelar_pendidikan",
      schema: process.env.NODE_ENV,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return MasterGelarPendidikan;
};
