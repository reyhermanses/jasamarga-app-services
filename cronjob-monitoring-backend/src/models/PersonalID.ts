import {Model, DataTypes} from 'sequelize';
import sequelize from '../config/Sequelize'


class PersonalID extends Model {
  public id!: number;
  public personnel_number!: string;
  public valid_from!: string;
  public valid_to!: string;
  public type_identitas!: string;
  public no_identitas!: string;
  public change_on!: string;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

PersonalID.init(
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
    type_identitas: {
      type: DataTypes.STRING
    },
    no_identitas: {
      type: DataTypes.STRING
    },
    change_on: {
      type: DataTypes.STRING
    },               
    created_by: { type: DataTypes.STRING },
    updated_by: { type: DataTypes.STRING },
  },{
    sequelize,
    modelName: 'PersonalID',
    tableName: 'personal_id',
    schema: 'public',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

export default PersonalID;