import {Model, DataTypes} from 'sequelize';
import sequelize from '../config/Sequelize'


class Address extends Model {
  public id!: number;
  public personnel_number!: string;
  public begin_date!: string;
  public end_date!: string;
  public address_type!: string;
  public alamat_karyawan!: string;
  public kota_karyawan!: string;
  public provinsi_karyawan!: string;
  public kode_pos!: string;
  public district_kecamatan!: string;
  public kode_negara!: string;
  public telephone_number!: string;
  public no_rt!: string;
  public no_rw!: string;
  public change_on!: string;
  public created_by!: string;
  public updated_by!: string;
  
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Address.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    personnel_number: {
      type: DataTypes.STRING
    },
    begin_date: {
      type: DataTypes.STRING
    },
    end_date: {
      type: DataTypes.STRING
    },
    address_type: {
      type: DataTypes.STRING
    },
    alamat_karyawan: {
      type: DataTypes.STRING
    },
    kota_karyawan: {
      type: DataTypes.STRING
    },
    provinsi_karyawan: {
      type: DataTypes.STRING
    },
    kode_pos: {
      type: DataTypes.STRING
    },
    district_kecamatan: {
      type: DataTypes.STRING
    },
    kode_negara: {
      type: DataTypes.STRING
    },
    telephone_number: {
      type: DataTypes.STRING
    },
    no_rt: {
      type: DataTypes.STRING
    },
    no_rw: {
      type: DataTypes.STRING
    },
    change_on: {
      type: DataTypes.STRING
    },
    created_by: {
      type: DataTypes.STRING
    },
    updated_by: {
      type: DataTypes.STRING
    }
  },{
    sequelize,
    modelName: 'Address',
    tableName: 'address',
    schema: 'public',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

export default Address;