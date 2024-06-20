import {Model, DataTypes} from 'sequelize';
import sequelize from '../config/Sequelize'


class OmAction extends Model {
  public id!: number;
  public begin_date!: string;
  public end_date!: string;
  public personnel_number!: string;
  public name!: string;
  public action!: string;
  public emp_status!: string;
  public personal_area!: string;
  public text_personal_area!: string;
  public employee_group!: string;
  public text_employee_group!: string;
  public employee_subgroup!: string;
  public text_employee_subgroup!: string;
  public personal_sub_area!: string;
  public text_personal_subarea!: string;
  public cost_center!: string;
  public organisasi_key!: string;
  public text_organisasi_key!: string;
  public position_key!: string;
  public text_position_key!: string;
  public job_key!: string;
  public text_job_key!: string;
  public section!: string;
  public text_section!: string;
  public departement!: string;
  public text_departement!: string;
  public unit_kerja!: string;
  public text_unit_kerja!: string;
  public kelompok_jabatan!: string;
  public pay_scale_area!: string;
  public grade!: string;
  public subgrade!: string;
  public change_on!: string;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

OmAction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    begin_date: {
      type: DataTypes.STRING
    },
    end_date: {
      type: DataTypes.STRING
    },
    personnel_number: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    action: {
      type: DataTypes.STRING
    },
    emp_status: {
      type: DataTypes.STRING
    },
    personal_area: {
      type: DataTypes.STRING
    },
    text_personal_area: {
      type: DataTypes.STRING
    },
    employee_group: {
      type: DataTypes.STRING
    },
    text_employee_group: {
      type: DataTypes.STRING
    },
    employee_subgroup: {
      type: DataTypes.STRING
    },
    text_employee_subgroup: {
      type: DataTypes.STRING
    },
    personal_sub_area: {
      type: DataTypes.STRING
    },
    text_personal_subarea: {
      type: DataTypes.STRING
    },
    cost_center: {
      type: DataTypes.STRING
    },
    organisasi_key: {
      type: DataTypes.STRING
    },
    text_organisasi_key: {
      type: DataTypes.STRING
    },
    position_key: {
      type: DataTypes.STRING
    },
    text_position_key: {
      type: DataTypes.STRING
    },
    job_key: {
      type: DataTypes.STRING
    },
    text_job_key: {
      type: DataTypes.STRING
    },
    section: {
      type: DataTypes.STRING
    },
    text_section: {
      type: DataTypes.STRING
    },
    departement: {
      type: DataTypes.STRING
    },
    text_departement: {
      type: DataTypes.STRING
    },
    unit_kerja: {
      type: DataTypes.STRING
    },
    text_unit_kerja: {
      type: DataTypes.STRING
    },
    kelompok_jabatan: {
      type: DataTypes.STRING
    },
    pay_scale_area: {
      type: DataTypes.STRING
    },
    grade: {
      type: DataTypes.STRING
    },
    subgrade: {
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
    modelName: 'OmAction',
    tableName: 'om_action',
    schema: 'public',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

export default OmAction;