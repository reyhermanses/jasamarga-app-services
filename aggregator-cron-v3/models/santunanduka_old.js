'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SantunanDuka extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define associafilterAlltion here
    }
  }
  SantunanDuka.init({
    person_number : DataTypes.INTEGER,
    employee_number : DataTypes.STRING,
    employee_name : DataTypes.STRING,
    tgl_meninggal : DataTypes.DATE,
    periode_payslip : DataTypes.STRING,
    created_date : DataTypes.DATE,
    created_by : DataTypes.STRING,
    updated_date : DataTypes.DATE,
    updated_by : DataTypes.STRING,
    unit_kerja : DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'SantunanDuka',
    tableName: 'santunan_duka',
    schema: process.env.NODE_ENV,
  });
  return SantunanDuka;
};