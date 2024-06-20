import {Model, DataTypes} from 'sequelize';
import sequelize from '../config/Sequelize'


class Approver extends Model {
  public id!: number;
  public personnel_number!: string;
  public complete_name!: string;
  public start_date!: string;
  public org_unit!: string;
  public org_unit_text!: string;
  public department!: string;
  public department_text!: string;
  public position!: string;
  public position_name!: string;
  public personnel_num_approver!: string;
  public name_approver!: string;
  public position_appr!: string;
  public position_name_appr!: string;
  public org_approver!: string;
  public org_text_approver!: string;
  public change_on!: string;
  public created_by!: string;
  public updated_by!: string;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Approver.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    personnel_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    complete_name: {
      type: DataTypes.STRING
    },
    start_date: {
      type: DataTypes.STRING
    },
    org_unit: {
      type: DataTypes.STRING
    },
    org_unit_text: {
      type: DataTypes.STRING
    },
    department: {
      type: DataTypes.STRING
    },
    department_text: {
      type: DataTypes.STRING
    },
    position: {
      type: DataTypes.STRING
    },
    position_name:{
      type: DataTypes.STRING
    },
    personnel_num_approver: {
      type: DataTypes.STRING
    },
    name_approver: {
      type: DataTypes.STRING
    },
    position_appr: {
      type: DataTypes.STRING
    },
    position_name_appr: {
      type: DataTypes.STRING
    }, 
    org_approver: {
      type: DataTypes.STRING
    },
    org_text_approver: {
      type: DataTypes.STRING
    },
    change_on: {
      type: DataTypes.STRING
    },
    created_by: { type: DataTypes.STRING },
    updated_by: { type: DataTypes.STRING },
  },{
    sequelize,
    modelName: 'Approver',
    tableName: 'approver',
    schema: 'public',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

export default Approver;