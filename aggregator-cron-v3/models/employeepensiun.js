'use strict';
const {
    Model
} = require('sequelize');
require('dotenv').config();
module.exports = (sequelize, DataTypes) => {
    class EmployeePensiun extends Model {
        static associate(models) {
            // define associafilterAlltion here
        }
    }
    EmployeePensiun.init({
        name: DataTypes.STRING(100),
        npp: DataTypes.STRING(100),
        company_id_asal: DataTypes.INTEGER,
        personnel_number: DataTypes.STRING(100),
        unit_kerja_id: DataTypes.INTEGER,
        status: DataTypes.STRING(25),
        keydate: DataTypes.STRING(15),
        created_at: DataTypes.DATE,
        created_by: DataTypes.STRING(100),
        updated_at: DataTypes.DATE,
        updated_by: DataTypes.STRING(100),
    }, {
        sequelize,
        modelName: 'EmployeePensiun',
        tableName: 'employee_pensiun',
        schema: process.env.NODE_ENV,
        createdAt: "created_at",
        updatedAt: "updated_at"
    });
    return EmployeePensiun;
};