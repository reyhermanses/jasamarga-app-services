'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EmployeeProfile extends Model {
    static associate(models) {
      this.belongsTo(models.Employee, {
        foreignKey: 'employee_id',
        as: 'employee'
      })

      this.belongsTo(models.MasterProvince, {
        foreignKey: 'province_ktp_id',
        as: 'province_ktp'
      })

      this.belongsTo(models.MasterCity, {
        foreignKey: 'city_domicile_id',
        as: 'city_domicile'
      })

      this.belongsTo(models.MasterCity, {
        foreignKey: 'city_ktp_id',
        as: 'city_ktp'
      })

      this.belongsTo(models.MasterProvince, {
        foreignKey: 'province_domicile_id',
        as: 'province_domicile'
      })

      this.belongsTo(models.MasterReligion, {
        foreignKey: 'religion_id',
        as: 'profile_religion'
      })

      this.belongsTo(models.EmployeeEducation, {
        foreignKey: 'last_education_id',
        as: 'last_education'
      })

      this.belongsTo(models.MasterKelurahan, {
        foreignKey: 'kelurahan_ktp_id',
        as: 'ktp_kelurahan'
      })

      this.belongsTo(models.MasterKelurahan, {
        foreignKey: 'kelurahan_domicile_id',
        as: 'domicile_kelurahan'
      })

      this.belongsTo(models.MasterKecamatan, {
        foreignKey: 'kecamatan_ktp_id',
        as: 'ktp_kecamatan'
      })

      this.belongsTo(models.MasterKecamatan, {
        foreignKey: 'kecamatan_domicile_id',
        as: 'domicile_kecamatan'
      })
    }
  }
  EmployeeProfile.init({
    employee_id: DataTypes.INTEGER,
    national_identifier: DataTypes.STRING,
    place_of_birth: DataTypes.STRING(20),
    date_of_birth: DataTypes.DATEONLY,
    gender: {
      type: DataTypes.BOOLEAN,
      get: function () {
        if (this.getDataValue('gender') == false) {
          return 'Perempuan'
        } else {
          return 'Laki-Laki'
        }
      }
    },
    address_ktp: DataTypes.STRING(100),
    address_domicile: DataTypes.STRING(100),
    province_ktp_id: DataTypes.INTEGER,
    city_domicile_id: DataTypes.INTEGER,
    province_domicile_id: DataTypes.INTEGER,
    front_title_education: DataTypes.STRING(20),
    end_title_education: DataTypes.STRING(20),
    religion_id: DataTypes.INTEGER,
    marital_status: DataTypes.STRING(20),
    npwp: DataTypes.STRING(100),
    status_npwp: DataTypes.STRING(10),
    blood_type: DataTypes.STRING(10),
    kecamatan_ktp_id: DataTypes.STRING,
    kecamatan_domicile_id: DataTypes.STRING,
    kelurahan_ktp_id: DataTypes.STRING,
    kelurahan_domicile_id: DataTypes.STRING,
    height: DataTypes.STRING(10),
    weight: DataTypes.STRING(10),
    telephone_no: DataTypes.STRING(20),
    bpjs_kes_no: DataTypes.STRING(20),
    bpjs_ket_no: DataTypes.STRING(20),
    paspor_no: DataTypes.STRING(20),
    facebook: DataTypes.STRING(100),
    twitter: DataTypes.STRING(100),
    instagram: DataTypes.STRING(100),
    summary: DataTypes.STRING(100),
    interest: DataTypes.STRING(100),
    last_education_id: DataTypes.INTEGER,
    email_pribadi: DataTypes.STRING(50),
    rt: DataTypes.STRING(10),
    rw: DataTypes.STRING(10),
    kd_pos: DataTypes.STRING(10),
    email_perusahaan: DataTypes.STRING,
    rt_domicile: DataTypes.STRING(10),
    rw_domicile: DataTypes.STRING,
    no_dana_pension: DataTypes.STRING,
    no_kk: DataTypes.STRING,
    kd_pos_domicile: DataTypes.STRING,
    created_by: DataTypes.STRING,
    updated_by: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'EmployeeProfile',
    tableName: 'employee_profile',
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at"
  });
  return EmployeeProfile;
};