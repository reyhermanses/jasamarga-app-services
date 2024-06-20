'use strict';
const {
  Model
} = require('sequelize');
require('dotenv').config();
module.exports = (sequelize, DataTypes) => {
  class MasterDirektorat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MasterDirektorat.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'MasterDirektorat',
    schema: process.env.NODE_ENV,
  });
  return MasterDirektorat;
};