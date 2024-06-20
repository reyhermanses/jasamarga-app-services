import { Model, DataTypes, UUIDV4 } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import sequelize from "../config/Sequelize";

import * as dotenv from "dotenv";
import ModelBus from "./ModelBus";
import ModelRegistrationMember from './ModelRegistrationMember';
dotenv.config();

class ModelBusMember extends Model {
  static associate(models: any) {
    // this.belongsTo(models.StrukturWilayahPelayanan, {
    //   as: "kategori_pelayanan",
    //   foreignKey: "parent_id",
    // });
    // this.belongsTo(models.ModelBus, {
    //   as: "bus",
    //   foreignKey: "bus_id",
    // });

    this.belongsTo(models.ModelRegistrationMember, {
      as: "passenger",
      foreignKey: "registration_member_id",
    })
  }

  public id!: number;
  public bus_id!: number;
  public registration_member_id!: number;
  public active!: boolean

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

ModelBusMember.init(
  {
    bus_id: {
      type: DataTypes.INTEGER,
    },
    registration_member_id: {
      type: DataTypes.INTEGER,
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
    modelName: "ModelBusMember",
    tableName: "bus_member",
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

ModelBusMember.associate({
  // ModelBus,
  ModelRegistrationMember
});

export default ModelBusMember;