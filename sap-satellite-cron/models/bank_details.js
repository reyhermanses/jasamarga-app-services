'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BankDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BankDetails.init({
    begin_date: DataTypes.STRING,
    end_date: DataTypes.STRING,
    type_of_bank: DataTypes.STRING,
    bank_country: DataTypes.STRING,
    bank_key: DataTypes.STRING,
    bank_account: DataTypes.STRING,
    payment_method: DataTypes.STRING,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'BankDetails',
    tableName: "bank_details",
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at",
  });
  return BankDetails;
};