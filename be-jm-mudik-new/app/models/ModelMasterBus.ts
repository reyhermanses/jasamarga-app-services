import { Model, DataTypes, UUIDV4 } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import sequelize from "../config/Sequelize";

import * as dotenv from "dotenv";
dotenv.config();

class ModelMasterBus extends Model {
  static associate(models: any) {
    // this.belongsTo(models.StrukturWilayahPelayanan, {
    //   as: "kategori_pelayanan",
    //   foreignKey: "parent_id",
    // });
  }

  public id!: number;
  public master_rute_id!: number;
  public master_child_rute_id!: number;
  public nomor!: string;
  public muatan!: string;
  public sisa_mauatan!: string;
  public active!: boolean;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

ModelMasterBus.init(
  {
    master_rute_id: {
      type: DataTypes.INTEGER,
    },
    nomor: {
      type: DataTypes.STRING,
    },
    muatan: {
      type: DataTypes.STRING
    },
    sisa_muatan:{
      type: DataTypes.STRING
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
    modelName: "MasterBus",
    tableName: "master_bus",
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// KategoriPelayanan.associate({
//   StrukturWilayahPelayanan,
// });

export default ModelMasterBus;