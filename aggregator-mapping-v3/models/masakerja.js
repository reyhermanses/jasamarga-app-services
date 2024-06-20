'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MasaKerja extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MasaKerja.init({
    masa_kerja: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'MasaKerja',
  });
  return MasaKerja;
};