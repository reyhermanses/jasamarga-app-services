'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserAuth extends Model {
    static associate(models) {
      this.belongsTo(models.Employee, {
        foreignKey: 'employee_id',
        as: 'employee'
      })
    }
  }
  UserAuth.init({
    employee_id: DataTypes.INTEGER,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    password_expires: DataTypes.DATE,
    is_ldap: DataTypes.BOOLEAN,
    is_mobile: DataTypes.BOOLEAN,
    token: DataTypes.STRING,
    token_firebase: DataTypes.STRING,
    last_login: DataTypes.DATE,
    default_password: DataTypes.BOOLEAN,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'UserAuth',
    tableName: 'user_auth',
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at"
  });
  return UserAuth;
};