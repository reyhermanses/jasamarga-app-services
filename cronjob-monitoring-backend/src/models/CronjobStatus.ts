import {Model, DataTypes} from 'sequelize';
import sequelize from '../config/Sequelize'


class CronjobStatus extends Model {
  public id!: number;
  public changedate!: string;
  public status!: boolean;
  public created_by!: string;
  public updated_by!: string;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

CronjobStatus.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    changedate: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.BOOLEAN
    },     
    created_by: { type: DataTypes.STRING },
    updated_by: { type: DataTypes.STRING },
  },{
    sequelize,
    modelName: 'CronjobStatus',
    tableName: 'cronjob_statuses',
    schema: 'public',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

export default CronjobStatus;