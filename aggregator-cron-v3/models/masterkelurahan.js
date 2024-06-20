'use strict';
const {
  Model
} = require('sequelize');
require('dotenv').config()
module.exports = (sequelize, DataTypes) => {
  class MasterKelurahan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.MasterKecamatan, {
        foreignKey: 'kecamatan_id',
        as: 'master_kecamatan'
      })
    }
  }
  MasterKelurahan.init({
    kecamatan_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    updated_by: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'MasterKelurahan',
    tableName: 'master_kelurahan',
    schema: process.env.NODE_ENV,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return MasterKelurahan;
};