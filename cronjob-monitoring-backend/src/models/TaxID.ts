import {Model, DataTypes} from 'sequelize';
import sequelize from '../config/Sequelize'


class TaxID extends Model {
  public id!: number;
  public personnel_number!: string;
  public valid_from!: string;
  public valid_to!: string;
  public tax_id!: string;
  public marital_status!: string;
  public jumlah_tax_dependent!: string;
  public change_on!: string;
  public created_by!: string;
  public updated_by!: string;
  
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

TaxID.init(
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
    tax_id: {
      type: DataTypes.STRING
    },
    marital_status: {
      type: DataTypes.STRING
    },
    jumlah_tax_dependent: {
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
    modelName: 'TaxID',
    tableName: 'tax_id',
    schema: 'public',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

export default TaxID;