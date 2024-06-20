import { Model, DataTypes, BuildOptions } from 'sequelize';
import sequelize from '../config/Sequelize';

class User extends Model {
  public id!: number;
  public username!: string;
  public password!: string;

  // You can define relationships and methods here.

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_by: { type: DataTypes.STRING },
    updated_by: { type: DataTypes.STRING },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    schema: 'public',
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);

export default User;
