import { Model, DataTypes, UUIDV4 } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import sequelize from "../config/Sequelize";

import * as dotenv from "dotenv";
dotenv.config();

class ModelCheckin extends Model {
  static associate(models: any) {
    // this.belongsTo(models.StrukturWilayahPelayanan, {
    //   as: "kategori_pelayanan",
    //   foreignKey: "parent_id",
    // });
  }

  public id!: number;
  public registration_member_id!: number;
  public bus_id!: number;
  public status!: boolean;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

ModelCheckin.init(
  {
    registration_member_id: {
      type: DataTypes.INTEGER,
    },
    bus_id: {
      type: DataTypes.INTEGER,
    },
    status: {
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
    modelName: "ModelCheckin",
    tableName: "checkin",
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// KategoriPelayanan.associate({
//   StrukturWilayahPelayanan,
// });

export default ModelCheckin;