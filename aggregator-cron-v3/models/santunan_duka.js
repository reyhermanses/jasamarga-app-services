'use strict';
const {
  Model
} = require('sequelize');
require('dotenv').config();
module.exports = (sequelize, DataTypes) => {
  class SantunanDuka1 extends Model {
    static associate(models) {
      // define associafilterAlltion here
      // this.belongsTo(models.Employee, {
      //   foreignKey: 'employee_id',
      //   as: 'employee_santunan_duka'
      // })
    }
  }
  SantunanDuka1.init({
    employee_id : DataTypes.INTEGER,
    status : DataTypes.ENUM('Operasional', 'Non Operasional'),
    keydate : DataTypes.STRING(100),
    created_at : DataTypes.DATE,
    created_by : DataTypes.STRING(100),
    updated_at : DataTypes.DATE,
    updated_by : DataTypes.STRING(100),
  }, {
    sequelize,
    modelName: 'SantunanDuka1',
    tableName: 'santunan_duka',
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at"
  }); 
  return SantunanDuka1;
};