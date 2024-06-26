import { Model, DataTypes, UUIDV4 } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import sequelize from "../config/Sequelize";

import * as dotenv from "dotenv";
dotenv.config();

class ModelMasterKabupaten extends Model {
  static associate(models: any) {
    // this.belongsTo(models.StrukturWilayahPelayanan, {
    //   as: "kategori_pelayanan",
    //   foreignKey: "parent_id",
    // });
  }

  public id!: number;
  public provinsi_id!: number;
  public name!: string;
  public active!: boolean;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

ModelMasterKabupaten.init(
  {
    provinsi_id: {
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
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
    modelName: "MasterKabupaten",
    tableName: "master_kabupaten",
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// KategoriPelayanan.associate({
//   StrukturWilayahPelayanan,
// });

export default ModelMasterKabupaten;