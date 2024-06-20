import { Model, DataTypes, UUIDV4 } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import sequelize from "../config/Sequelize";

import * as dotenv from "dotenv";
dotenv.config();

class ModelManagementRole extends Model {
  static associate(models: any) {
    // this.belongsTo(models.StrukturWilayahPelayanan, {
    //   as: "kategori_pelayanan",
    //   foreignKey: "parent_id",
    // });
  }

  public id!: number;
  public user_id!: number;
  public role_id!: string;
  public active!: boolean;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

ModelManagementRole.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
    },
    role_id: {
      type: DataTypes.INTEGER,
    },
    active: {
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
    modelName: "ModelManagementRole",
    tableName: "user_management",
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// KategoriPelayanan.associate({
//   StrukturWilayahPelayanan,
// });

export default ModelManagementRole;