import { Model, DataTypes, UUIDV4 } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import sequelize from "../config/Sequelize";

import * as dotenv from "dotenv";
import ModelMasterKecamatan from './ModelMasterKecamatan';
dotenv.config();

class ModelMasterChildRute extends Model {
  static associate(models: any) {
    this.hasOne(models.ModelMasterKecamatan, {
      as: "kecamatan",
      sourceKey: "kecamatan_id",
      foreignKey: "id",
    })
  }

  public id!: number;
  public rute_id!: number;
  public kecamatan_id!: number;
  public is_show!: boolean;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

ModelMasterChildRute.init(
  {
    rute_id: {
      type: DataTypes.INTEGER,
    },
    kecamatan_id: {
      type: DataTypes.INTEGER,
    },
    is_show: {
      type: DataTypes.BOOLEAN,
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
    modelName: "ModelMasterChildRute",
    tableName: "master_child_rute",
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

ModelMasterChildRute.associate({
  ModelMasterKecamatan
});

export default ModelMasterChildRute;