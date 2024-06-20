'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EmployeeBank extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  EmployeeBank.init({
    employee_id: DataTypes.INTEGER,
    begin_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    type_of_bank: DataTypes.STRING,
    text_type_of_bank: DataTypes.STRING,
    bank_country: DataTypes.STRING,
    text_bank_country: DataTypes.STRING,
    bank_key: DataTypes.STRING,
    bank_account: DataTypes.STRING,
    payment_method: DataTypes.STRING,
    changedate: DataTypes.STRING,
    insert_date: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'EmployeeBank',
  });
  return EmployeeBank;
};