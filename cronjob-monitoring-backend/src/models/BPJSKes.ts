import {Model, DataTypes} from 'sequelize';
import sequelize from '../config/Sequelize'


class BPJSKes extends Model {
  public id!: number;
  public begin_date!: string;
  public end_date!: string;
  public personnel_number!: string;
  public bpjs_id!: string;
  public change_on!: string;
  public created_by!: string;
  public updated_by!: string;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

BPJSKes.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    begin_date: {
      type: DataTypes.STRING
    },
    end_date: {
      type: DataTypes.STRING
    },
    personnel_number: {
      type: DataTypes.STRING
    },
    bpjs_id: {
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
    modelName: 'BPJSKes',
    tableName: 'bpjs_kes',
    schema: 'public',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

export default BPJSKes;