import { Model, DataTypes, UUIDV4 } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import sequelize from "../config/Sequelize";

import * as dotenv from "dotenv";
import ModelBusMember from './ModelBusMember';
dotenv.config();

class ModelBus extends Model {
  static associate(models: any) {
    // this.belongsTo(models.ModelBusMember, {
    //   as: "passenger",
    //   foreignKey: "bus_id",
    // })
  }

  public id!: number;
  public master_rute_id!: number;
  public master_child_rute_id!: number;
  public nomor!: string;
  public muatan!: string;
  public active!: boolean;
  public status!: Enumerator;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

ModelBus.init(
  {
    master_rute_id: {
      type: DataTypes.INTEGER,
    },
    master_child_rute_id: {
      type: DataTypes.INTEGER,
    },
    nomor: {
      type: DataTypes.STRING
    },
    muatan: {
      type: DataTypes.STRING
    },
    sisa_muatan: {
      type: DataTypes.INTEGER
    },
    status: {
      type: DataTypes.ENUM('Available', 'Unavailable')
    },
    active: {
      type: DataTypes.BOOLEAN
    },
    updated_by: {
      type: DataTypes.STRING,
    },
    created_by:{
      type: DataTypes.STRING,
    }
  },
  {
    sequelize,
    modelName: "ModelBus",
    tableName: "bus",
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

ModelBus.associate({
  // ModelBusMember,
});

export default ModelBus;