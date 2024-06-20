import {Model, DataTypes} from 'sequelize';
import sequelize from '../config/Sequelize'


class PersonalData extends Model {
  public id!: number;
  public personnel_number!: string;
  public valid_from!: string;
  public valid_to!: string;
  public name!: string;
  public jenis_kelamin!: string;
  public status_pernikahan!: string;
  public agama!: string;
  public title!: string;
  public pre_title!: string;
  public post_title!: string;
  public tempat_lahir!: string;
  public tanggal_lahir!: string;
  public change_on!: string;


  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

PersonalData.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    personnel_number: {
      type: DataTypes.STRING
    },
    valid_from: {
      type: DataTypes.STRING
    },
    valid_to: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    jenis_kelamin: {
      type: DataTypes.STRING
    },
    status_pernikahan: {
      type: DataTypes.STRING
    },
    agama: {
      type: DataTypes.STRING
    },
    title: {
      type: DataTypes.STRING
    },
    pre_title: {
      type: DataTypes.STRING
    },
    post_title: {
      type: DataTypes.STRING
    },
    tempat_lahir: {
      type: DataTypes.STRING
    },
    tanggal_lahir: {
      type: DataTypes.STRING
    },
    change_on: {
      type: DataTypes.STRING
    },                   
    created_by: { type: DataTypes.STRING },
    updated_by: { type: DataTypes.STRING },
  },{
    sequelize,
    modelName: 'PersonalData',
    tableName: 'personal_data',
    schema: 'public',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

export default PersonalData;