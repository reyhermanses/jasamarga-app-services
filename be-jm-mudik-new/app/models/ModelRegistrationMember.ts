import { Model, DataTypes, UUIDV4 } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import sequelize from "../config/Sequelize";

import * as dotenv from "dotenv";
import ModelRegistration from './ModelRegistration';
import ModelBusMember from './ModelBusMember';
dotenv.config();

class ModelRegistrationMember extends Model {
  static associate(models: any) {
    this.belongsTo(models.ModelRegistrationMember, {
      as: "relasi",
      foreignKey: "parent_id",
    });

    this.hasMany(models.ModelRegistrationMember, {
      as: "collection_relasi",
      sourceKey: "id",
      foreignKey: "parent_id",
    })

    this.belongsTo(models.ModelRegistration, {
      as: "tiket",
      foreignKey: "registration_id",
    })

    // this.hasMany(models.ModelBusMember, {
    //   as: "bus_member",
    //   sourceKey: "registration_member_id",
    //   foreignKey: "id",
    // })
  }

  public id!: number;
  public parent_id!: number;
  public registration_id!: number;
  public nama_lengkap!: string;
  public gender!: string;
  public tanggal_lahir!: Date;
  public no_ktp!: string;
  public alamat!: string;
  public no_hp!: string;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

ModelRegistrationMember.init(
  {
    parent_id: {
      type: DataTypes.INTEGER,
    },
    registration_id: {
      type: DataTypes.INTEGER,
    },
    no_ktp: {
      type: DataTypes.STRING
    },
    nama_lengkap: {
      type: DataTypes.BOOLEAN,
    },
    gender: {
      type: DataTypes.ENUM('Laki-Laki', 'Perempuan')
    },
    tanggal_lahir: {
      type: DataTypes.DATE
    },
    alamat:{
      type: DataTypes.STRING
    },
    no_hp:{
      type: DataTypes.STRING
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
    modelName: "RegistrationMember",
    tableName: "registration_member",
    schema: process.env.NODE_ENV,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

ModelRegistrationMember.associate({
  ModelRegistrationMember,
  ModelRegistration,
  // ModelBusMember
});

export default ModelRegistrationMember;