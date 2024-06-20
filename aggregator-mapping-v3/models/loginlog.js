'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LoginLog extends Model {
    static associate(models) {
      this.belongsTo(models.Employee, {
        foreignKey: 'employee_id',
        as: 'employee_login_log'
      })
    }
  }
  LoginLog.init({
    employee_id: DataTypes.NUMBER,
    username: DataTypes.STRING,
    login_time: DataTypes.DATE,
    login_by: DataTypes.STRING,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'LoginLog',
    tableName: 'login_log',
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at"
  });
  return LoginLog;
};