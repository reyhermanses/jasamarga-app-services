'use strict';
const {
  Model
} = require('sequelize');
require('dotenv').config();
module.exports = (sequelize, DataTypes) => {
  class PendingRequest extends Model {
    static associate(models) {
      this.belongsTo(models.Employee, {
        foreignKey: 'employee_id',
        as: 'pending_request_employee'
      })
    }
  }
  PendingRequest.init({
    employee_id: DataTypes.NUMBER,
    period: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'PendingRequest',
    tableName: 'pending_requests',
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at"
  });
  return PendingRequest;
};