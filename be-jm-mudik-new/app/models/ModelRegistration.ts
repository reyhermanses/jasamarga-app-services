import { Model, DataTypes, UUIDV4 } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import sequelize from "../config/Sequelize";

import * as dotenv from "dotenv";
import ModelPic from './ModelPic';
import ModelMasterRute from './ModelMasterRute';
import ModelMasterChildRute from "./ModelMasterChildRute";
dotenv.config();

class ModelRegistration extends Model {
  static associate(models: any) {
    this.belongsTo(models.ModelPic, {
      as: "pic",
      foreignKey: "pic_id",
    });
    this.belongsTo(models.ModelMasterRute,{
      as: "kota_tujuan_akhir",
      foreignKey: "master_rute_id",
    })
    this.belongsTo(models.ModelMasterChildRute,{
      as: "kota_tujuan",
      foreignKey: "master_child_rute_id",
    })
  }

  public id!: number;
  public pic_id!: number;
  public master_rute_id!: number;
  public master_child_rute_id!: number;
  public master_tanggal_mudik_id!: number;
  public registration_number!: string;
  public registration_place!: string;
  public status!: Enumerator;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

ModelRegistration.init(
  {
    pic_id: {
      type: DataTypes.INTEGER,
    },
    master_rute_id: {
      type: DataTypes.INTEGER,
    },
    master_child_rute_id: {
      type: DataTypes.INTEGER,
    },
    master_tanggal_mudik_id: {
      type: DataTypes.INTEGER
    },
    registration_number: {
      type: DataTypes.STRING
    },
    registration_place: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.ENUM('Registration', 'Registered', 'Checkin', 'Cancel')
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
    modelName: "ModelRegistration",
    tableName: "registration",
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

ModelRegistration.associate({
  ModelPic,
  ModelMasterRute,
  ModelMasterChildRute
});

export default ModelRegistration;