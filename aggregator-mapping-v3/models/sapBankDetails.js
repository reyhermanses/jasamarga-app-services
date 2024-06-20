'use strict';
const {
    Model
} = require('sequelize');
require('dotenv').config();
module.exports = (sequelize, DataTypes) => {
    class SapBankDetails extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    SapBankDetails.init({
        personnel_number: DataTypes.STRING,
        begin_date: DataTypes.DATE,
        end_date: DataTypes.DATE,
        type_of_bank: DataTypes.STRING,
        text_type_of_bank: DataTypes.STRING,
        payee: DataTypes.STRING,
        bank_country: DataTypes.STRING,
        text_bank_country: DataTypes.STRING,
        bank_key: DataTypes.STRING,
        bank_account: DataTypes.STRING,
        payment_method: DataTypes.STRING,
        text_payment_method: DataTypes.STRING,
        changedate: DataTypes.STRING,
        insert_date: DataTypes.DATE,
        syn_status: DataTypes.STRING,
        opera: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'SapBankDetails',
        tableName: 'sap_bank_details',
        schema: 'sap_satelit',
        createdAt: false,
        updatedAt: false,
        freezeTableName: true,
    });
    SapBankDetails.removeAttribute('id')
    return SapBankDetails;
};