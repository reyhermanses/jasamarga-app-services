import {Model, DataTypes} from 'sequelize';
import sequelize from '../config/Sequelize'


class Education extends Model {
  public id!: number;
  public personnel_number!: string;
  public begin_date!: string;
  public end_date!: string;
  public level_pendidikan!: string;
  public jurusan_kuliah_training!: string;
  public institusi_penyelenggara!: string;
  public country!: string;
  public certificate!: string;
  public dur_of_course!: string;
  public time_unit_meas!: string;
  public jurusan!: string;
  public final_grade!: string;
  public no_certificate!: string;
  public location!: string;
  public change_on!: string;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Education.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    personnel_number: {
      type: DataTypes.STRING
    },
    begin_date: {
      type: DataTypes.STRING
    },
    end_date: {
      type: DataTypes.STRING
    },
    level_pendidikan: {
      type: DataTypes.STRING
    },
    jurusan_kuliah_training: {
      type: DataTypes.STRING
    },
    institusi_penyelenggara: {
      type: DataTypes.STRING
    },
    country: {
      type: DataTypes.STRING
    },
    certificate: {
      type: DataTypes.STRING
    },
    dur_of_course: {
      type: DataTypes.STRING
    },
    time_unit_meas: {
      type: DataTypes.STRING
    },
    jurusan: {
      type: DataTypes.STRING
    },
    final_grade: {
      type: DataTypes.STRING
    },
    no_certificate: {
      type: DataTypes.STRING
    },
    location: {
      type: DataTypes.STRING
    },
    change_on: {
      type: DataTypes.STRING
    },           
    created_by: { type: DataTypes.STRING },
    updated_by: { type: DataTypes.STRING },
  },{
    sequelize,
    modelName: 'Education',
    tableName: 'education',
    schema: 'public',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

export default Education;