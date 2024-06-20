import {Model, DataTypes} from 'sequelize';
import sequelize from '../config/Sequelize'


class Org extends Model {
  public id!: number;
  public start_date!: string;
  public end_date!: string;
  public object_type!: string;
  public object_id!: string;
  public object_name!: string;
  public subtype!: string;
  public subtype_text!: string;
  public type_of_related_object!: string;
  public object_sobid!: string;
  public object_sobid_name!: string;
  public change_on!: string;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Org.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    start_date: {
      type: DataTypes.STRING
    },
    end_date: {
      type: DataTypes.STRING
    },
    object_type: {
      type: DataTypes.STRING
    },
    object_id: {
      type: DataTypes.STRING
    },
    object_name: {
      type: DataTypes.STRING
    },
    subtype: {
      type: DataTypes.STRING
    },
    subtype_text: {
      type: DataTypes.STRING
    },
    type_of_related_object: {
      type: DataTypes.STRING
    },
    object_sobid: {
      type: DataTypes.STRING
    },
    object_sobid_name: {
      type: DataTypes.STRING
    },
    change_on: {
      type: DataTypes.STRING
    },    
    created_by: { type: DataTypes.STRING },
    updated_by: { type: DataTypes.STRING },
  },{
    sequelize,
    modelName: 'Org',
    tableName: 'org',
    schema: 'public',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

export default Org;