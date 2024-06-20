import {Model, DataTypes} from 'sequelize';
import sequelize from '../config/Sequelize'


class Document extends Model {
  public id!: number;
  public personnel_number!: string;
  public subtype!: string;
  public valid_from!: string;
  public valid_to!: string;
  public doc_type!: string;
  public doc_country!: string;
  public doc_number!: string;
  public issue_date!: string;
  public issue_place!: string;
  public issue_ctry!: string;
  public doc_status!: string;
  public location!: string;
  public tanggal_efektif_sk!: string;
  public change_on!: string;
  public created_by!: string;
  public updated_by!: string;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Document.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    personnel_number: {
      type: DataTypes.STRING
    },
    subtype: {
      type: DataTypes.STRING
    },
    valid_from: {
      type: DataTypes.STRING
    },
    valid_to: {
      type: DataTypes.STRING
    },
    doc_type: {
      type: DataTypes.STRING
    },
    doc_country: {
      type: DataTypes.STRING
    },
    doc_number: {
      type: DataTypes.STRING
    },
    issue_date: {
      type: DataTypes.STRING
    },
    issue_place: {
      type: DataTypes.STRING
    },
    issue_ctry: {
      type: DataTypes.STRING
    },
    doc_status: {
      type: DataTypes.STRING
    },
    location: {
      type: DataTypes.STRING
    },
    tanggal_efektif_sk: {
      type: DataTypes.STRING
    },
    change_on: {
      type: DataTypes.STRING
    },
    created_by: {
      type: DataTypes.STRING
    },
    updated_by: {
      type: DataTypes.STRING
    }
  },{
    sequelize,
    modelName: 'Document',
    tableName: 'document',
    schema: 'public',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

export default Document;