"use strict";
const { Model } = require("sequelize");
require("dotenv").config();
module.exports = (sequelize, DataTypes) => {
  class MasterInstansiPendidikan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MasterInstansiPendidikan.init(
    {
      name: DataTypes.STRING,
      active: DataTypes.BOOLEAN,
      created_by: DataTypes.STRING,
      updated_by: DataTypes.STRING,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "MasterInstansiPendidikan",
      tableName: "master_instansi_pendidikan",
      schema: process.env.NODE_ENV,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return MasterInstansiPendidikan;
};
