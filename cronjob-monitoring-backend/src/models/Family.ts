import {Model, DataTypes} from 'sequelize';
import sequelize from '../config/Sequelize'


class Family extends Model {
  public id!: number;
  public personnel_number!: string;
  public begin_date!: string;
  public end_date!: string;
  public object_id!: string;
  public kode_hubungan!: string;
  public nama_keluarga!: string;
  public jenis_kelamin!: string;
  public tanggal_lahir!: string;
  public tempat_lahir!: string;
  public change_on!: string;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Family.init(
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
    object_id: {
      type: DataTypes.STRING
    },
    kode_hubungan: {
      type: DataTypes.STRING
    },
    nama_keluarga: {
      type: DataTypes.STRING
    },
    jenis_kelamin: {
      type: DataTypes.STRING
    },
    tanggal_lahir: {
      type: DataTypes.STRING
    },
    tempat_lahir: {
      type: DataTypes.STRING
    },
    change_on: {
      type: DataTypes.STRING
    },            
    created_by: { type: DataTypes.STRING },
    updated_by: { type: DataTypes.STRING },
  },{
    sequelize,
    modelName: 'Family',
    tableName: 'family',
    schema: 'public',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

export default Family;