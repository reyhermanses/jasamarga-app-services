import { Model, DataTypes, UUIDV4 } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import sequelize from "../config/Sequelize";

import * as dotenv from "dotenv";
import ModelMasterKabupaten from './ModelMasterKabupaten';
import ModelMasterChildRute from './ModelMasterChildRute';
dotenv.config();

class ModelMasterRute extends Model {
  static associate(models: any) {
    // this.belongsTo(models.StrukturWilayahPelayanan, {
    //   as: "kategori_pelayanan",
    //   foreignKey: "parent_id",
    // });

    // this.belongsTo(models.ModelMasterRute, {
    //   as: "child_route",
    //   foreignKey: "parent_id",
    // })

    this.hasMany(models.ModelMasterRute, {
      as: "next_route",
      foreignKey: "parent_id",
    })

    this.hasOne(models.ModelMasterKabupaten, {
      as: "kabupaten",
      sourceKey: "kabupaten_id",
      foreignKey: "id",
    })

    this.belongsTo(models.ModelMasterChildRute, {
      as: "kota_tujuan",
      foreignKey: "id"
    })
  }

  public id!: number;
  public parent_id!: number;
  public kabupaten_id!: number;
  public route!: string;
  public route_level!: string;
  public latitude!: string;
  public longtitude!: string;
  public is_show!: boolean;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

ModelMasterRute.init(
  {
    parent_id: {
      type: DataTypes.INTEGER,
    },
    kabupaten_id: {
      type: DataTypes.INTEGER
    },
    route: {
      type: DataTypes.ENUM('UTARA', 'SELATAN'),
    },
    route_level:{
      type: DataTypes.STRING
    },
    latitude:{
      type: DataTypes.STRING
    },
    longtitude:{
      type: DataTypes.STRING
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
    modelName: "MasterRute",
    tableName: "master_rute",
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

ModelMasterRute.associate({
  ModelMasterRute,
  ModelMasterKabupaten,
  ModelMasterChildRute
});

export default ModelMasterRute;